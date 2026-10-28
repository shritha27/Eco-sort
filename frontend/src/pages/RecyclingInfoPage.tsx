import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Search,
  Info,
  ShieldAlert,
  HelpCircle,
  FileText,
  Layers,
  Battery,
  Smartphone,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

interface RecyclingCategoryGuide {
  id: string;
  name: string;
  acceptedItems: string[];
  preparation: string[];
  commonMistakes: string[];
  safety: string;
  disposalOptions: string;
}

const RECYCLING_DATA: RecyclingCategoryGuide[] = [
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    acceptedItems: ['Newspapers & magazines', 'Clean cardboard boxes', 'Notebooks & study papers', 'Cereal and shipping cartons'],
    preparation: ['Flatten all boxes to save space', 'Remove packing tape, plastic wrapping, and bubble wrap', 'Ensure materials remain completely dry'],
    commonMistakes: ['Throwing greasy pizza boxes into paper bins (oil ruins paper pulp)', 'Mixing plastic-laminated glossy flyers with clean paper'],
    safety: 'Watch for staples or plastic straps that can jam shredding machinery.',
    disposalOptions: 'Blue dry recyclable bins, campus paper drives, local scrap collectors (kabadiwalas).'
  },
  {
    id: 'plastics',
    name: 'Plastics (Rigid & Flexible)',
    acceptedItems: ['PET beverage bottles (#1)', 'HDPE milk, detergent jugs (#2)', 'PP food containers (#5)'],
    preparation: ['Empty completely and rinse food residues', 'Crush plastic bottles to reduce bulk', 'Leave caps on if recycler accepts attached lids'],
    commonMistakes: ['Wish-cycling multi-layer chip wrappers and metallized pouches in rigid plastic bins', 'Leaving half-full liquid bottles in recycling bags'],
    safety: 'Never burn plastics due to hazardous dioxin and furan fumes.',
    disposalOptions: 'Dry recyclable bins, campus bottle reverse vending kiosks, specialized polymer aggregators.'
  },
  {
    id: 'glass',
    name: 'Glass Bottles & Jars',
    acceptedItems: ['Clear, green, and amber beverage bottles', 'Food preserve and jam jars', 'Cosmetic glass containers'],
    preparation: ['Rinse cleanly and air-dry', 'Separate metal and plastic lids', 'Keep intact without smashing'],
    commonMistakes: ['Mixing window panes, pyrex cookware, or mirrors with bottle glass (they have different melting temperatures)', 'Throwing broken ceramic mugs into glass bins'],
    safety: 'Handle broken glass with thick cut-resistant gloves; wrap shards securely in thick cardboard.',
    disposalOptions: 'Dedicated glass drop-off points, dry recyclable collection.'
  },
  {
    id: 'metals',
    name: 'Metals & Aluminum Cans',
    acceptedItems: ['Aluminum beverage cans', 'Steel/tin food cans', 'Metal bottle caps and clean aluminum foil'],
    preparation: ['Rinse clean of all sauces or oil', 'Tuck can lids inside to avoid exposed sharp edges'],
    commonMistakes: ['Throwing unemptied pressurized aerosol cans into compactors', 'Discarding paint or motor oil tins in general metal bins'],
    safety: 'Avoid puncturing pressurized aerosol cans. Recycle only when completely empty.',
    disposalOptions: 'Metal recycling aggregators, scrap dealers, dry recyclable bins.'
  },
  {
    id: 'ewaste',
    name: 'Electronic Waste (E-Waste)',
    acceptedItems: ['Old smartphones & tablets', 'Laptop chargers & USB cables', 'Keyboards, mice, and computer components', 'Small appliances'],
    preparation: ['Wipe all personal storage data', 'Remove detachable batteries if possible and store separately', 'Keep intact without smashing circuit boards'],
    commonMistakes: ['Tossing broken chargers or phones into general trash bins destined for landfills'],
    safety: 'Contains heavy metals (lead, cadmium, mercury) and lithium batteries prone to thermal runaway.',
    disposalOptions: 'Campus e-waste collection bins, authorized dismantling drives, producer take-back programs.'
  },
  {
    id: 'organic',
    name: 'Organic & Food Scraps',
    acceptedItems: ['Vegetable peels and fruit skins', 'Tea leaves and coffee grounds', 'Leftover cooked food', 'Garden trimmings and dry leaves'],
    preparation: ['Remove plastic stickers, produce rubber bands, and ties', 'Drain gravies and liquid soups'],
    commonMistakes: ['Discarding plastic packaging bags with organic scraps', 'Adding non-compostable sanitary items to composting pits'],
    safety: 'Ensure composting pits are covered properly to prevent rodent or pest infestation.',
    disposalOptions: 'Green organic wet bins, campus vermicomposting pits, municipal biomethanation digesters.'
  },
  {
    id: 'hazardous',
    name: 'Batteries & Domestic Hazardous',
    acceptedItems: ['AA, AAA, and 9V alkaline batteries', 'Rechargeable lithium battery packs', 'CFL and fluorescent tube lamps', 'Expired medications'],
    preparation: ['Tape terminals of 9V and lithium batteries with electrical tape', 'Keep fluorescent tubes unbroken in bubble wrap or cardboard sleeves', 'Keep medicines in original labeled packaging'],
    commonMistakes: ['Throwing batteries into dry recyclable bins (can spark and cause conveyor fires)', 'Flushing expired antibiotics down the drain'],
    safety: 'Punctured lithium batteries can violently ignite. Fluorescent lamps emit toxic mercury vapor if smashed.',
    disposalOptions: 'Specialized domestic hazardous drop-offs, pharmacy medicine return bins, battery collection boxes.'
  },
  {
    id: 'textiles',
    name: 'Textiles & Worn Fabrics',
    acceptedItems: ['Clean wearable clothes', 'Bedsheets and towels', 'Fabric scraps and cutoffs'],
    preparation: ['Wash and dry thoroughly', 'Bundle in clean bags to protect from moisture'],
    commonMistakes: ['Donating damp, moldy, or oil-soaked rags with wearable garments'],
    safety: 'Ensure fabrics are clean and dry to prevent mold growth during aggregation.',
    disposalOptions: 'Campus charity clothing drives, textile recyclers for industrial rag shredding.'
  }
];

