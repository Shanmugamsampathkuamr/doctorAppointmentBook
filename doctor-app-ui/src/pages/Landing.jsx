import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Calendar, Shield, Clock, Stethoscope, User, Star, MapPin } from 'lucide-react';
import api from '../api/axios';

const benefits = [
  { icon: Stethoscope, title: 'Top Specialists', desc: 'Access leading doctors across 20+ specialties' },
  { icon: Calendar, title: 'Smart Booking', desc: 'Book appointments in seconds, reschedule anytime' },
  { icon: Shield, title: 'HIPAA Compliant', desc: 'Your data is encrypted and never shared' },
  { icon: Clock, title: '24/7 Access', desc: 'Round-the-clock care, whenever you need it' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/doctors').then(res => {
      setDoctors(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = () => {
    if (!token) { navigate('/login'); return; }
    navigate('/patient-home');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">H</span>
            </div>
            <span className="text-lg font-bold text-[#18181B] tracking-tight">HealthConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#doctors" className="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors">Find Doctors</a>
            <a href="#benefits" className="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors">Why Us</a>
            {token ? (
              <button onClick={() => navigate('/patient-home')} className="btn-primary text-sm">Dashboard</button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors">Sign In</button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">Get Started</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF2FF] rounded-full border border-[#E0E7FF] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#4F46E5] tracking-wide">Trusted by 10,000+ patients</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#18181B] tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Healthcare that<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]">works for you</span>
            </h1>
            <p className="text-[#52525B] text-base md:text-lg mt-4 leading-relaxed">
              Browse top-rated doctors, check real-time availability, and book appointments in seconds. No sign-up required to explore.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <a href="#doctors" className="btn-primary flex items-center gap-2">
                Find Your Doctor <ArrowRight size={16} />
              </a>
              <button onClick={() => navigate('/register')} className="btn-secondary">
                Create Free Account
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-[#A1A1AA]">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> No credit card</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Free to browse</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Cancel anytime</span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF] to-[#F0FDFA] rounded-[2rem]" />
              <div className="absolute top-8 left-8 right-8 bottom-8 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-[#E4E4E7]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Calendar size={28} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-[#18181B]">{doctors.length || '—'}</p>
                  <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Available Doctors</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#06B6D4]/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-[#4F46E5]/20 to-transparent rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center mb-3">
                <b.icon size={20} className="text-[#4F46E5]" />
              </div>
              <h3 className="font-semibold text-sm text-[#18181B]">{b.title}</h3>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="doctors" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Find your doctor</h2>
            <p className="text-sm text-[#A1A1AA] mt-1">Browse our network of specialists</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or specialty..." className="input-field pl-10 py-2.5 text-sm" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-[#E4E4E7] p-5 card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {doc.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#18181B] truncate">{doc.name}</p>
                    <p className="text-xs text-[#A1A1AA]">{doc.specialization || 'General Practitioner'}</p>
                    {doc.hospital && <p className="text-xs text-[#A1A1AA] mt-1 flex items-center gap-1"><MapPin size={10} />{doc.hospital}</p>}
                  </div>
                </div>
                <button onClick={handleBook}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs font-semibold text-[#52525B] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all">
                  {token ? 'Book Appointment' : 'Sign In to Book'}
                </button>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <p className="col-span-full text-center py-16 text-sm text-[#A1A1AA]">No doctors found</p>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-[#E4E4E7] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-black">H</span>
            </div>
            <span className="text-sm font-semibold text-[#18181B]">HealthConnect</span>
          </div>
          <p className="text-xs text-[#A1A1AA]">Modern healthcare for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
