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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg border border-[#E4E4E7] animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#D1FAE5] rounded-lg"><Pill size={18} className="text-[#10B981]" /></div>
            <h3 className="text-base font-bold text-[#18181B]">Complete Visit</h3>
          </div>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#52525B] p-1"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Prescription / Notes</label>
            <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={5}
              placeholder="Enter prescription details, medical notes, and follow-up instructions..." className="input-field resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#FAFAFA] rounded-lg text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#10B981] text-white rounded-lg text-sm font-semibold py-2.5 hover:bg-[#059669] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
