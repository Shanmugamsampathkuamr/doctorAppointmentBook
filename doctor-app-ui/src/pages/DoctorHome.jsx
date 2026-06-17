import React, { useState, useEffect } from 'react';
import {
  User, Clock, CheckCircle, LogOut, Activity, Bell,
  Calendar, XCircle, Plus, RefreshCcw, Clipboard, Star,
  MessageCircle, TrendingUp
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AvailabilityModal from '../components/AvailabilityModal';
import PrescriptionModal from '../components/PrescriptionModal';
import NotificationDropdown from '../components/NotificationDropdown';
import DoctorProfileModal from '../components/DoctorProfileModal';
import ChatWindow from '../components/ChatWindow';

const DoctorHome = () => {
  // --- STATE ---
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  // UI States
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const doctorName = localStorage.getItem('userName') || "Doctor";
  const doctorId = localStorage.getItem('userId');

  // --- REFRESH LOGIC ---
  const fetchAllData = async () => {
    if (!doctorId) return;
    try {
      const [apptRes, notifRes] = await Promise.all([
        api.get(`/appointments/doctor/${doctorId}`),
        api.get(`/notifications/user/${doctorId}`)
      ]);
      // Sort: Most recent appointments first
      const sorted = (apptRes.data.data || []).sort((a, b) =>
        new Date(b.appointmentDate) - new Date(a.appointmentDate)
      );
      setAppointments(sorted);
      setNotifications(notifRes.data.data || []);
    } catch (err) {
      console.error("Data Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
        return;
    }
    fetchAllData();

    const interval = setInterval(fetchAllData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [doctorId]);

  // --- HELPERS ---
  const isChatAvailable = (apt) => {
    if (apt.status !== 'COMPLETED') return false;
    const completionTime = new Date(apt.updatedAt || apt.appointmentDate);
    const now = new Date();
    const diffInHours = (now - completionTime) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  const handleCompleteClick = (id) => {
    setSelectedAptId(id);
    setIsPrescriptionModalOpen(true);
  };

  const handleCancelClick = async (id) => {
    if (!window.confirm("Cancel this appointment? This will release the time slot.")) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled and slot freed");
      fetchAllData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* --- 1. SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 sticky top-0 h-screen shadow-2xl z-20">
        <div className="flex items-center gap-3 text-blue-400 font-black text-2xl mb-12 italic">
          <Activity size={32} strokeWidth={3} />
          <span>HealthConnect</span>
        </div>
        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center gap-4 p-4 bg-blue-600 rounded-2xl font-bold shadow-lg shadow-blue-900/40 transition text-left">
            <Calendar size={20} /> My Schedule
          </button>

          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-4 p-4 hover:bg-slate-800 rounded-2xl transition text-slate-400 font-bold text-left group"
          >
            <Star size={20} className="group-hover:text-amber-400" />
            <span className="group-hover:text-white">My Reviews</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition font-black mt-auto border-t border-slate-800 pt-8 group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </aside>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-2 italic tracking-tight uppercase">Dr. {doctorName}</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {loading ? "Syncing..." : `${appointments.filter(a => a.status === 'BOOKED').length} Active Appointments`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
            >
              <Plus size={20} strokeWidth={3} /> Set Availability
            </button>

            <div className="relative">
              <div
                onClick={() => setShowNotif(!showNotif)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative cursor-pointer hover:shadow-md transition-all text-slate-600"
              >
                < Bell size={24} />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
              </div>
              {showNotif && (
                <NotificationDropdown
                  notifications={notifications}
                  onRefresh={fetchAllData}
                  onClose={() => setShowNotif(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* --- 3. STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={120} />
            </div>
            <p className="text-blue-200 font-black uppercase tracking-widest text-[10px] mb-2">Efficiency Rate</p>
            <h3 className="text-6xl font-black">
              {appointments.length > 0 ? Math.round((appointments.filter(a => a.status === 'COMPLETED').length / appointments.length) * 100) : 0}%
            </h3>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Awaiting Visit</p>
            <h3 className="text-6xl font-black text-slate-900">{appointments.filter(a => a.status === 'BOOKED').length}</h3>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Visits Completed</p>
            <h3 className="text-6xl font-black text-emerald-500">{appointments.filter(a => a.status === 'COMPLETED').length}</h3>
          </div>
        </div>

        {/* --- 4. APPOINTMENT TABLE --- */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Patient Queue</h2>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all"
            >
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
              Sync Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Patient Details</th>
                  <th className="px-10 py-6">Appointment Date</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length > 0 ? (
                  appointments.map((apt) => (
                  <tr key={apt.id} className="group hover:bg-blue-50/30 transition-all">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 text-xl tracking-tight uppercase">{apt.patientName}</div>
                      <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest mt-1 italic">
                        <Clipboard size={12} /> {apt.reason || 'General Consultation'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="text-slate-700 font-black text-sm">
                          {new Date(apt.appointmentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                          <Clock size={12} className="text-blue-500" />
                          {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                        apt.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        apt.status === 'CANCELLED' || apt.status === 'REJECTED' ? "bg-rose-50 text-rose-500 border-rose-100" :
                        "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-4">
                        {/* CHAT ACTION: Only for recent completions */}
                        {isChatAvailable(apt) && (
                          <button
                            onClick={() => setActiveChat(apt)}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                          >
                            <MessageCircle size={16} /> Follow Up
                          </button>
                        )}

                        {apt.status === 'BOOKED' && (
                          <>
                            <button
                              onClick={() => handleCompleteClick(apt.id)}
                              className="p-4 bg-emerald-500 text-white rounded-2xl hover:scale-110 shadow-lg shadow-emerald-100 transition-all"
                              title="Complete Visit & Add Prescription"
                            >
                              <CheckCircle size={22} />
                            </button>
                            <button
                              onClick={() => handleCancelClick(apt.id)}
                              className="p-4 bg-white text-slate-300 border-2 border-slate-100 rounded-2xl hover:text-rose-500 transition-all"
                              title="Reject Appointment"
                            >
                              <XCircle size={22} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))) : (
                  <tr><td colSpan="4" className="py-20 text-center opacity-30 font-black uppercase tracking-widest italic">No data synced for today</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- 5. MODALS & OVERLAYS --- */}
      <AvailabilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchAllData} />

      {isPrescriptionModalOpen && (
        <PrescriptionModal
          appointmentId={selectedAptId}
          onClose={() => setIsPrescriptionModalOpen(false)}
          onRefresh={fetchAllData}
        />
      )}

      {showProfile && (
        <DoctorProfileModal
          doctor={{ id: doctorId, name: doctorName, specialization: 'Authorized Medical Officer' }}
          onClose={() => setShowProfile(false)}
          onBook={() => setShowProfile(false)}
        />
      )}

      {activeChat && (
        <ChatWindow
          appointment={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default DoctorHome;