import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
  XCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { CollectionRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RequestTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(urlCode);
  const [request, setRequest] = useState<CollectionRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (urlCode) {
      lookupRequest(urlCode);
    }
  }, [urlCode]);

  const lookupRequest = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setCancelSuccess(null);
    try {
      const data = await api.getCollectionRequest(codeToSearch.trim());
      setRequest(data);
    } catch (err: any) {
      setError(err.message || `No collection request found with tracking code '${codeToSearch}'`);
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    searchParams.set('code', inputCode.trim());
    setSearchParams(searchParams);
    lookupRequest(inputCode.trim());
  };

  const handleCancelRequest = async () => {
    if (!request) return;
    setCancelling(true);
    try {
      const updated = await api.cancelCollectionRequest(request.request_code, cancelReason);
      setRequest(updated);
      setCancelSuccess('Collection request has been successfully cancelled.');
      setCancelModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel request');
    } finally {
      setCancelling(false);
    }
  };

  const steps = ['Pending', 'Accepted', 'Scheduled', 'Collected'];

  const getStepIndex = (status: string) => {
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Heading */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200">
          <Search className="w-3.5 h-3.5 text-forest-600" />
          <span>Status Verification Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Collection Request</h1>
        <p className="text-slate-600 text-sm">
          Enter your unique non-guessable tracking code (e.g., ECO-2026-XXXXXX) to monitor pickup progress.
        </p>
      </div>

      {/* Code Search Input Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter Request Code: ECO-2026-XXXXXX"
              className="w-full pl-11 pr-4 py-3 text-sm font-mono tracking-wider uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Loading & Errors */}
      {loading && <LoadingSpinner message="Looking up collection status in database..." />}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cancelSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{cancelSuccess}</span>
        </div>
      )}

      {/* Tracking Details View */}
      {request && !loading && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tracking Code</span>
              <div className="text-2xl font-mono font-extrabold text-forest-900 tracking-wider">
                {request.request_code}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={request.status} size="md" />
              {request.status === 'Pending' && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar (for standard flow) */}
          {request.status !== 'Cancelled' ? (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progression Status</span>
              <div className="grid grid-cols-4 gap-2">
                {steps.map((st, idx) => {
                  const currentIdx = getStepIndex(request.status);
                  const isCompleted = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={st} className="space-y-2 text-center">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          isCompleted ? 'bg-forest-600' : 'bg-slate-200'
                        }`}
                      ></div>
                      <span
                        className={`text-[11px] font-semibold block ${
                          isCurrent ? 'text-forest-800 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-900 text-xs">
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <strong>Request Cancelled:</strong> This collection request was cancelled and will not be processed by collection partners.
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Waste Category</span>
              <CategoryBadge category={request.waste_category} />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Estimated Quantity</span>
              <p className="text-sm font-bold text-slate-900">
                {request.quantity} {request.quantity_unit}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Pickup Location</span>
              <p className="text-xs font-medium text-slate-900 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{request.pickup_area}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Preferred Pickup Date</span>
              <p className="text-xs font-medium text-slate-900 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{request.preferred_pickup_date}</span>
              </p>
            </div>
          </div>

          {/* Description & Partner Notes */}
          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Material Description</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {request.description}
              </p>
            </div>

            {request.partner_note && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-1">
                  Collection Partner Note
                </h4>
                <p className="text-xs text-forest-900 bg-forest-50 p-3 rounded-xl border border-forest-200 leading-relaxed">
                  {request.partner_note}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Guarantee Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Privacy Protected: Requester email and phone numbers are omitted from this public tracking response.
            </span>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cancel Collection Request</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel request <strong>{request?.request_code}</strong>? Only pending requests can be cancelled.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Reason for cancellation (optional):</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Handed over to local scrap dealer, no longer needed..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
