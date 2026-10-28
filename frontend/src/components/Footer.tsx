import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Shield, HelpCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <footer className="bg-forest-900 text-slate-300 pt-16 pb-12 border-t border-forest-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-forest-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">EcoSort</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Sort Smart. Waste Less. Live Greener."
            </p>
            <p className="text-xs text-slate-400">
              A student entrepreneurship prototype solving campus and household waste segregation confusion through smart guidance and coordinated collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/guide" className="hover:text-white transition">Waste Guide Catalog</Link>
              </li>
              <li>
                <Link to="/identify" className="hover:text-white transition">Image & Manual Identifier</Link>
              </li>
              <li>
                <Link to="/recycling" className="hover:text-white transition">Recycling Education</Link>
              </li>
              <li>
                <Link to="/qr-bins" className="hover:text-white transition">Bin QR Code Labels</Link>
              </li>
              <li>
                <Link to="/request" className="hover:text-white transition">Request Recyclable Pickup</Link>
              </li>
            </ul>
          </div>

          {/* Portals & Management */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Portals & Tracking</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/track" className="hover:text-white transition">Track Collection Status</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">User Activity Dashboard</Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-white transition">Collection Partner Workspace</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">Administrator Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Academic Transparency & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Project Integrity</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Demonstration prototype for academic evaluation. Does not operate commercial hauling services. Database-backed metrics reflect genuine application activity.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPrivacyOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Privacy Notice
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setAboutOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                About Project
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EcoSort Project. Designed for Vercel Serverless Architecture.</p>
          <p className="mt-4 sm:mt-0 flex items-center space-x-1">
            <span>Built with React, Vite, FastAPI & PostgreSQL</span>
          </p>
        </div>
      </div>

      {/* Privacy Notice Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-forest-800">
                <Shield className="w-5 h-5 text-forest-600" />
                <span>EcoSort Privacy Notice</span>
              </h3>
              <button
                onClick={() => setPrivacyOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-sm space-y-3 text-slate-600 max-h-96 overflow-y-auto pr-2">
              <p>
                <strong>Academic Prototype Scope:</strong> EcoSort collects only the minimum personal information required to coordinate pickup demonstrations: your requester name, contact phone or email, and general pickup area.
              </p>
              <p>
                <strong>Data Protection:</strong> Phone numbers and email addresses are strictly restricted to authorized administrative and partner views. Public tracking endpoints exclusively display non-identifying request parameters (tracking code, waste category, quantity, and status).
              </p>
              <p>
                <strong>No Image Storage:</strong> Uploaded images during waste identification are processed in-memory for the duration of the request and are never stored on local disks or unverified servers.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="px-4 py-2 bg-forest-700 text-white rounded-lg text-sm font-semibold hover:bg-forest-800"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Project Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-forest-800">
                <HelpCircle className="w-5 h-5 text-forest-600" />
                <span>About EcoSort</span>
              </h3>
              <button
                onClick={() => setAboutOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-sm space-y-3 text-slate-600 max-h-96 overflow-y-auto pr-2">
              <p>
                <strong>EcoSort</strong> is a full-stack student entrepreneurship platform addressing improper waste segregation, public recycling confusion, and uncoordinated campus recyclable waste collection.
              </p>
              <p>
                <strong>Architecture:</strong> Engineered with independently deployable React/Vite frontend and FastAPI Python backend on Vercel, backed by PostgreSQL.
              </p>
              <p>
                <strong>Integrity:</strong> All statistics, collection metrics, and catalog queries reflect real PostgreSQL records. No fabricated environmental impact numbers or fake partnerships are presented.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAboutOpen(false)}
                className="px-4 py-2 bg-forest-700 text-white rounded-lg text-sm font-semibold hover:bg-forest-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
