import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Search,
  BookOpen,
  Truck,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { CollectionRequest, DashboardStats, DailyTip } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<CollectionRequest[]>([]);
  const [tips, setTips] = useState<DailyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, requestsData, tipsData] = await Promise.all([
        api.getDashboardStats().catch(() => ({
          total_requests: 0,
          completed_requests: 0,
          pending_requests: 0,
          scheduled_requests: 0,
          accepted_requests: 0,
          completion_rate_percent: 0,
        })),
        api.listCollectionRequests().catch(() => []),
        api.getDailyTips().catch(() => []),
      ]);

      setStats(statsData);
      setRecentRequests(requestsData.slice(0, 5));
      setTips(tipsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard and live metrics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">EcoSort Activity Hub</h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time status of your recyclable collection requests, segregation guidance, and daily tips.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/request"
            className="inline-flex items-center px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>New Pickup Request</span>
          </Link>
          <Link
            to="/track"
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Search className="w-4 h-4 mr-1.5" />
            <span>Track by Code</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <span>Notice: {error}</span>
        </div>
      )}

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/identify"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-forest-300 hover:shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-forest-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Identify Item</h3>
          <p className="text-xs text-slate-500 mt-1">Upload image or select item</p>
        </Link>

        <Link
          to="/guide"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-forest-300 hover:shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Waste Guide</h3>
          <p className="text-xs text-slate-500 mt-1">Search categories & bin rules</p>
        </Link>

        <Link
          to="/recycling"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-forest-300 hover:shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Recycling Rules</h3>
          <p className="text-xs text-slate-500 mt-1">Material preparation guide</p>
        </Link>

        <Link
          to="/request"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-forest-300 hover:shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Schedule Pickup</h3>
          <p className="text-xs text-slate-500 mt-1">Recyclable waste collection</p>
        </Link>
      </div>

      {/* Summary Cards (Real Database Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Total Requests</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{stats?.total_requests ?? 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Saved in database</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-amber-700 block uppercase tracking-wider">Pending Review</span>
          <span className="text-3xl font-extrabold text-amber-700 mt-2 block">{stats?.pending_requests ?? 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting partner assignment</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-indigo-700 block uppercase tracking-wider">Scheduled</span>
          <span className="text-3xl font-extrabold text-indigo-700 mt-2 block">{stats?.scheduled_requests ?? 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Confirmed for collection</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-forest-700 block uppercase tracking-wider">Completed</span>
          <span className="text-3xl font-extrabold text-forest-700 mt-2 block">{stats?.completed_requests ?? 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats && stats.total_requests > 0
              ? `${stats.completion_rate_percent}% completion rate`
              : 'No collections yet'}
          </span>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Collection Requests</h2>
          <Link to="/request" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center">
            <span>Submit new request</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-6">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No Collection Requests Logged Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              When you schedule a recyclable waste pickup, your request code and real-time status will appear here.
            </p>
            <Link
              to="/request"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg transition"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              <span>Create Your First Request</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Tracking Code</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Pickup Area</th>
                  <th className="px-4 py-3">Preferred Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <tr key={req.request_code} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-forest-800">{req.request_code}</td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={req.waste_category} />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {req.quantity} {req.quantity_unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{req.pickup_area}</td>
                    <td className="px-4 py-3 text-slate-600">{req.preferred_pickup_date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/track?code=${req.request_code}`}
                        className="text-xs font-semibold text-forest-700 hover:text-forest-900 underline"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Waste-Segregation Tips */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Waste Segregation & Recycling Guidance</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold text-forest-700 tracking-wider bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                {tip.category}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{tip.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
