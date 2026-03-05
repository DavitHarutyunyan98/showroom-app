import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Users, 
  Settings, 
  Search, 
  ChevronRight, 
  Zap, 
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Filter,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  MoreVertical
} from 'lucide-react';

// --- Enhanced Initial Data to match Spreadsheet ---
const INITIAL_INVENTORY = [
  {
    id: 1,
    orderNo: "0983871",
    year: 2025,
    status: "Showroom",
    make: "BMW",
    model: "MINI Countryman S ALL4",
    optionType: "JCW Trim",
    color: "Nanuq White Black",
    info: "5. May production 2025",
    price: 37000000,
    vin: "WMW21GA03S 7738304",
    buyer: "",
    manager: "",
    bank: "",
    specs: { power: "218 hp", fuel: "Gasoline" }
  },
  {
    id: 2,
    orderNo: "0983872",
    year: 2025,
    status: "Showroom",
    make: "BMW",
    model: "MINI Countryman S ALL4",
    optionType: "Favoured Trim",
    color: "Melting Silver Dark Petrol",
    info: "5. May production 2025",
    price: 36000000,
    vin: "WMW21GA04S 7T39848",
    buyer: "Liza",
    manager: "07.01.1961",
    bank: "N 335",
    specs: { power: "218 hp", fuel: "Gasoline" }
  },
  {
    id: 3,
    orderNo: "0983870",
    year: 2025,
    status: "Showroom",
    make: "BMW",
    model: "iX xDrive60",
    optionType: "MSPP Full",
    color: "Dune Grey Amido",
    info: "5. May production 2025",
    price: 61500000,
    vin: "WBY51CF05T CV53952",
    buyer: "Artur",
    manager: "Ameria Bank",
    bank: "N 334",
    specs: { power: "610 hp", fuel: "Electric" }
  }
];

// --- Components ---

const CarForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    orderNo: '', year: 2025, status: 'Showroom', make: 'BMW', model: '',
    optionType: '', color: '', info: '', price: '', vin: '',
    buyer: '', manager: '', bank: '',
    specs: { power: '', fuel: 'Gasoline' }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[32px] p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Record' : 'Add New Entry'}</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider">Basic Info</h3>
            <InputField label="Order No" value={formData.orderNo} onChange={v => setFormData({...formData, orderNo: v})} />
            <InputField label="Year" type="number" value={formData.year} onChange={v => setFormData({...formData, year: v})} />
            <InputField label="Model" value={formData.model} onChange={v => setFormData({...formData, model: v})} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider">Technical</h3>
            <InputField label="Option Type" value={formData.optionType} onChange={v => setFormData({...formData, optionType: v})} />
            <InputField label="Color" value={formData.color} onChange={v => setFormData({...formData, color: v})} />
            <InputField label="VIN" value={formData.vin} onChange={v => setFormData({...formData, vin: v})} />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider">Sales & Logistics</h3>
            <InputField label="Last Price" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
            <InputField label="Status" value={formData.status} onChange={v => setFormData({...formData, status: v})} />
            <InputField label="Production Info" value={formData.info} onChange={v => setFormData({...formData, info: v})} />
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Save size={20} /> Save Changes
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{label}</label>
    <input 
      type={type}
      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const App = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });

  // --- Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = useMemo(() => {
    let data = [...inventory].filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [inventory, search, sortConfig]);

  const handleSave = (data) => {
    if (editingCar) {
      setInventory(inventory.map(c => c.id === editingCar.id ? { ...data, id: c.id } : c));
    } else {
      setInventory([...inventory, { ...data, id: Date.now() }]);
    }
    setIsFormOpen(false);
    setEditingCar(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this record permanently?")) {
      setInventory(inventory.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      
      {/* Top Action Bar */}
      <div className="max-w-[1600px] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-2xl text-white"><Car size={28}/></div>
            Inventory Management
          </h1>
          <p className="text-slate-500 mt-1">Configure, track, and manage showroom units</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search table..." 
              className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 w-64 md:w-80 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingCar(null); setIsFormOpen(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Add Unit
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-[1600px] mx-auto bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <SortableHeader label="Order #" id="orderNo" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Year" id="year" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Status" id="status" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Model" id="model" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Option" id="optionType" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Color" id="color" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Production Info" id="info" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="Price (AMD)" id="price" config={sortConfig} onSort={handleSort} />
                <SortableHeader label="VIN" id="vin" config={sortConfig} onSort={handleSort} />
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedAndFilteredData.map((car, idx) => (
                <tr key={car.id} className={`hover:bg-blue-50/30 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/20' : ''}`}>
                  <td className="p-4 text-sm font-mono font-bold text-blue-600">{car.orderNo}</td>
                  <td className="p-4 text-sm font-medium">{car.year}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                      {car.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold">{car.model}</td>
                  <td className="p-4 text-sm text-slate-500">{car.optionType}</td>
                  <td className="p-4 text-sm text-slate-500">{car.color}</td>
                  <td className="p-4 text-xs italic text-slate-400 max-w-[150px] truncate">{car.info}</td>
                  <td className="p-4 text-sm font-black text-slate-700">
                    {Number(car.price).toLocaleString()}
                  </td>
                  <td className="p-4 text-[10px] font-mono text-slate-400">{car.vin}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditingCar(car); setIsFormOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredData.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium">No records match your filters</p>
          </div>
        )}

        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
          <span>SHOWING {sortedAndFilteredData.length} OF {inventory.length} RECORDS</span>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-slate-600"><Download size={14}/> EXPORT CSV</button>
            <button className="flex items-center gap-1 hover:text-slate-600"><Settings size={14}/> COLUMNS</button>
          </div>
        </div>
      </div>

      <CarForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        initialData={editingCar} 
      />
    </div>
  );
};

const SortableHeader = ({ label, id, config, onSort }) => {
  const isActive = config.key === id;
  return (
    <th 
      className={`p-4 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors select-none ${isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:bg-slate-100'}`}
      onClick={() => onSort(id)}
    >
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col opacity-50">
          <ChevronUp size={10} className={isActive && config.direction === 'asc' ? 'text-blue-600' : ''} />
          <ChevronDown size={10} className={isActive && config.direction === 'desc' ? 'text-blue-600' : ''} />
        </div>
      </div>
    </th>
  );
};

export default App;