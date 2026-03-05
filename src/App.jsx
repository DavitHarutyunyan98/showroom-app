import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Users, 
  Settings, 
  Search, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  Info,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  TrendingUp,
  Filter,
  ArrowLeft,
  Camera
} from 'lucide-react';

// --- Initial Mock Data ---
const INITIAL_INVENTORY = [
  {
    id: 1,
    make: "Mercedes-Benz",
    model: "S-Class Sedan",
    year: 2024,
    price: 119500,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    specs: {
      engine: "3.0L Inline-6 Turbo",
      power: "429 hp",
      fuel: "Gasoline / Hybrid"
    },
    options: ["Executive Line", "Night Package"]
  },
  {
    id: 2,
    make: "BMW",
    model: "iX M60",
    year: 2024,
    price: 111500,
    status: "Reserved",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=800",
    specs: {
      engine: "Dual Electric Motors",
      power: "610 hp",
      fuel: "Electric"
    },
    options: ["Sport Package", "Sky Lounge"]
  }
];

// --- Sub-Components ---

const GlassCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

const CarForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    make: '', model: '', year: 2024, price: '', status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    specs: { engine: '', power: '', fuel: 'Gasoline' },
    options: []
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Make</label>
            <input 
              className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              value={formData.make}
              onChange={e => setFormData({...formData, make: e.target.value})}
              placeholder="e.g. Porsche"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Model</label>
            <input 
              className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              value={formData.model}
              onChange={e => setFormData({...formData, model: e.target.value})}
              placeholder="e.g. 911 GT3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price ($)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status</label>
              <select 
                className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option>In Stock</option>
                <option>Reserved</option>
                <option>Sold</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
             <button 
              onClick={() => onSave(formData)}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
             >
              <Save size={20} /> Save Vehicle
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredInventory = useMemo(() => {
    return inventory.filter(car => 
      car.make.toLowerCase().includes(search.toLowerCase()) || 
      car.model.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, inventory]);

  const handleSaveCar = (carData) => {
    if (editingCar) {
      setInventory(inventory.map(c => c.id === editingCar.id ? { ...carData, id: c.id } : c));
    } else {
      setInventory([...inventory, { ...carData, id: Date.now() }]);
    }
    setIsFormOpen(false);
    setEditingCar(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this vehicle?")) {
      setInventory(inventory.filter(c => c.id !== id));
    }
  };

  const handleEdit = (car, e) => {
    e.stopPropagation();
    setEditingCar(car);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Header */}
      <header className="px-6 pt-14 pb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Showroom Elite</h1>
            <p className="text-gray-500 text-sm">Inventory Manager</p>
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${isEditMode ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-600'}`}
          >
            {isEditMode ? 'EXIT EDIT' : 'MANAGE'}
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full bg-white rounded-2xl py-3 pl-11 pr-4 shadow-sm focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isEditMode && (
              <button 
                onClick={() => { setEditingCar(null); setIsFormOpen(true); }}
                className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200"
              >
                <Plus size={24} />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-6 pb-32">
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {filteredInventory.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Car size={48} className="mx-auto mb-4 opacity-20" />
                <p>No vehicles found.</p>
              </div>
            )}
            {filteredInventory.map(car => (
              <GlassCard 
                key={car.id} 
                className="overflow-hidden relative group cursor-pointer"
                onClick={() => !isEditMode && setSelectedCar(car)}
              >
                <div className="h-40 relative">
                  <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-md ${car.status === 'Sold' ? 'bg-red-500/80' : 'bg-black/60'}`}>
                    {car.status.toUpperCase()}
                  </div>
                  
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleEdit(car, e)}
                        className="bg-white p-3 rounded-full text-blue-600 shadow-xl"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(car.id, e)}
                        className="bg-white p-3 rounded-full text-red-600 shadow-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-gray-900">{car.make}</h3>
                    <p className="text-sm text-gray-500">{car.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-black text-lg">${car.price.toLocaleString()}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === 'leads' && <div className="text-center py-20 text-gray-400 italic">Leads module live in v2.0</div>}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 flex justify-around items-center bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-8 z-40">
        {[
          { id: 'inventory', icon: Car, label: 'STOCK' },
          { id: 'leads', icon: Users, label: 'LEADS' },
          { id: 'settings', icon: Settings, label: 'SETUP' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[9px] font-black tracking-tighter uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Detail Overlay */}
      {selectedCar && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="relative h-72">
            <img src={selectedCar.image} className="w-full h-full object-cover" />
            <button onClick={() => setSelectedCar(null)} className="absolute top-12 left-6 bg-white p-3 rounded-2xl shadow-xl"><ArrowLeft size={20}/></button>
          </div>
          <div className="p-8 -mt-8 bg-white rounded-t-[40px] relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black">{selectedCar.make}</h1>
                <p className="text-xl text-gray-500">{selectedCar.model}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-600">${selectedCar.price.toLocaleString()}</p>
                <span className="text-xs font-bold text-gray-400">{selectedCar.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-slate-50 p-4 rounded-3xl">
                  <Zap className="text-blue-500 mb-2" size={20} />
                  <p className="text-xs text-gray-400">Power</p>
                  <p className="font-bold">{selectedCar.specs.power}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-3xl">
                  <Droplets className="text-blue-500 mb-2" size={20} />
                  <p className="text-xs text-gray-400">Fuel</p>
                  <p className="font-bold">{selectedCar.specs.fuel}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Overlay */}
      <CarForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingCar(null); }} 
        onSave={handleSaveCar}
        initialData={editingCar}
      />

    </div>
  );
};

export default App;