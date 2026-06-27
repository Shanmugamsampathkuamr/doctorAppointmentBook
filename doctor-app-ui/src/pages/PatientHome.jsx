import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, MapPin, ChevronRight, Heart, User, Stethoscope } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PatientHome() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
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
    } catch { setSlots([]); }
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
        <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] p-5 rounded-xl text-white">
          <Heart size={24} className="text-white/70 mb-3" />
          <p className="text-2xl font-bold">{appointments.length}</p>
          <p className="text-xs text-white/70 font-medium mt-0.5">Active Appointments</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <User size={24} className="text-[#10B981] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{doctors.length}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Available Doctors</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <Stethoscope size={24} className="text-[#06B6D4] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{doctors.filter(d => d.specialization).length}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Specialties</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E4E4E7] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#18181B]">Book an Appointment</h2>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors..." className="input-field pl-9 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDoctors.map((doc) => (
            <button key={doc.id} onClick={() => selectDoctor(doc)}
              className={`text-left p-4 rounded-xl border transition-all ${selectedDoctor?.id === doc.id ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E4E4E7] hover:border-[#A1A1AA]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                  {doc.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#18181B]">{doc.name}</p>
                  <p className="text-xs text-[#A1A1AA]">{doc.specialization || 'General Practitioner'}</p>
                </div>
              </div>
              {doc.hospital && <p className="text-xs text-[#52525B] mt-2 flex items-center gap-1"><MapPin size={11} />{doc.hospital}</p>}
            </button>
          ))}
          {filteredDoctors.length === 0 && <p className="col-span-full text-center py-8 text-[#A1A1AA] text-sm">No doctors found</p>}
        </div>
      </div>

      {selectedDoctor && (
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#18181B]">Available slots — Dr. {selectedDoctor.name}</h3>
            <button onClick={() => setSelectedDoctor(null)} className="text-xs text-[#A1A1AA] hover:text-[#52525B] font-medium">Close</button>
          </div>
          {slots.length === 0 ? (
            <p className="text-center py-8 text-[#A1A1AA] text-sm">No slots available</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button key={slot.id} onClick={() => bookAppointment(slot)} disabled={submitting}
                  className="p-3 rounded-xl border border-[#E4E4E7] hover:border-[#4F46E5] hover:bg-[#EEF2FF] transition-all text-center disabled:opacity-50">
                  <p className="font-semibold text-xs text-[#18181B]">{new Date(slot.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-[#4F46E5] font-medium mt-0.5">{new Date(slot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#18181B]">Upcoming Appointments</h2>
            <button onClick={() => navigate('/my-appointments')} className="text-xs text-[#4F46E5] font-medium hover:text-[#4338CA] flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="w-9 h-9 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <Calendar size={18} className="text-[#4F46E5]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#18181B]">Dr. {apt.doctorName}</p>
                  <p className="text-xs text-[#A1A1AA]">{new Date(apt.appointmentDate).toLocaleString()}</p>
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
