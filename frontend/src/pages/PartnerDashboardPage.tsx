import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { CollectionRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const PartnerDashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [partnerKey, setPartnerKey] = useState<string>('partner-demo-key');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Note dialog
  const [activeRequest, setActiveRequest] = useState<CollectionRequest | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'schedule' | 'complete' | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPartnerRequests(partnerKey);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load partner requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!activeRequest || !actionType) return;
    setProcessing(true);
    setError(null);
    setActionSuccess(null);

    try {
      if (actionType === 'accept') {
        await api.acceptPartnerRequest(activeRequest.id!, noteInput, partnerKey);
        setActionSuccess(`Request ${activeRequest.request_code} accepted.`);
      } else if (actionType === 'schedule') {
        await api.schedulePartnerRequest(activeRequest.id!, noteInput, partnerKey);
        setActionSuccess(`Request ${activeRequest.request_code} scheduled.`);
      } else if (actionType === 'complete') {
        await api.completePartnerRequest(activeRequest.id!, noteInput, partnerKey);
        setActionSuccess(`Request ${activeRequest.request_code} marked as collected!`);
      }
      setActiveRequest(null);
      setActionType(null);
      setNoteInput('');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200 mb-2">
            <Truck className="w-3.5 h-3.5 text-forest-600" />
            <span>Recycling Aggregator & Partner Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Collection Partner Portal</h1>
          <p className="text-slate-600 text-sm">
            Review incoming recyclable pickup requests, schedule transport logistics, and confirm completed collections.
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          Refresh Queue
        </button>
      </div>

      {/* Academic Prototype Banner */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-950 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold">Academic Demonstration Mode</p>
          <p className="text-sky-800 leading-relaxed mt-0.5">
            This workspace simulates partner workflows for student evaluation. Requests are fetched from the live database and state transitions (Pending → Accepted → Scheduled → Collected) are enforced server-side.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Requests Queue */}
      {loading ? (
        <LoadingSpinner message="Loading partner collection queue..." />
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Actionable Requests in Queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All submitted collection requests have been collected or cancelled. When users submit new requests, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.request_code}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-forest-800">{req.request_code}</span>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{req.waste_category}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{req.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Quantity:</span>
                    <strong className="text-slate-900">
                      {req.quantity} {req.quantity_unit}
                    </strong>
                  </div>
                  <div className="flex items-center space-x-1.5 pt-1 border-t border-slate-200 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{req.pickup_area}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Preferred: {req.preferred_pickup_date}</span>
                  </div>
                  {req.requester_name && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{req.requester_name}</span>
                    </div>
                  )}
                  {req.contact_phone && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{req.contact_phone}</span>
                    </div>
                  )}
                </div>

                {req.partner_note && (
                  <div className="p-2.5 bg-forest-50 border border-forest-200 rounded-lg text-[11px] text-forest-900">
                    <strong>Note:</strong> {req.partner_note}
                  </div>
                )}
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                {req.status === 'Pending' && (
                  <button
                    onClick={() => {
                      setActiveRequest(req);
                      setActionType('accept');
                      setNoteInput('Accepted for collection by verified partner.');
                    }}
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Accept Request
                  </button>
                )}

                {req.status === 'Accepted' && (
                  <button
                    onClick={() => {
                      setActiveRequest(req);
                      setActionType('schedule');
                      setNoteInput(`Vehicle scheduled for pickup on ${req.preferred_pickup_date}.`);
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Schedule Pickup
                  </button>
                )}

                {req.status === 'Scheduled' && (
                  <button
                    onClick={() => {
                      setActiveRequest(req);
                      setActionType('complete');
                      setNoteInput('Collection completed and transferred to recovery facility.');
                    }}
                    className="flex-1 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Dialog */}
      {activeRequest && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              {actionType} Request: {activeRequest.request_code}
            </h3>
            <p className="text-xs text-slate-500">
              Provide status notes that will be visible to the requester on their tracking page:
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Partner Note / Instructions:</label>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActiveRequest(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className="px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg transition"
              >
                {processing ? 'Updating...' : 'Save & Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
