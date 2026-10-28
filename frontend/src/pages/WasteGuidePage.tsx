import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  AlertTriangle,
  Recycle,
  Check,
  X,
  Info,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { WasteItem } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const WasteGuidePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [items, setItems] = useState<WasteItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load categories
    api.getCategories()
      .then((cats) => setCategories(['All', ...cats]))
      .catch(() => setCategories(['All']));
  }, []);

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedCategory && selectedCategory !== 'All') {
        const data = await api.getWasteItems(selectedCategory);
        setItems(data);
      } else {
        const data = await api.getWasteItems();
        setItems(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load waste items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadItems();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await api.searchWasteItems(searchQuery);
      setItems(results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
          <Recycle className="w-3.5 h-3.5 text-forest-600" />
          <span>Database-Backed Waste Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Waste Segregation Guide</h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Disposal and recycling guidelines for common campus and household items. Rules may differ by city; please verify local municipal recycler criteria.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items (e.g., plastic bottle, battery, milk carton, tea leaves)..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 items-center">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  isSelected
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Acceptance Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Important Recycling Note:</strong> Not all plastics, glass, or paper packaging are universally accepted by every recycler. Local collection rules vary based on processing machinery. Check preparation instructions below for best results.
        </p>
      </div>

      {/* Results Listing */}
      {loading ? (
        <LoadingSpinner message="Searching verified waste items from database..." />
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          Failed to load catalog: {error}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No Matching Waste Items Found"
          description={`We couldn't find items matching "${searchQuery}". Try a broader term like 'paper', 'plastic', or select 'All' categories.`}
          actionText="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
            loadItems();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-forest-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-forest-700 transition">
                    {item.name}
                  </h3>
                </div>

                <CategoryBadge category={item.category} />

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.safety_warning && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">Safety Caution: {item.safety_warning}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[11px] font-medium">
                  {item.recyclable && (
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Recyclable</span>
                  )}
                  {item.compostable && (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Compostable</span>
                  )}
                </div>
                <span className="text-forest-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                  Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-forest-950">{selectedItem.name}</h2>
                <CategoryBadge category={selectedItem.category} />
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Instructions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-forest-50/70 border border-forest-100 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-forest-600" />
                  <span>Disposal Instructions</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedItem.disposal_instructions}</p>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1">
                  <Recycle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Recycling & Recovery</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedItem.recycling_information}</p>
              </div>
            </div>

            {/* Preparation */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Preparation Steps Before Binning</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedItem.preparation_instructions}</p>
            </div>

            {/* Safety Warning */}
            {selectedItem.safety_warning && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1 text-amber-900">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Safety Caution</span>
                </h4>
                <p className="text-xs leading-relaxed">{selectedItem.safety_warning}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold transition"
              >
                Close Item Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
