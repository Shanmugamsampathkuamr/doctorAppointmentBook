import { useState } from 'react';
import { X, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AvailabilityModal({ isOpen, onClose, onRefresh }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const addSlot = () => {
    if (!date || !time) { toast.error('Select date and time'); return; }
    const dt = new Date(`${date}T${time}`);
    if (dt < new Date()) { toast.error('Cannot add past time'); return; }
    if (slots.some(s => Math.abs(new Date(s) - dt) < 60000)) { toast.error('Slot already added'); return; }
    setSlots(prev => [...prev, dt.toISOString()].sort());
  };

  const removeSlot = (idx) => setSlots(prev => prev.filter((_, i) => i !== idx));

  const save = async () => {
    if (slots.length === 0) { toast.error('Add at least one slot'); return; }
    setLoading(true);
    const doctorId = localStorage.getItem('userId');
    try {
      for (const slot of slots) {
        await api.post('/availability', { doctorId: Number(doctorId), date: slot });
      }
      toast.success(`${slots.length} slot(s) added`);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E8DDD3]">
          <h3 className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Set Availability</h3>
          <button onClick={onClose} className="text-[#9E8E82] hover:text-[#8B7D72] p-1"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#8B7D72] uppercase tracking-wider mb-1.5 block">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field py-3 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8B7D72] uppercase tracking-wider mb-1.5 block">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field py-3 text-sm" />
            </div>
          </div>
          <button onClick={addSlot} className="w-full flex items-center justify-center gap-2 py-3 bg-[#FDF6F0] rounded-xl text-sm font-bold text-[#7A2E1A] hover:bg-[#E8DDD3] transition-all border-2 border-dashed border-[#E8DDD3]">
            <Plus size={18} /> Add Slot
          </button>
          {slots.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {slots.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#FAF5EF] rounded-xl border border-[#E8DDD3]">
                  <div className="flex items-center gap-3 text-sm font-medium text-[#2B1E16]">
                    <Calendar size={16} className="text-[#7A2E1A]" />
                    {new Date(s).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    <Clock size={16} className="text-[#7A2E1A]" />
                    {new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button onClick={() => removeSlot(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-[#FDF6F0] rounded-xl text-sm font-bold text-[#8B7D72] hover:bg-[#E8DDD3] transition-all">Cancel</button>
            <button onClick={save} disabled={loading || slots.length === 0} className="flex-1 btn-primary text-sm py-3 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Save ${slots.length} Slot(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
