import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MessageCircle, ChevronRight, Pill, Stethoscope, ClipboardList } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ChatWindow from '../components/ChatWindow';
import ReviewModal from '../components/ReviewModal';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [reviewAppointment, setReviewAppointment] = useState(null);
  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    if (!patientId) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/appointments/patient/${patientId}`);
        const data = (res.data.data || []).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        setAppointments(data);
        try {
          const u = await api.get(`/api/chat/unread/all/${patientId}`);
          setUnreadCounts(u.data.data || {});
        } catch {}
      } catch {
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;
    const t = new Date(apt.updatedAt || apt.appointmentDate);
    return (Date.now() - t) / (1000 * 60 * 60) < 24;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center">
          <ClipboardList size={48} className="text-[#E2E8F0] mx-auto mb-4" />
          <p className="text-lg font-extrabold text-[#94A3B8]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No appointments yet</p>
          <p className="text-sm text-[#94A3B8] mt-2">Book your first appointment to get started</p>
        </div>
      ) : (
        appointments.map((apt, i) => (
          <div key={apt.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-hover animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                  apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? 'bg-red-50 text-red-400' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {apt.status === 'COMPLETED' ? <CheckCircle size={24} /> :
                   apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? <XCircle size={24} /> :
                   <Calendar size={24} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0A1628] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dr. {apt.doctorName}</h3>
                  <p className="text-sm text-[#64748B] font-medium mt-1">{apt.doctorSpecialization || 'Specialist'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
                      <Clock size={12} />
                      {new Date(apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    {apt.reason && <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium italic">"{apt.reason}"</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center">
                {isChatAvailable(apt) && (
                  <div className="relative">
                    <button onClick={() => setActiveChat(apt)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100">
                      <MessageCircle size={16} /> Follow Up
                    </button>
                    {unreadCounts[apt.id] > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">{unreadCounts[apt.id]}</span>
                    )}
                  </div>
                )}
                {apt.status === 'COMPLETED' && !isChatAvailable(apt) && (
                  <button onClick={() => setReviewAppointment(apt)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100">
                    Review
                  </button>
                )}
                <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
              </div>
            </div>
            {apt.status === 'COMPLETED' && apt.prescription && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Pill size={14} /> Prescription
                </div>
                <p className="text-sm font-medium text-[#1E293B] italic">"{apt.prescription}"</p>
              </div>
            )}
          </div>
        ))
      )}

      {activeChat && <ChatWindow appointment={activeChat} onClose={() => setActiveChat(null)} />}
      {reviewAppointment && <ReviewModal appointment={reviewAppointment} onClose={() => setReviewAppointment(null)} />}
    </div>
  );
}