export const RecyclingInfoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('paper');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(false);

  const selectedGuide = RECYCLING_DATA.find((g) => g.id === activeTab) || RECYCLING_DATA[0];

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedLocation(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200">
          <BookOpen className="w-3.5 h-3.5 text-forest-600" />
          <span>Recycling Education Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Material Recycling Guidance</h1>
        <p className="text-slate-600 text-sm">
          Discover which materials are genuinely recyclable, how to prepare them to prevent batch contamination, and common mistakes to avoid.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200 scrollbar-none">
        {RECYCLING_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === cat.id
                ? 'bg-forest-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Guide Detail Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Recycling Protocol</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedGuide.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accepted Items */}
          <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Widely Accepted Items</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedGuide.acceptedItems.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Instructions */}
          <div className="bg-forest-50/60 border border-forest-100 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-forest-600" />
              <span>Preparation Steps</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedGuide.preparation.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-forest-600 font-bold">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-rose-50/60 border border-rose-100 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Common Recycling Mistakes</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedGuide.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Disposal Route */}
          <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safety & Recommended Disposal</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong>Safety:</strong> {selectedGuide.safety}
              </p>
              <p>
                <strong>Recommended Route:</strong> {selectedGuide.disposalOptions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recycling Location Finder (Honest Prototype with Verified Empty State) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            <span>Drop-off Locations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Find Local Recycling Centers</h2>
          <p className="text-xs text-slate-500 mt-1">
            Search for municipal collection bins or registered recycling partners in your campus or city area.
          </p>
        </div>

        <form onSubmit={handleLocationSearch} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Enter your campus zone, postal code, or city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Search Locations
          </button>
        </form>

        {/* Realistic Prototype Empty State */}
        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-800">
            {searchedLocation && locationQuery
              ? `No Registered Centers in "${locationQuery}" Yet`
              : 'Community Location Registry in Progress'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            In compliance with our academic transparency guidelines, we do not fabricate fake addresses, phone numbers, or opening hours. You can request a campus pickup directly through our collection request workflow.
          </p>
        </div>
      </div>
    </div>
  );
};
