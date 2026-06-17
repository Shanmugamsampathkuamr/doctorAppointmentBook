import React, { useState } from 'react';
import { X, Calendar, Clock, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AvailabilityModal = ({ isOpen, onClose, onRefresh }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const doctorId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) return toast.error("Please select both date and time");

    setLoading(true);
    try {
      // 1. Calculate the End Time (adding 30 minutes)
      const [hours, minutes] = time.split(':').map(Number);
      const end = new Date();
      end.setHours(hours, minutes + 30);
      const endTimeFormatted = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:00`;

      // 2. Prepare the payload to match DoctorAvailabilityRequestDTO exactly
      const payload = {
        doctorId: doctorId,
        availableDate: date,        // Format: YYYY-MM-DD
        startTime: `${time}:00`,    // Format: HH:mm:ss
        endTime: endTimeFormatted   // Format: HH:mm:ss
      };

      // 3. Send request to the correct backend endpoint
      await api.post(`/api/availability/add/${doctorId}`, payload);

      toast.success("New time slot opened!");
      onRefresh();
      onClose();
      setDate('');
      setTime('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set availability");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic tracking-tight">Set Slots</h3>
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Opening New Availability</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 flex items-center gap-2">
                <Calendar size={14} /> Select Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 flex items-center gap-2">
                <Clock size={14} /> Start Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
            <AlertCircle className="text-blue-600 shrink-0" size={18} />
            <p className="text-[10px] text-blue-800 font-bold leading-tight uppercase tracking-tighter">
              Slots created here will appear instantly for patients in their search results.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Creating..." : (
                <>
                  <CheckCircle2 size={18} /> Create Slot
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;