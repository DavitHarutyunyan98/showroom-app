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
  Eye,
  EyeOff,
  Check
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
    contract: "",
    phone: "",
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
    contract: "055 46 49 41",
    phone: "lizalat@hotmail.com",
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
    contract: "Հայտ 51 2026",
    phone: "044 93 93 93",
    specs: { power: "610 hp", fuel: "Electric" }
  }
];

const COLUMN_DEFINITIONS = [
  { id: 'orderNo', label: 'Order #', visible: true },
  { id: 'year', label: 'Year', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'model', label: 'Model', visible: true },
  { id: 'optionType', label: 'Option', visible: true },
  { id: 'color', label: 'Color', visible: true },
  { id: 'info', label: 'Production Info', visible: true },
  { id: 'price', label: 'Price (AMD)', visible: true },
  { id: 'buyer', label: 'Buyer', visible: true },
  { id: 'manager', label: 'Manager', visible: false },
  { id: 'bank', label: 'Bank', visible: false },
  { id: 'contract', label: 'Contract', visible: false },
  { id: 'phone', label: 'Phone', visible: false },
  { id: 'vin', label: 'VIN', visible: true },
];

// --- Components ---

const ColumnConfigModal = ({ isOpen, onClose, columns, toggleColumn }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Configure Columns</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2">
          {columns.map(col => (
            <button 
              key={col.id}
              onClick={() => toggleColumn(col.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${col.visible ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 opacity-60'}`}
            >
              <span className="font-bold text-sm">{col.label}</span>
              {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const CarForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    orderNo: '', year: 2025, status: 'Showroom', make: 'BMW', model: '',
    optionType: '', color: '', info: '', price: '', vin: '',
    buyer: '', manager: '', bank: '', contract: '', phone: '',
    specs: { power: '', fuel: 'Gasoline' }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-[32px] p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Record' : 'Add New Entry'}</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider border-b border-blue-100 pb-2">Vehicle Identity</h3>
            <InputField label="Order No" value={formData.orderNo} onChange={v => setFormData({...formData, orderNo: v})} />
            <InputField label="Year" type="number" value={formData.year} onChange={v => setFormData({...formData, year: v})} />
            <InputField label="Model" value={formData.model} onChange={v => setFormData({...formData, model: v})} />
            <InputField label="VIN" value={formData.vin} onChange={v => setFormData({...formData, vin: v})} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider border-b border-blue-100 pb-2">Configuration</h3>
            <InputField label="Option Type" value={formData.optionType} onChange={v => setFormData({...formData, optionType: v})} />
            <InputField label="Color" value={formData.color} onChange={v => setFormData({...formData, color: v})} />
            <InputField label="Production Info" value={formData.info} onChange={v => setFormData({...formData, info: v})} />
            <InputField label="Last Price" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-sm uppercase tracking-wider border-b border-blue-100 pb-2">Customer & Sales</h3>
            <InputField label="Buyer Name" value={formData.buyer} onChange={v => setFormData({...formData, buyer: v})} />
            <InputField label="Manager / Date" value={formData.manager} onChange={v => setFormData({...formData, manager: v})} />
            <InputField label="Bank / ID" value={formData.bank} onChange={v => setFormData({...formData, bank: v})} />
            <InputField label="Contract" value={formData.contract} onChange={v => setFormData({...formData, contract: v})} />
            <InputField label="Phone / Email" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
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
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
  const [columns, setColumns] = useState(COLUMN_DEFINITIONS);

  // --- Logic ---
  const toggleColumn = (id) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    ));
  };

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
            Inventory Hub
          </h1>
          <p className="text-slate-500 mt-1">Real-time showroom data & operations</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter anything..." 
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
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.filter(c => c.visible).map(col => (
                  <SortableHeader 
                    key={col.id}
                    label={col.label} 
                    id={col.id} 
                    config={sortConfig} 
                    onSort={handleSort} 
                  />
                ))}
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase text-center sticky right-0 bg-slate-50/90 backdrop-blur-sm z-10 border-l border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedAndFilteredData.map((car, idx) => (
                <tr key={car.id} className={`hover:bg-blue-50/30 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/20' : ''}`}>
                  {columns.filter(c => c.visible).map(col => (
                    <td key={col.id} className="p-4 text-sm">
                      {col.id === 'orderNo' && <span className="font-mono font-bold text-blue-600">{car[col.id]}</span>}
                      {col.id === 'price' && <span className="font-black text-slate-700">{Number(car[col.id]).toLocaleString()}</span>}
                      {col.id === 'status' && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${car.status === 'Showroom' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {car[col.id]}
                        </span>
                      )}
                      {col.id === 'model' && <span className="font-bold">{car[col.id]}</span>}
                      {col.id === 'vin' && <span className="font-mono text-[10px] text-slate-400">{car[col.id]}</span>}
                      {!['orderNo', 'price', 'status', 'model', 'vin'].includes(col.id) && (
                        <span className="text-slate-600">{car[col.id]}</span>
                      )}
                    </td>
                  ))}
                  <td className="p-4 sticky right-0 bg-white/90 backdrop-blur-sm z-10 border-l border-slate-100 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
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
            <button 
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Settings size={14}/> COLUMNS
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CarForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        initialData={editingCar} 
      />

      <ColumnConfigModal 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        columns={columns}
        toggleColumn={toggleColumn}
      />
    </div>
  );
};

const SortableHeader = ({ label, id, config, onSort }) => {
  const isActive = config.key === id;
  return (
    <th 
      className={`p-4 text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors select-none whitespace-nowrap ${isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:bg-slate-100'}`}
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