import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, MessageCircle, Pill, ClipboardList } from 'lucide-react';
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
        try { const u = await api.get(`/api/chat/unread/all/${patientId}`); setUnreadCounts(u.data.data || {}); } catch {}
      } catch { toast.error('Failed to load appointments'); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;
    return (Date.now() - new Date(apt.updatedAt || apt.appointmentDate)) / (1000 * 60 * 60) < 24;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="animate-fade-in space-y-4 max-w-5xl">
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-12 text-center">
          <ClipboardList size={40} className="text-[#E4E4E7] mx-auto mb-3" />
          <p className="text-base font-semibold text-[#A1A1AA]">No appointments yet</p>
          <p className="text-sm text-[#A1A1AA] mt-1">Book your first appointment to get started</p>
        </div>
      ) : (
        appointments.map((apt, i) => (
          <div key={apt.id} className="bg-white rounded-xl border border-[#E4E4E7] p-5 card-hover animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  apt.status === 'COMPLETED' ? 'bg-[#D1FAE5] text-[#10B981]' :
                  apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                  'bg-[#EEF2FF] text-[#4F46E5]'
                }`}>
                  {apt.status === 'COMPLETED' ? <CheckCircle size={22} /> :
                   apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? <XCircle size={22} /> :
                   <Calendar size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#18181B]">Dr. {apt.doctorName}</h3>
                  <p className="text-sm text-[#52525B] mt-0.5">{apt.doctorSpecialization || 'Specialist'}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-[#A1A1AA]"><Clock size={11} />{new Date(apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    {apt.reason && <span className="text-xs text-[#A1A1AA] italic">"{apt.reason}"</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                {isChatAvailable(apt) && (
                  <div className="relative">
                    <button onClick={() => setActiveChat(apt)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EEF2FF] text-[#4F46E5] rounded-lg text-xs font-semibold hover:bg-[#E0E7FF] transition-all border border-[#E0E7FF]">
                      <MessageCircle size={14} /> Follow Up
                    </button>
                    {unreadCounts[apt.id] > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white text-[7px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCounts[apt.id]}</span>}
                  </div>
                )}
                {apt.status === 'COMPLETED' && !isChatAvailable(apt) && (
                  <button onClick={() => setReviewAppointment(apt)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FEF3C7] text-[#B45309] rounded-lg text-xs font-semibold hover:bg-[#FDE68A] transition-all border border-[#FDE68A]">
                    Review
                  </button>
                )}
                <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
              </div>
            </div>
            {apt.status === 'COMPLETED' && apt.prescription && (
              <div className="mt-3 pt-3 border-t border-[#E4E4E7]">
                <div className="flex items-center gap-1.5 text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                  <Pill size={12} /> Prescription
                </div>
                <p className="text-sm font-medium text-[#18181B] italic">"{apt.prescription}"</p>
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
