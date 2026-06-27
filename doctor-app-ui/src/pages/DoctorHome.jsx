import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, MessageCircle, TrendingUp, Plus, RefreshCcw, Clipboard, User, Heart } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AvailabilityModal from '../components/AvailabilityModal';
import PrescriptionModal from '../components/PrescriptionModal';
import ChatWindow from '../components/ChatWindow';

export default function DoctorHome() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailability, setShowAvailability] = useState(false);
  const [prescriptionApt, setPrescriptionApt] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const doctorId = localStorage.getItem('userId');

  useEffect(() => {
    if (!doctorId) { toast.error('Session expired'); navigate('/login'); return; }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [aptRes] = await Promise.all([api.get(`/appointments/doctor/${doctorId}`)]);
      const sorted = (aptRes.data.data || []).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      setAppointments(sorted);
      try { const u = await api.get(`/api/chat/unread/all/${doctorId}`); setUnreadCounts(u.data.data || {}); } catch {}
    } catch { toast.error('Failed to sync data'); } finally { setLoading(false); }
  };

  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;
    return (Date.now() - new Date(apt.updatedAt || apt.appointmentDate)) / (1000 * 60 * 60) < 24;
  };

  const handleComplete = (id) => setPrescriptionApt(id);
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try { await api.put(`/appointments/${id}/cancel`); toast.success('Cancelled'); fetchData(); } catch { toast.error('Failed to cancel'); }
  };

  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const booked = appointments.filter(a => a.status === 'BOOKED').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] p-5 rounded-xl text-white">
          <TrendingUp size={24} className="text-white/70 mb-3" />
          <p className="text-2xl font-bold">{rate}%</p>
          <p className="text-xs text-white/70 font-medium mt-0.5">Efficiency</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <Heart size={24} className="text-[#06B6D4] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{booked}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Awaiting Visit</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <CheckCircle size={24} className="text-[#10B981] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{completed}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Completed</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <Clipboard size={24} className="text-[#10B981] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{total}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E4E4E7]">
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <h2 className="text-base font-bold text-[#18181B]">Patient Queue</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAvailability(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#18181B] text-white rounded-lg text-xs font-semibold hover:bg-[#27272A] transition-all">
              <Plus size={14} /> Availability
            </button>
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FAFAFA] text-[#52525B] rounded-lg text-xs font-semibold hover:bg-[#F4F4F5] transition-all">
              <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Sync
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider border-b border-[#E4E4E7]">
                <th className="text-left px-5 py-3">Patient</th>
                <th className="text-left px-5 py-3">Date & Time</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA] transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#4F46E5] text-xs font-bold">{apt.patientName?.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-sm text-[#18181B]">{apt.patientName}</p>
                        <p className="text-[10px] text-[#A1A1AA] italic">{apt.reason || 'General consultation'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#18181B]">{new Date(apt.appointmentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-5 py-4 text-center"><span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isChatAvailable(apt) && (
                        <div className="relative">
                          <button onClick={() => setActiveChat(apt)}
                            className="p-2 bg-[#EEF2FF] text-[#4F46E5] rounded-lg hover:bg-[#E0E7FF] transition-all">
                            <MessageCircle size={16} />
                          </button>
                          {unreadCounts[apt.id] > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#EF4444] rounded-full text-[7px] font-bold text-white flex items-center justify-center">{unreadCounts[apt.id]}</span>}
                        </div>
                      )}
                      {apt.status === 'BOOKED' && (
                        <>
                          <button onClick={() => handleComplete(apt.id)} className="p-2 bg-[#D1FAE5] text-[#10B981] rounded-lg hover:bg-[#A7F3D0] transition-all"><CheckCircle size={16} /></button>
                          <button onClick={() => handleCancel(apt.id)} className="p-2 bg-[#FEE2E2] text-[#EF4444] rounded-lg hover:bg-[#FECACA] transition-all"><XCircle size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-sm text-[#A1A1AA]">No appointments yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showAvailability && <AvailabilityModal isOpen={showAvailability} onClose={() => setShowAvailability(false)} onRefresh={fetchData} />}
      {prescriptionApt && <PrescriptionModal appointmentId={prescriptionApt} onClose={() => setPrescriptionApt(null)} onRefresh={fetchData} />}
      {activeChat && <ChatWindow appointment={activeChat} onClose={() => setActiveChat(null)} />}
    </div>
  );
}
