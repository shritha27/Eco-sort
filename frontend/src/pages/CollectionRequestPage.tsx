import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  Info,
  Calendar,
  MapPin,
  Scale,
  FileText,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { api } from '../services/api';
import { CollectionRequestCreate, CollectionRequest } from '../types';

const CATEGORIES = [
  'Dry Recyclable',
  'Electronic Waste',
  'Special Handling',
  'Wet / Biodegradable',
  'Domestic Hazardous',
  'Residual / Non-Recyclable',
];

export const CollectionRequestPage: React.FC = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState<CollectionRequestCreate>({
    requester_name: '',
    contact_email: '',
    contact_phone: '',
    waste_category: 'Dry Recyclable',
    description: '',
    quantity: 5,
    quantity_unit: 'kg',
    pickup_area: '',
    preferred_pickup_date: minDate,
    additional_notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<CollectionRequest | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!formData.requester_name.trim()) {
      setError('Requester name is required.');
      return;
    }
    if (!formData.pickup_area.trim()) {
      setError('Pickup area or building name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a brief description of the waste items.');
      return;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    if (new Date(formData.preferred_pickup_date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      setError('Preferred pickup date cannot be in the past.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createCollectionRequest(formData);
      setSubmittedRequest(response);
    } catch (err: any) {
      setError(err.message || 'Failed to submit collection request');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingCode = () => {
    if (submittedRequest?.request_code) {
      navigator.clipboard.writeText(submittedRequest.request_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Heading */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200">
          <Truck className="w-3.5 h-3.5 text-forest-600" />
          <span>Campus & Community Collection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Request Recyclable Pickup</h1>
        <p className="text-slate-600 text-sm">
          Schedule a coordinated collection for accumulated recyclable waste, cardboard bundles, or e-waste items.
        </p>
      </div>

      {/* Prototype Disclaimer */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Academic Demonstration Notice</p>
          <p className="leading-relaxed">
            Submitting a pickup request records your request into our live PostgreSQL database for tracking and partner assignment demonstration. It does not promise guaranteed commercial hauling unless verified campus partners are active in your specific zone.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Modal / Card */}
      {submittedRequest ? (
        <div className="bg-white border-2 border-forest-500 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Collection Request Submitted!</h2>
            <p className="text-xs text-slate-500">
              Your pickup request has been stored in PostgreSQL with status: <strong>Pending Review</strong>.
            </p>
          </div>

          {/* Tracking Code Box */}
          <div className="bg-forest-50/80 border border-forest-200 rounded-2xl p-5 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 block">
              Your Unique Non-Guessable Tracking Code
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-forest-900 tracking-wider">
              {submittedRequest.request_code}
            </div>
            <p className="text-[11px] text-slate-500">
              Save this code. You will need it to view status updates and schedule changes.
            </p>
            <div className="pt-2">
              <button
                onClick={copyTrackingCode}
                className="inline-flex items-center px-4 py-2 bg-white hover:bg-forest-100 border border-forest-300 text-forest-800 rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Tracking Code'}</span>
              </button>
            </div>
          </div>

          {/* Request Summary */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-2 bg-slate-50">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Waste Category:</span>
              <span className="font-semibold text-slate-900">{submittedRequest.waste_category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Quantity:</span>
              <span className="font-semibold text-slate-900">
                {submittedRequest.quantity} {submittedRequest.quantity_unit}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Pickup Area:</span>
              <span className="font-semibold text-slate-900">{submittedRequest.pickup_area}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Preferred Date:</span>
              <span className="font-semibold text-slate-900">{submittedRequest.preferred_pickup_date}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/track?code=${submittedRequest.request_code}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>Track Request Now</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <button
              onClick={() => {
                setSubmittedRequest(null);
                setFormData({
                  requester_name: '',
                  contact_email: '',
                  contact_phone: '',
                  waste_category: 'Dry Recyclable',
                  description: '',
                  quantity: 5,
                  quantity_unit: 'kg',
                  pickup_area: '',
                  preferred_pickup_date: minDate,
                  additional_notes: '',
                });
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* The Collection Form */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Section 1: Requester Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-forest-700" />
              <span>1. Requester Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.requester_name}
                  onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Campus Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="alex@campus.edu"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+1-555-0192"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * Note: Contact details remain private and are never exposed in public tracking URLs.
            </p>
          </div>

          {/* Section 2: Waste Material Specifications */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Scale className="w-4 h-4 text-forest-700" />
              <span>2. Waste Details & Estimated Quantity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Waste Category *</label>
                <select
                  value={formData.waste_category}
                  onChange={(e) => setFormData({ ...formData, waste_category: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Approx Quantity *</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    max="1000"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Unit</label>
                  <select
                    value={formData.quantity_unit}
                    onChange={(e) => setFormData({ ...formData, quantity_unit: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="bags">Standard Bags</option>
                    <option value="items">Discrete Items</option>
                    <option value="cartons">Carton Boxes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Description of Materials *</label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 4 boxes of flattened shipping cardboard, 20 clean plastic bottles, and old lecture notes..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Section 3: Location and Schedule */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-forest-700" />
              <span>3. Location & Preferred Date</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Pickup Area / Building *</label>
                <input
                  type="text"
                  required
                  value={formData.pickup_area}
                  onChange={(e) => setFormData({ ...formData, pickup_area: e.target.value })}
                  placeholder="e.g. Dormitory B, 3rd Floor Common Area"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Preferred Pickup Date *</label>
                <input
                  type="date"
                  min={minDate}
                  required
                  value={formData.preferred_pickup_date}
                  onChange={(e) => setFormData({ ...formData, preferred_pickup_date: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Special Handling Instructions (Optional)</label>
              <input
                type="text"
                value={formData.additional_notes}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                placeholder="e.g. Buzz room 302 or leave by the recycling station..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">All requests are tracked transparently</span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2"
            >
              {loading ? (
                <span>Registering Request...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Submit Pickup Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
