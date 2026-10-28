import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Search,
  Camera,
  Truck,
  QrCode,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Leaf,
  BarChart3,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-forest-50/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold tracking-wide border border-forest-200">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>Smart Waste Segregation & Collection Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              Sort Smart. <br className="hidden sm:inline" />
              <span className="text-forest-600">Waste Less.</span> Live Greener.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              EcoSort empowers colleges, hostels, and households with a searchable waste segregation guide, instant item identification, bin QR-code instructions, and coordinated recyclable collection requests.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/identify"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-forest-700 hover:bg-forest-800 shadow-md shadow-forest-900/10 transition group"
              >
                <Camera className="w-5 h-5 mr-2" />
                <span>Identify Waste</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/guide"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-forest-900 bg-white hover:bg-forest-50 border border-slate-200 shadow-sm transition"
              >
                <Search className="w-5 h-5 mr-2 text-forest-600" />
                <span>Explore Waste Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How EcoSort Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How EcoSort Works</h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Four simple steps to end waste confusion and ensure recyclables find their proper destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:border-forest-300 transition">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Search or Scan</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Unsure where an item belongs? Search our database-backed catalog or upload an image to view verified disposal directions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:border-forest-300 transition">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Bin Correctly</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Segregate wet organic, dry recyclables, e-waste, and domestic hazardous materials into designated campus or household bins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:border-forest-300 transition">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Request Pickup</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Schedule a coordinated recyclable waste collection for accumulated paper, cardboard, plastics, or old electronics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:border-forest-300 transition">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Track & Close Loop</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Track collection request progress using non-guessable tracking codes with partner status updates and notes.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Purpose-Built for Practical Impact</h2>
            <p className="mt-2 text-forest-200 text-sm sm:text-base">
              Designed specifically for campus communities, dormitories, and urban households needing realistic, low-friction waste management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <Search className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Database-Backed Guide</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Filter and search 15+ verified waste types across 6 official categories with preparation guidelines and safety cautions.
              </p>
            </div>

            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <Camera className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Waste Identifier</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Upload waste photos with size/type validation. Modular classifier supports manual catalog selection without costly API dependencies.
              </p>
            </div>

            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <QrCode className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Printable QR Bin Labels</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Generate clean, printable QR labels for campus bins. Scanning opens category rules on students' mobile browsers instantly.
              </p>
            </div>

            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <Truck className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Collection Coordination</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Submit collection requests with pickup dates, quantities, and areas. Validated and persisted in PostgreSQL.
              </p>
            </div>

            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Private Request Tracking</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Track status without creating public vulnerabilities. Contact details remain confidential to authorized personnel.
              </p>
            </div>

            <div className="bg-forest-800/60 p-6 rounded-2xl border border-forest-700/60">
              <BarChart3 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentic Analytics</h3>
              <p className="text-sm text-forest-200 leading-relaxed">
                Real-time dashboard metrics computed exclusively from actual database records. No fabricated environmental statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Bin Workflow Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="p-6 bg-forest-50 border-2 border-dashed border-forest-300 rounded-2xl text-center">
              <QrCode className="w-24 h-24 text-forest-700 mx-auto mb-2" />
              <span className="text-xs font-semibold text-forest-800 uppercase tracking-wider block">Scan for Bin Rules</span>
              <span className="text-[10px] text-slate-500">EcoSort Campus QR System</span>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Physical-to-Digital Bridge</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Turn Common Campus Bins into Interactive Smart Sorting Stations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Place printable QR labels on hostel and department waste bins. When students scan the label with their phones, they are taken directly to the specific waste category rules—eliminating mixed contamination at the point of disposal.
            </p>
            <div className="pt-2">
              <Link
                to="/qr-bins"
                className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-800 group"
              >
                <span>Generate printable bin labels</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Segregation Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Source Segregation Matters</h2>
          <p className="mt-2 text-slate-600 text-sm">
            Recycling cannot happen when materials are mixed and contaminated at the source.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Preserves Material Purity</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Cardboard and paper soaked in food oils cannot be repulped. Keeping recyclables clean and dry ensures recyclers actually accept them.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <AlertTriangle className="w-7 h-7 text-amber-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Protects Sanitation Workers</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Segregating broken glass, fluorescent mercury tubes, and medical waste keeps workers safe from cuts, toxic vapors, and infections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Layers className="w-7 h-7 text-forest-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Enables Organic Composting</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Pure organic waste decomposes into nutrient-rich soil conditioner and biogas, preventing anaerobic methane emissions in dumps.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-700 to-forest-800 text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Segregate with Confidence?</h2>
          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Explore our comprehensive waste catalog or schedule a collection request for recyclable materials today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/guide"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-white text-forest-900 hover:bg-forest-50 transition shadow-sm"
            >
              Search Waste Guide
            </Link>
            <Link
              to="/request"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-forest-600 text-white hover:bg-forest-500 border border-forest-500 transition shadow-sm"
            >
              Request Recyclable Pickup
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
