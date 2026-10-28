import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BarChart3,
  ListFilter,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  RefreshCw,
  Key,
  X,
  Save,
} from 'lucide-react';
import { api } from '../services/api';
import {
  CollectionRequest,
  WasteItem,
  WasteItemCreate,
  DashboardStats,
  CategoryDistributionItem,
} from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'waste-guide' | 'analytics'>('requests');
  const [adminKey, setAdminKey] = useState<string>('dev-admin-secret-change-in-production');
  const [keyInput, setKeyInput] = useState<string>('dev-admin-secret-change-in-production');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [distribution, setDistribution] = useState<CategoryDistributionItem[]>([]);
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authModeNotice, setAuthModeNotice] = useState<string>('Academic Demo Authorization Mode');

  // Request editing state
  const [editingRequest, setEditingRequest] = useState<CollectionRequest | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Pending');
  const [partnerNote, setPartnerNote] = useState<string>('');

  // Waste item modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState<WasteItemCreate>({
    name: '',
    category: 'Dry Recyclable',
    description: '',
    disposal_instructions: '',
    recycling_information: '',
    preparation_instructions: '',
    safety_warning: '',
    recyclable: true,
    compostable: false,
  });

  useEffect(() => {
    loadAllData();
  }, [adminKey]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, distData, requestsData, itemsData, overviewData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getCategoryDistribution().catch(() => []),
        api.getAdminRequests(undefined, adminKey).catch((err) => {
          throw new Error(`Admin authorization error: ${err.message}`);
        }),
        api.getWasteItems().catch(() => []),
        api.getAdminOverview(adminKey).catch(() => null),
      ]);

      if (statsData) setStats(statsData);
      setDistribution(distData);
      setRequests(requestsData);
      setWasteItems(itemsData);
      if (overviewData?.authorization_mode) {
        setAuthModeNotice(overviewData.authorization_mode);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load admin console');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingRequest) return;
    try {
      await api.updateRequestStatus(editingRequest.id!, newStatus, partnerNote, adminKey);
      setEditingRequest(null);
      await loadAllData();
    } catch (err: any) {
      alert(`Error updating request: ${err.message}`);
    }
  };

  const handleSaveWasteItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateWasteItem(editingItemId, itemForm, adminKey);
      } else {
        await api.createWasteItem(itemForm, adminKey);
      }
      setItemModalOpen(false);
      setEditingItemId(null);
      await loadAllData();
    } catch (err: any) {
      alert(`Error saving waste item: ${err.message}`);
    }
  };

  const handleDeleteWasteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this waste guide item?')) return;
    try {
      await api.deleteWasteItem(id, adminKey);
      await loadAllData();
    } catch (err: any) {
      alert(`Error deleting waste item: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-900 text-emerald-300 text-xs font-semibold border border-forest-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Control & Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-600 text-sm">
            Manage live collection requests, oversee database catalog entries, and review authentic operational metrics.
          </p>
        </div>

        {/* Admin Secret Key Config Bar */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl text-xs shadow-sm">
          <Key className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin Secret Key"
            className="text-xs p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-500 w-44 font-mono"
          />
          <button
            onClick={() => setAdminKey(keyInput)}
            className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-lg font-semibold"
          >
            Apply Key
          </button>
        </div>
      </div>

      {/* Auth Mode Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
        <span className="font-medium">
          Status: <strong>{authModeNotice}</strong> (Protected by server-side authorization check)
        </span>
        <button
          onClick={loadAllData}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          <span>Reload</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'requests'
              ? 'border-forest-700 text-forest-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Collection Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('waste-guide')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'waste-guide'
              ? 'border-forest-700 text-forest-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Waste Guide Catalog ({wasteItems.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'analytics'
              ? 'border-forest-700 text-forest-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Real Database Analytics
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading administrative data from database..." />
      ) : activeTab === 'requests' ? (
        /* Requests Management Tab */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">All Collection Requests (PostgreSQL)</h2>
            <span className="text-xs text-slate-500">Includes privileged requester contact numbers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Pickup Area</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.request_code} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-forest-800">{req.request_code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{req.requester_name || 'Anonymous'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{req.contact_phone || 'No phone'}</div>
                      <div className="text-[10px] text-slate-400">{req.contact_email || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={req.waste_category} />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {req.quantity} {req.quantity_unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate">{req.pickup_area}</td>
                    <td className="px-4 py-3 text-slate-600">{req.preferred_pickup_date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingRequest(req);
                          setNewStatus(req.status);
                          setPartnerNote(req.partner_note || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 rounded-lg transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'waste-guide' ? (
        /* Waste Guide Management Tab */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Database Waste Guide Items</h2>
              <p className="text-xs text-slate-500">Create, edit, or remove catalog segregation items</p>
            </div>
            <button
              onClick={() => {
                setEditingItemId(null);
                setItemForm({
                  name: '',
                  category: 'Dry Recyclable',
                  description: '',
                  disposal_instructions: '',
                  recycling_information: '',
                  preparation_instructions: '',
                  safety_warning: '',
                  recyclable: true,
                  compostable: false,
                });
                setItemModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Add Waste Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Disposal Summary</th>
                  <th className="px-4 py-3">Recyclable</th>
                  <th className="px-4 py-3">Compostable</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wasteItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{item.disposal_instructions}</td>
                    <td className="px-4 py-3 font-medium">
                      {item.recyclable ? <span className="text-emerald-700">Yes</span> : <span className="text-slate-400">No</span>}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.compostable ? <span className="text-emerald-700">Yes</span> : <span className="text-slate-400">No</span>}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setItemForm({
                            name: item.name,
                            category: item.category,
                            description: item.description,
                            disposal_instructions: item.disposal_instructions,
                            recycling_information: item.recycling_information,
                            preparation_instructions: item.preparation_instructions,
                            safety_warning: item.safety_warning || '',
                            recyclable: item.recyclable,
                            compostable: item.compostable,
                          });
                          setItemModalOpen(true);
                        }}
                        className="text-slate-600 hover:text-forest-700 p-1"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteWasteItem(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Authentic Analytics Tab */
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Data Authenticity Guarantee:</strong> The metrics below are computed in real time from SQL aggregate queries on your PostgreSQL database. No artificial statistics (such as fabricated carbon offsets or fake diverted weights) are used.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs uppercase font-semibold text-slate-500 block">Total Requests</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{stats?.total_requests ?? 0}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Records in database</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs uppercase font-semibold text-amber-700 block">Pending</span>
              <span className="text-3xl font-extrabold text-amber-700 mt-2 block">{stats?.pending_requests ?? 0}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Awaiting partner</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs uppercase font-semibold text-indigo-700 block">Scheduled</span>
              <span className="text-3xl font-extrabold text-indigo-700 mt-2 block">{stats?.scheduled_requests ?? 0}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Vehicles assigned</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs uppercase font-semibold text-forest-700 block">Completed</span>
              <span className="text-3xl font-extrabold text-forest-700 mt-2 block">{stats?.completed_requests ?? 0}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stats?.completion_rate_percent}% completion rate
              </span>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Waste Category Distribution Breakdown</h3>
            {distribution.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No collection request distribution data logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {distribution.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.category}</span>
                      <span className="text-slate-500">
                        {item.count} requests ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Management Modal */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Manage Request: {editingRequest.request_code}
              </h3>
              <button onClick={() => setEditingRequest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Update Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Collected">Collected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Partner Note:</label>
                <textarea
                  rows={3}
                  value={partnerNote}
                  onChange={(e) => setPartnerNote(e.target.value)}
                  placeholder="Notes for requester or logistics crew..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waste Item Add/Edit Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItemId ? 'Edit Waste Guide Item' : 'Add New Waste Guide Item'}
              </h3>
              <button onClick={() => setItemModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWasteItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Broken Ceramic Mug"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Wet / Biodegradable">Wet / Biodegradable</option>
                    <option value="Dry Recyclable">Dry Recyclable</option>
                    <option value="Residual / Non-Recyclable">Residual / Non-Recyclable</option>
                    <option value="Domestic Hazardous">Domestic Hazardous</option>
                    <option value="Electronic Waste">Electronic Waste</option>
                    <option value="Special Handling">Special Handling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Disposal Instructions *</label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.disposal_instructions}
                  onChange={(e) => setItemForm({ ...itemForm, disposal_instructions: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recycling Information *</label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.recycling_information}
                  onChange={(e) => setItemForm({ ...itemForm, recycling_information: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preparation Instructions *</label>
                <input
                  type="text"
                  required
                  value={itemForm.preparation_instructions}
                  onChange={(e) => setItemForm({ ...itemForm, preparation_instructions: e.target.value })}
                  placeholder="e.g. Wrap securely to prevent cuts..."
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Safety Warning (Optional)</label>
                <input
                  type="text"
                  value={itemForm.safety_warning || ''}
                  onChange={(e) => setItemForm({ ...itemForm, safety_warning: e.target.value })}
                  placeholder="e.g. Sharp edge cut hazard"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.recyclable}
                    onChange={(e) => setItemForm({ ...itemForm, recyclable: e.target.checked })}
                  />
                  <span>Recyclable</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.compostable}
                    onChange={(e) => setItemForm({ ...itemForm, compostable: e.target.checked })}
                  />
                  <span>Compostable</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg transition"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
