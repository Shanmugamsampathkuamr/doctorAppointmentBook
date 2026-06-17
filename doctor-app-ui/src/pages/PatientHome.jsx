import React, { useState, useEffect } from 'react';
import {
  Search, User, Calendar, LogOut, Activity, MapPin,
  Clock, Star, X, CheckCircle, ClipboardList, ShieldCheck, Bell
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NotificationDropdown from '../components/NotificationDropdown';
import DoctorProfileModal from '../components/DoctorProfileModal';

const PatientHome = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [userName] = useState(localStorage.getItem('userName') || "Guest");
  const userId = localStorage.getItem('userId');

  // UI States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  // Booking States
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNote, setBookingNote] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- API LOGIC ---

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/users');
      const allUsers = res.data.data || res.data;
      const doctorList = allUsers.filter(u => u.role === 'DOCTOR');
      setDoctors(doctorList);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/api/notifications/user/${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Notifications failed", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const openBooking = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsProfileOpen(false); // Close profile if open
    setIsBookingOpen(true);
    setLoadingSlots(true);
    setSelectedSlot(null);

    try {
      const res = await api.get(`/api/availability/doctor/${doctor.id}`);
      // Filter out already booked slots on frontend for safety
      const slots = res.data.data || res.data || [];
      setAvailableSlots(slots.filter(s => !s.isBooked));
    } catch (err) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return;

    const appointmentData = {
      doctorId: selectedDoctor.id,
      patientId: userId,
      // Sending ISO string to match LocalDateTime in Spring Boot
      appointmentDate: `${selectedSlot.availableDate}T${selectedSlot.startTime}`,
      reason: bookingNote || "General Consultation"
    };

    try {
      await api.post('/api/appointments', appointmentData);
      toast.success("Booking confirmed!");
      setIsBookingOpen(false);
      setTimeout(() => navigate('/my-appointments'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Slot is no longer available.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Securely logged out");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">

      {/* --- NAVIGATION --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2 text-blue-600 font-black text-2xl italic tracking-tighter">
          <Activity size={32} strokeWidth={3} />
          <span>HealthConnect</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/my-appointments')}
            className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <ClipboardList size={18} /> My Bookings
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all relative"
            >
              <Bell size={20} />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>
            {showNotif && (
              <NotificationDropdown
                notifications={notifications}
                onRefresh={fetchNotifications}
                onClose={() => setShowNotif(false)}
              />
            )}
          </div>

          <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Patient</p>
              <p className="text-sm font-black text-slate-900 leading-none">{userName}</p>
            </div>
            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="bg-slate-900 py-24 px-8 text-center text-white relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-6xl font-black mb-6 italic tracking-tight">Expert Care at <span className="text-blue-500">Your Fingertips</span></h1>
          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-2 shadow-2xl flex items-center border-4 border-white/10">
            <Search className="text-slate-300 ml-6" size={24} />
            <input
              type="text"
              placeholder="Search by specialty (Dentist, Cardiologist)..."
              className="w-full p-5 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </section>

      {/* --- DOCTOR LIST --- */}
      <main className="max-w-7xl mx-auto py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors
            .filter(doc => doc.specialization?.toLowerCase().includes(search))
            .map((doc) => (
            <div key={doc.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={40} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        <Star size={12} fill="currentColor" /> {doc.averageRating || "5.0"}
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Verified Specialist</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-1">Dr. {doc.name}</h3>
              <p className="text-blue-600 font-black text-sm uppercase tracking-widest mb-6 italic">{doc.specialization}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Experience</span>
                    <span className="text-sm font-black text-slate-700">{doc.experience || "8+"} Years</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Location</span>
                    <span className="text-sm font-black text-slate-700">Pune, MH</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                    onClick={() => { setSelectedDoctor(doc); setIsProfileOpen(true); }}
                    className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                    View Profile
                </button>
                <button
                    onClick={() => openBooking(doc)}
                    className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                    Book Now <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODALS --- */}
      {isProfileOpen && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setIsProfileOpen(false)}
          onBook={(doc) => openBooking(doc)}
        />
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBookingOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right">
            <button onClick={() => setIsBookingOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl"><X /></button>

            <div className="mb-10 mt-6">
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Confirm Visit</h2>
                <p className="text-blue-600 font-black text-lg">Dr. {selectedDoctor?.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Available Slots</label>
                {loadingSlots ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
                        <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {availableSlots.length > 0 ? availableSlots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-4 border-2 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                    selectedSlot?.id === slot.id
                                    ? "border-blue-600 bg-blue-50 text-blue-600"
                                    : "border-slate-50 bg-slate-50 text-slate-500"
                                }`}
                            >
                                <Clock size={14} />
                                {new Date(`${slot.availableDate}T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </button>
                        )) : <p className="col-span-2 text-center text-slate-300 text-xs py-10 font-bold italic">No slots for today.</p>}
                    </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Symptoms / Notes</label>
                <textarea
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] h-40 resize-none font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Describe your health concern..."
                />
              </div>
            </div>

            <button
                onClick={handleConfirmAppointment}
                disabled={!selectedSlot}
                className={`w-full py-6 mt-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                    selectedSlot ? "bg-blue-600 text-white shadow-xl" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
            >
                Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHome;