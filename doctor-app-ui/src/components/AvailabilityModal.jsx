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
      for (const slot of slots) await api.post('/availability', { doctorId: Number(doctorId), date: slot });
      toast.success(`${slots.length} slot(s) added`);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg border border-[#E4E4E7] animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <h3 className="text-base font-bold text-[#18181B]">Set Availability</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#52525B] p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field py-2.5 text-sm" />
            </div>
          </div>
          <button onClick={addSlot} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FAFAFA] rounded-lg text-sm font-medium text-[#4F46E5] hover:bg-[#F4F4F5] transition-all border-2 border-dashed border-[#E4E4E7]">
            <Plus size={16} /> Add Slot
          </button>
          {slots.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {slots.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]">
                  <div className="flex items-center gap-3 text-sm font-medium text-[#18181B]">
                    <Calendar size={14} className="text-[#4F46E5]" />
                    {new Date(s).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    <Clock size={14} className="text-[#4F46E5]" />
                    {new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button onClick={() => removeSlot(i)} className="p-1.5 text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-[#FAFAFA] rounded-lg text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] transition-all">Cancel</button>
            <button onClick={save} disabled={loading || slots.length === 0} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Save ${slots.length} Slot(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
