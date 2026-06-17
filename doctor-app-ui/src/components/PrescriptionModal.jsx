import React, { useState } from 'react';
import { Send, X, ClipboardList, AlertCircle, CheckCircle2, Pill, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PrescriptionModal = ({ appointmentId, onClose, onRefresh }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
      if (!note.trim()) {
          return toast.error("Please enter a prescription before completing.");
      }

      setLoading(true);
      try {
        // Logic: Matches your @PutMapping("/api/appointments/{id}/complete")
        // Your backend expects a DTO or a Map with "prescription"
        await api.put(`/api/appointments/${appointmentId}/complete`, {
          prescription: note.trim()
        });

        toast.success("Consultation Completed & Patient Notified!");

        onRefresh(); // Refresh the doctor's queue
        onClose();   // Close the modal
      } catch (err) {
        // Handle your custom ApiResponse error message
        const errorMessage = err.response?.data?.message || "Failed to finalize consultation.";
        toast.error(errorMessage);
        console.error("Prescription Error:", err);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div
        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-10">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 border border-emerald-100 shadow-sm">
                <Pill size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Finalize <span className="text-emerald-600">Visit</span></h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic">Record ID: #{appointmentId}</p>
              </div>
            </div>
            <button
                onClick={onClose}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-all group"
            >
                <X className="text-slate-300 group-hover:text-red-400" size={24} />
            </button>
          </div>

          {/* INPUT SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-2">
                <label className="text-slate-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} className="text-emerald-500" />
                    Medical Advice & Rx
                </label>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${note.length > 400 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                    {note.length} / 500
                </span>
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="List medications, dosage, and lifestyle advice... (e.g. Paracetamol 500mg, 1 tab twice daily)"
                className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-6 text-slate-700 font-medium focus:border-emerald-400 focus:bg-white focus:outline-none transition-all resize-none shadow-inner placeholder:text-slate-300 leading-relaxed text-sm"
                maxLength={500}
            />
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading || !note.trim()}
            className={`w-full mt-8 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 text-xs font-black uppercase tracking-[0.2em]
                ${loading || !note.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50 hover:shadow-emerald-300/50'}
            `}
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Syncing Record...
                </>
            ) : (
                <>
                    <CheckCircle2 size={20} />
                    Complete & Start Follow-up Window
                </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
             <div className="h-px w-8 bg-slate-300"></div>
             <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">
               Digital Health Registry 2026
             </p>
             <div className="h-px w-8 bg-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;