import { useState } from 'react';
import { X, Pill } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PrescriptionModal({ appointmentId, onClose, onRefresh }) {
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!prescription.trim()) { toast.error('Enter prescription'); return; }
    setLoading(true);
    try {
      await api.put(`/appointments/${appointmentId}/complete`, { prescription });
      toast.success('Visit completed');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><Pill size={20} className="text-emerald-600" /></div>
            <h3 className="text-lg font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Complete Visit</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#64748B] p-1"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Prescription / Notes</label>
            <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={5}
              placeholder="Enter prescription details, medical notes, and follow-up instructions..."
              className="input-field resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-[#F0F4F8] rounded-xl text-sm font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#059669] text-white rounded-xl text-sm font-bold py-3 hover:bg-[#047857] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
