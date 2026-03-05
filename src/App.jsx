import React, { useState, useMemo, useRef } from 'react';
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
  Check,
  Type,
  PlusCircle,
  FileUp,
  ClipboardList,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

// --- Enhanced Initial Data ---
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
    info: "Import options to see specs here",
    price: 37000000,
    vin: "WMW21GA03S 7738304",
    buyer: "",
    manager: "",
    bank: "",
    contract: "",
    phone: "",
    images: [],
    specs: { power: "218 hp", fuel: "Gasoline" }
  }
];

const COLUMN_DEFINITIONS = [
  { id: 'images', label: 'Photo', visible: true, isFixed: true },
  { id: 'orderNo', label: 'Order #', visible: true, isFixed: true },
  { id: 'year', label: 'Year', visible: true, isFixed: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'model', label: 'Model', visible: true, isFixed: true },
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

const ColumnConfigModal = ({ isOpen, onClose, columns, toggleColumn, renameColumn, addColumn, deleteColumn }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");
  const [newColName, setNewColName] = useState("");

  if (!isOpen) return null;

  const startEditing = (col) => {
    setEditingId(col.id);
    setTempName(col.label);
  };

  const saveName = (id) => {
    renameColumn(id, tempName);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newColName.trim()) {
      addColumn(newColName.trim());
      setNewColName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Configure Columns</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={18} /></button>
        </div>

        <div className="flex gap-2 mb-6 p-2 bg-blue-50 rounded-2xl border border-blue-100">
          <input 
            placeholder="New Column Name..."
            className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm outline-none"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {columns.map(col => (
            <div key={col.id} className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${col.visible ? 'border-blue-100 bg-blue-50/50' : 'border-slate-50 bg-white opacity-60'}`}>
              {editingId === col.id ? (
                <div className="flex-1 flex gap-2">
                  <input autoFocus className="flex-1 bg-white border border-blue-300 rounded-xl px-3 py-1 text-sm outline-none" value={tempName} onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveName(col.id)} />
                  <button onClick={() => saveName(col.id)} className="p-2 bg-blue-600 text-white rounded-xl"><Check size={14} /></button>
                </div>
              ) : (
                <>
                  <button onClick={() => toggleColumn(col.id)} className="flex-1 flex items-center justify-between px-2 py-1">
                    <span className={`font-bold text-sm ${col.visible ? 'text-blue-700' : 'text-slate-400'}`}>{col.label}</span>
                    {col.visible ? <Eye size={16} className="text-blue-600" /> : <EyeOff size={16} className="text-slate-300" />}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(col)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl"><Type size={14} /></button>
                    {!col.isFixed && <button onClick={() => deleteColumn(col.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl"><Trash2 size={14} /></button>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold shrink-0">Done</button>
      </div>
    </div>
  );
};

const CarForm = ({ isOpen, onClose, onSave, columns, initialData = null }) => {
  const fileInputRef = useRef(null);
  const docxInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    orderNo: '', year: 2025, status: 'Showroom', make: 'BMW', model: '',
    optionType: '', color: '', info: '', price: '', vin: '',
    buyer: '', manager: '', bank: '', contract: '', phone: '',
    images: []
  });

  React.useEffect(() => {
    if (isOpen) {
      const base = initialData || {
        orderNo: '', year: 2025, status: 'Showroom', make: 'BMW', model: '',
        optionType: '', color: '', info: '', price: '', vin: '',
        buyer: '', manager: '', bank: '', contract: '', phone: '',
        images: []
      };
      const fullData = { ...base };
      columns.forEach(col => { if (!(col.id in fullData)) fullData[col.id] = ''; });
      setFormData(fullData);
    }
  }, [isOpen, columns, initialData]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const script = document.createElement('script');
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
      document.head.appendChild(script);

      script.onload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          let parsedOptions = [];
          let currentSection = "";
          const skipKeywords = ['options', 'basic equipment', 'optional equipment', 'upholstery', 'external color', 'packages', 'steering', 'seats', 'lights', 'internal options', 'general options', 'finishers', 'extra options', 'm'];

          rows.forEach(cols => {
            if (!cols || cols.length === 0) return;
            const col1 = String(cols[0] || '').trim();
            const col2 = String(cols[1] || '').trim();
            if (!col1) return;

            const isHeader = col1 && (!col2 || col2 === "" || col2 === "˅");
            if (isHeader) {
                const cleanHeader = col1.trim();
                if (cleanHeader && isNaN(cleanHeader)) currentSection = cleanHeader;
            }

            const isSkipWord = skipKeywords.includes(col1.toLowerCase());
            if (!isSkipWord && col2 && col2 !== '˅') {
                const optionString = currentSection ? `[${currentSection}] ${col1}: ${col2}` : `${col1}: ${col2}`;
                parsedOptions.push(optionString);
            }
          });

          if (parsedOptions.length > 0) {
            setFormData(prev => ({ ...prev, info: parsedOptions.join('\n') }));
          }
        };
        reader.readAsArrayBuffer(file);
      };
    } catch (err) {
      console.error("Error loading or processing Excel file:", err);
    }
    event.target.value = ''; 
  };

  const handleDocxUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsProcessing(true);

    try {
      // Load mammoth for DOCX image extraction
      if (!window.mammoth) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        
        // mammoth extracts images as base64 in the HTML conversion
        const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const html = result.value;
        
        // Extract all src from img tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgElements = doc.querySelectorAll('img');
        const base64Images = Array.from(imgElements).map(img => img.src);

        if (base64Images.length > 0) {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), ...base64Images]
          }));
        }
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error processing DOCX file:", err);
      setIsProcessing(false);
    }
    event.target.value = '';
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-[32px] p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Record' : 'Add New Entry'}</h2>
            <p className="text-slate-400 text-sm">Upload Excel for specs and Word (.docx) for car photos.</p>
          </div>
          <div className="flex items-center gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
            <input type="file" ref={docxInputRef} className="hidden" accept=".docx" onChange={handleDocxUpload} />
            
            <button 
              onClick={() => docxInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} 
              {isProcessing ? 'Extracting...' : 'Import Photos (.docx)'}
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg"
            >
              <FileUp size={18} /> Import Spec XLSX
            </button>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20} /></button>
          </div>
        </div>

        {/* Image Preview Strip */}
        {formData.images && formData.images.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-6 mb-6 border-b border-slate-100">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative shrink-0 group">
                <img src={img} className="h-32 w-48 object-cover rounded-2xl border border-slate-200 shadow-sm" alt="Car preview" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-[10px] uppercase tracking-widest border-b pb-2">Identity</h3>
            <InputField label="Order #" value={formData.orderNo} onChange={v => setFormData({...formData, orderNo: v})} />
            <InputField label="Model" value={formData.model} onChange={v => setFormData({...formData, model: v})} />
            <InputField label="VIN" value={formData.vin} onChange={v => setFormData({...formData, vin: v})} />
            <InputField label="Year" value={formData.year} onChange={v => setFormData({...formData, year: v})} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-[10px] uppercase tracking-widest border-b pb-2">Production Info (Auto-filled)</h3>
            <div className="relative">
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[12px] h-80 font-mono leading-relaxed"
                value={formData.info}
                onChange={e => setFormData({...formData, info: e.target.value})}
                placeholder="Imported options will appear here..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-blue-600 text-[10px] uppercase tracking-widest border-b pb-2">Pricing & Color</h3>
            <InputField label="Color" value={formData.color} onChange={v => setFormData({...formData, color: v})} />
            <InputField label="Option/Trim" value={formData.optionType} onChange={v => setFormData({...formData, optionType: v})} />
            <InputField label="Price (AMD)" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
            <div className="pt-4">
                <h3 className="font-bold text-purple-600 text-[10px] uppercase tracking-widest border-b pb-2 mb-4">Customer Details</h3>
                <InputField label="Buyer" value={formData.buyer} onChange={v => setFormData({...formData, buyer: v})} />
                <InputField label="Phone" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button onClick={() => onSave(formData)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            <Save size={20} /> Save Changes
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={value} onChange={e => onChange(e.target.value)} />
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

  const toggleColumn = (id) => setColumns(prev => prev.map(col => col.id === id ? { ...col, visible: !col.visible } : col));
  const renameColumn = (id, newLabel) => setColumns(prev => prev.map(col => col.id === id ? { ...col, label: newLabel } : col));
  const addColumn = (label) => {
    const id = label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    setColumns(prev => [...prev, { id, label, visible: true, isFixed: false }]);
  };
  const deleteColumn = (id) => setColumns(prev => prev.filter(col => col.id !== id));

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return inventory.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [inventory, search, sortConfig]);

  const handleSave = (data) => {
    if (editingCar) setInventory(inventory.map(c => c.id === editingCar.id ? { ...data, id: c.id } : c));
    else setInventory([...inventory, { ...data, id: Date.now() }]);
    setIsFormOpen(false);
    setEditingCar(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-2xl text-white"><Car size={28}/></div> Inventory
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." className="bg-white border rounded-2xl py-3 pl-12 pr-4 w-64 shadow-sm outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => { setEditingCar(null); setIsFormOpen(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
            <Plus size={20} /> New Unit
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b">
                {columns.filter(c => c.visible).map(col => (
                  <th key={col.id} className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 cursor-pointer" onClick={() => handleSort(col.id)}>
                    {col.label} {sortConfig.key === col.id && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
                <th className="p-4 text-[10px] font-black uppercase text-center text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map(car => (
                <tr key={car.id} className="hover:bg-blue-50/30 transition-colors">
                  {columns.filter(c => c.visible).map(col => (
                    <td key={col.id} className="p-4 text-sm max-w-[200px] truncate">
                      {col.id === 'images' ? (
                        <div className="w-16 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                          {car.images && car.images.length > 0 ? (
                            <img src={car.images[0]} className="w-full h-full object-cover" alt="car" />
                          ) : (
                            <ImageIcon size={14} className="text-slate-300" />
                          )}
                        </div>
                      ) : col.id === 'price' ? (
                        Number(car[col.id]).toLocaleString()
                      ) : (
                        car[col.id] || '-'
                      )}
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setEditingCar(car); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={16} /></button>
                      <button onClick={() => setInventory(inventory.filter(c => c.id !== car.id))} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 p-4 flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>{filteredData.length} UNITS FOUND</span>
            <button onClick={() => setIsConfigOpen(true)} className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"><Settings size={14}/> CONFIGURE COLUMNS</button>
        </div>
      </div>

      <CarForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} columns={columns} initialData={editingCar} />
      <ColumnConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} columns={columns} toggleColumn={toggleColumn} renameColumn={renameColumn} addColumn={addColumn} deleteColumn={deleteColumn} />
    </div>
  );
};

export default App;