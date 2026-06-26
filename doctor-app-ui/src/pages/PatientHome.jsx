import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, MapPin, Star, ChevronRight, Heart, User, Stethoscope } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PatientHome() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    const load = async () => {
      try {
        const [docRes, aptRes] = await Promise.all([
          api.get('/doctors'),
          api.get(`/appointments/patient/${patientId}`),
        ]);
        setDoctors(docRes.data.data || []);
        setAppointments((aptRes.data.data || []).filter(a => a.status === 'BOOKED').slice(0, 3));
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectDoctor = async (doc) => {
    setSelectedDoctor(doc);
    try {
      const res = await api.get(`/availability/doctor/${doc.id}`);
      setSlots((res.data.data || []).filter(s => !s.isBooked));
    } catch {
      setSlots([]);
    }
  };

  const bookAppointment = async (slot) => {
    const reason = prompt('Reason for visit (optional):');
    setSubmitting(true);
    try {
      await api.post('/appointments/book', {
        doctorId: selectedDoctor.id,
        patientId: Number(patientId),
        appointmentDate: slot.date,
        reason: reason || 'General consultation',
      });
      toast.success('Appointment booked!');
      setSelectedDoctor(null);
      setBooking(null);
      const aptRes = await api.get(`/appointments/patient/${patientId}`);
      setAppointments((aptRes.data.data || []).filter(a => a.status === 'BOOKED').slice(0, 3));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7A2E1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#7A2E1A] to-[#4F1B0D] p-6 rounded-2xl text-white">
          <Heart size={28} className="text-[#C9953C] mb-3" />
          <p className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{appointments.length}</p>
          <p className="text-sm text-[#C9953C]/70 font-semibold mt-1">Active Appointments</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8DDD3] card-hover">
          <User size={28} className="text-[#2D6A4F] mb-3" />
          <p className="text-3xl font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{doctors.length}</p>
          <p className="text-sm text-[#9E8E82] font-semibold mt-1">Available Doctors</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8DDD3] card-hover">
          <Stethoscope size={28} className="text-[#C9953C] mb-3" />
          <p className="text-3xl font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{doctors.filter(d => d.specialization).length}</p>
          <p className="text-sm text-[#9E8E82] font-semibold mt-1">Specialties</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8DDD3] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Book an Appointment</h2>
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8E82]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors or specialty..." className="input-field pl-10 py-3 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <button key={doc.id} onClick={() => selectDoctor(doc)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${selectedDoctor?.id === doc.id ? 'border-[#7A2E1A] bg-[#FDF6F0]' : 'border-[#E8DDD3] hover:border-[#9E8E82]'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7A2E1A] to-[#4F1B0D] rounded-xl flex items-center justify-center text-white text-lg font-extrabold">
                  {doc.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#2B1E16]">{doc.name}</p>
                  <p className="text-xs text-[#9E8E82] font-medium">{doc.specialization || 'General Practitioner'}</p>
                </div>
              </div>
              {doc.hospital && <p className="text-xs text-[#8B7D72] mt-3 flex items-center gap-1"><MapPin size={12} />{doc.hospital}</p>}
            </button>
          ))}
          {filteredDoctors.length === 0 && <p className="col-span-full text-center py-8 text-[#9E8E82] font-medium">No doctors found</p>}
        </div>
      </div>

      {selectedDoctor && (
        <div className="bg-white rounded-2xl border border-[#E8DDD3] p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Available slots — Dr. {selectedDoctor.name}</h3>
            <button onClick={() => setSelectedDoctor(null)} className="text-sm text-[#9E8E82] hover:text-[#8B7D72] font-semibold">Close</button>
          </div>
          {slots.length === 0 ? (
            <p className="text-center py-8 text-[#9E8E82] font-medium">No slots available</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map((slot) => (
                <button key={slot.id} onClick={() => bookAppointment(slot)} disabled={submitting}
                  className="p-4 rounded-xl border-2 border-[#E8DDD3] hover:border-[#7A2E1A] hover:bg-[#FDF6F0] transition-all text-center disabled:opacity-50">
                  <p className="font-bold text-sm text-[#2B1E16]">{new Date(slot.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-[#7A2E1A] font-semibold mt-1">{new Date(slot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8DDD3] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upcoming Appointments</h2>
            <button onClick={() => navigate('/my-appointments')} className="text-sm text-[#7A2E1A] font-bold hover:text-[#4F1B0D] flex items-center gap-1">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF5EF] border border-[#E8DDD3]">
                <div className="w-10 h-10 bg-[#7A2E1A]/10 rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-[#7A2E1A]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#2B1E16]">Dr. {apt.doctorName}</p>
                  <p className="text-xs text-[#9E8E82] font-medium">{new Date(apt.appointmentDate).toLocaleString()}</p>
                </div>
                <span className="status-badge booked">{apt.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
