import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, XCircle, Stethoscope,
  Pill, Activity, ChevronLeft, RefreshCw, CheckCircle, ClipboardList,
  MessageCircle, AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ChatWindow from '../components/ChatWindow';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const patientId = localStorage.getItem('userId');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/appointments/patient/${patientId}`);
      // Sort: Newest appointments first
      const sortedData = (res.data.data || []).sort((a, b) =>
        new Date(b.appointmentDate) - new Date(a.appointmentDate)
      );
      setAppointments(sortedData);
      if (patientId) {
        try {
          const unreadRes = await api.get(`/api/chat/unread/all/${patientId}`);
          setUnreadCounts(unreadRes.data.data || {});
        } catch (_) {}
      }
    } catch (err) {
      console.error("Error fetching history", err);
      toast.error("Failed to load appointment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchHistory();
  }, [patientId]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.put(`/appointments/${id}/cancel`);
        toast.success("Appointment cancelled");
        fetchHistory();
      } catch (err) {
        toast.error("Could not cancel appointment");
      }
    }
  };

  // Logic to determine if chat is still available (24h rule)
  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;

    const completionTime = new Date(apt.updatedAt || apt.appointmentDate);
    const now = new Date();
    const diffInHours = (now - completionTime) / (1000 * 60 * 60);

    return diffInHours < 24;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-600" size={40} />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Medical Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/patient-home')}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
            >
              <ChevronLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter">
              My Health <span className="text-blue-600">Journey</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Pune Digital Health Registry • 2026
            </p>
          </div>
          <button
            onClick={fetchHistory}
            className="bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} /> Refresh History
          </button>
        </header>

        {/* Appointment Cards */}
        <div className="grid gap-8">
          {appointments.length > 0 ? appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                {/* Left Side: Doctor & Date */}
                <div className="flex items-start md:items-center gap-8">
                  <div className={`p-6 rounded-[2.5rem] shadow-inner transition-transform group-hover:scale-110 duration-500 ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                    apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? 'bg-rose-50 text-rose-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {apt.status === 'COMPLETED' ? <CheckCircle size={36} /> : <Calendar size={36} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-black text-slate-900 text-3xl tracking-tight leading-none">
                        Dr. {apt.doctorName}
                      </h3>
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                        {apt.doctorSpecialization || 'Specialist'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 font-medium italic text-sm py-1">
                      <Activity size={14} className="text-slate-300" />
                      <span>"{apt.reason || "General consultation"}"</span>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                        <Clock size={14} className="text-blue-400" />
                        {new Date(apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex items-center gap-4 self-end lg:self-center">

                  {/* CHAT BUTTON: Only shows if within the 24h Golden Window */}
                  {isChatAvailable(apt) && (
                    <div className="relative">
                      <button
                        onClick={() => setActiveChat(apt)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <MessageCircle size={16} />
                        Ask Doubt
                      </button>
                      {unreadCounts[apt.id] > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                          {unreadCounts[apt.id]}
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                    'bg-blue-600 text-white shadow-lg shadow-blue-100 border-transparent'
                  }`}>
                    {apt.status}
                  </div>

                  {apt.status === 'BOOKED' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-[1.5rem] transition-all border border-transparent hover:border-rose-100"
                      title="Cancel Appointment"
                    >
                      <XCircle size={24} />
                    </button>
                  )}
                </div>
              </div>

              {/* Prescription Section */}
              {apt.status === 'COMPLETED' && (
                <div className="mt-10 pt-8 border-t border-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {apt.prescription ? (
                    <div className="bg-slate-50/80 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-500 border border-slate-100">
                          <Pill size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Doctor's Prescription</p>
                      </div>
                      <p className="text-slate-800 font-bold leading-relaxed italic text-xl pl-2 relative z-10">
                        "{apt.prescription}"
                      </p>
                      <Stethoscope size={100} className="absolute -bottom-6 -right-6 text-slate-200/40 -rotate-12 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <AlertCircle size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Medical notes will appear once finalized by the doctor.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-32 bg-white rounded-[5rem] border-4 border-dashed border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ClipboardList className="text-slate-200" size={48} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">No historical data available</p>
              <button
                onClick={() => navigate('/patient-home')}
                className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Book Your First Appointment →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Chat Window */}
      {activeChat && (
        <ChatWindow
          appointment={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;