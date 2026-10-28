import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Recycle,
  Search,
  Camera,
  BookOpen,
  Truck,
  QrCode,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check backend health on mount
    api.getHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/guide', label: 'Waste Guide', icon: Search },
    { to: '/identify', label: 'Identify Waste', icon: Camera },
    { to: '/recycling', label: 'Recycling Info', icon: BookOpen },
    { to: '/request', label: 'Request Pickup', icon: Truck },
    { to: '/track', label: 'Track Request', icon: Search },
    { to: '/qr-bins', label: 'Bin QR Codes', icon: QrCode },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const adminLinks = [
    { to: '/partner', label: 'Partner Portal', icon: Truck },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sage-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-sm shadow-forest-800/20">
              <Recycle className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-forest-900 block leading-tight">EcoSort</span>
              <span className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold block leading-none">
                Smart Segregation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    active
                      ? 'bg-forest-50 text-forest-700 font-bold'
                      : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 ${active ? 'text-forest-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Portals */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Backend health indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600" title={backendOnline ? "Backend connected" : backendOnline === false ? "Backend unreachable" : "Checking backend..."}>
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500' : backendOnline === false ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{backendOnline ? 'API Connected' : backendOnline === false ? 'API Offline' : 'API Connecting'}</span>
            </div>

            <div className="h-4 w-px bg-slate-200"></div>

            <Link
              to="/partner"
              className="text-xs font-semibold px-2.5 py-1.5 text-slate-600 hover:text-forest-700 rounded-lg hover:bg-slate-50 transition"
            >
              Partner
            </Link>

            <Link
              to="/admin"
              className="text-xs font-semibold px-3 py-1.5 text-white bg-forest-700 hover:bg-forest-800 rounded-lg shadow-sm transition flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              <span>{backendOnline ? 'API' : 'Offline'}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-forest-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Main Navigation</p>
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-forest-50 text-forest-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <link.icon className={`w-4 h-4 ${active ? 'text-forest-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-100 my-2 pt-2">
            <p className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Dashboards & Portals</p>
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <link.icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
