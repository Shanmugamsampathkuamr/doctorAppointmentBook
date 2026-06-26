import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, MessageCircle, TrendingUp, Plus, RefreshCcw, Stethoscope, Clipboard, User, Activity } from 'lucide-react';
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
  const doctorName = localStorage.getItem('userName') || 'Doctor';

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
      try {
        const u = await api.get(`/api/chat/unread/all/${doctorId}`);
        setUnreadCounts(u.data.data || {});
      } catch {}
    } catch {
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  };

  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;
    const t = new Date(apt.updatedAt || apt.appointmentDate);
    return (Date.now() - t) / (1000 * 60 * 60) < 24;
  };

  const handleComplete = (id) => setPrescriptionApt(id);
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try { await api.put(`/appointments/${id}/cancel`); toast.success('Cancelled'); fetchData(); }
    catch { toast.error('Failed to cancel'); }
  };

  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const booked = appointments.filter(a => a.status === 'BOOKED').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6 rounded-2xl text-white">
          <TrendingUp size={28} className="text-blue-200 mb-3" />
          <p className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{rate}%</p>
          <p className="text-sm text-blue-200 font-semibold mt-1">Efficiency Rate</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <Activity size={28} className="text-[#F59E0B] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{booked}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Awaiting Visit</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <CheckCircle size={28} className="text-[#059669] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{completed}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Visits Completed</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <Clipboard size={28} className="text-[#059669] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{total}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Total Appointments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Patient Queue</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAvailability(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1628] text-white rounded-xl text-xs font-bold hover:bg-[#1A2D4A] transition-all">
              <Plus size={16} /> Set Availability
            </button>
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#F0F4F8] text-[#64748B] rounded-xl text-xs font-bold hover:bg-[#E2E8F0] transition-all">
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Sync
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="text-left px-6 py-4">Patient</th>
                <th className="text-left px-6 py-4">Date & Time</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-[#F0F4F8] hover:bg-[#F8FAFC] transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#2563EB]/10 rounded-lg flex items-center justify-center text-[#2563EB] text-xs font-extrabold">
                        {apt.patientName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1E293B]">{apt.patientName}</p>
                        <p className="text-[10px] text-[#94A3B8] font-medium italic">{apt.reason || 'General consultation'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#1E293B]">{new Date(apt.appointmentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-[#94A3B8] font-medium">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isChatAvailable(apt) && (
                        <div className="relative">
                          <button onClick={() => setActiveChat(apt)}
                            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100">
                            <MessageCircle size={18} />
                          </button>
                          {unreadCounts[apt.id] > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center">{unreadCounts[apt.id]}</span>}
                        </div>
                      )}
                      {apt.status === 'BOOKED' && (
                        <>
                          <button onClick={() => handleComplete(apt.id)}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleCancel(apt.id)}
                            className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-all border border-red-100">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan="4" className="py-16 text-center text-[#94A3B8] font-medium">No appointments yet</td></tr>
              )}
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
