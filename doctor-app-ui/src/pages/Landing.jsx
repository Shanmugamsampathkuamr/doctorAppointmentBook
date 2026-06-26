import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, MapPin, Star, Calendar, Shield, Sparkles, Activity, ArrowRight, Menu, X, Stethoscope, User, Clock } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const benefits = [
  { icon: Stethoscope, title: 'Top Specialists', desc: 'Consult experienced doctors from every field' },
  { icon: Calendar, title: 'Instant Booking', desc: 'Book appointments in seconds, no phone calls' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and confidential' },
  { icon: Clock, title: '24/7 Access', desc: 'Available anytime, anywhere you need it' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/doctors').then(res => {
      setDoctors(res.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (doctorId) => {
    if (!token) {
      toast('Please sign in to book an appointment', { icon: '🔒' });
      navigate('/login');
      return;
    }
    navigate('/patient-home');
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E8DDD3]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7A2E1A] rounded-lg flex items-center justify-center">
              <Heart size={18} className="text-[#C9953C]" />
            </div>
            <span className="text-lg font-extrabold text-[#2B1E16] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#doctors" className="text-sm font-semibold text-[#8B7D72] hover:text-[#7A2E1A] transition-colors">Find Doctors</a>
            <a href="#benefits" className="text-sm font-semibold text-[#8B7D72] hover:text-[#7A2E1A] transition-colors">Why Us</a>
            {token ? (
              <button onClick={() => navigate('/patient-home')} className="btn-primary text-xs py-2 px-5">Dashboard</button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="text-sm font-bold text-[#7A2E1A] hover:text-[#4F1B0D] transition-colors">Sign In</button>
                <button onClick={() => navigate('/register')} className="btn-primary text-xs py-2 px-5">Get Started</button>
              </div>
            )}
          </nav>
          <button className="md:hidden p-2 text-[#8B7D72]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8DDD3] px-6 py-4 space-y-3 animate-fade-in">
            <a href="#doctors" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-[#8B7D72] py-2">Find Doctors</a>
            <a href="#benefits" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-[#8B7D72] py-2">Why Us</a>
            {token ? (
              <button onClick={() => { setMenuOpen(false); navigate('/patient-home'); }} className="btn-primary w-full text-xs py-2">Dashboard</button>
            ) : (
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setMenuOpen(false); navigate('/login'); }} className="flex-1 py-2 border border-[#E8DDD3] rounded-xl text-sm font-bold text-[#7A2E1A]">Sign In</button>
                <button onClick={() => { setMenuOpen(false); navigate('/register'); }} className="flex-1 btn-primary text-xs py-2">Get Started</button>
              </div>
            )}
          </div>
        )}
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7A2E1A]/5 rounded-full border border-[#7A2E1A]/10 mb-6">
              <Sparkles size={14} className="text-[#C9953C]" />
              <span className="text-[10px] font-bold text-[#7A2E1A] uppercase tracking-wider">Your Health, Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2B1E16] tracking-tight leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Healthcare that<br />revolves around <span className="text-[#7A2E1A]">you</span>
            </h1>
            <p className="text-[#9E8E82] text-base md:text-lg mt-4 leading-relaxed max-w-lg">
              Browse top doctors, check availability, and book appointments — all without signing up. Only create an account when you're ready to book.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="#doctors" className="btn-primary flex items-center gap-2 text-sm">
                Find a Doctor <ArrowRight size={16} />
              </a>
              <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#E8DDD3] text-sm font-bold text-[#2B1E16] hover:border-[#7A2E1A] hover:text-[#7A2E1A] transition-all">
                Create Account
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <svg viewBox="0 0 400 420" className="w-80 h-auto" fill="none">
              <ellipse cx="200" cy="210" rx="150" ry="160" fill="#7A2E1A" opacity="0.04" />
              <path d="M200 95 C178 68 145 78 135 108 C125 138 155 178 200 218 C245 178 275 138 265 108 C255 78 222 68 200 95Z" stroke="#7A2E1A" strokeWidth="2" fill="#7A2E1A" fillOpacity="0.06" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M200 120 C188 103 170 110 165 130 C160 150 178 175 200 195 C222 175 240 150 235 130 C230 110 212 103 200 120Z" stroke="#7A2E1A" strokeWidth="1.5" fill="#7A2E1A" fillOpacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M200 138 C195 130 185 133 183 143 C181 153 192 168 200 178 C208 168 219 153 217 143 C215 133 205 130 200 138Z" stroke="#7A2E1A" strokeWidth="1" fill="#7A2E1A" fillOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M130 200 C118 190 112 178 118 168 C124 158 135 165 132 175" stroke="#C9953C" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
              <path d="M270 200 C282 190 288 178 282 168 C276 158 265 165 268 175" stroke="#C9953C" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
              <path d="M105 240 C92 225 88 210 96 200 C104 190 116 200 113 213" stroke="#C9953C" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="2 3" />
              <path d="M295 240 C308 225 312 210 304 200 C296 190 284 200 287 213" stroke="#C9953C" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="2 3" />
              <path d="M155 320 C140 340 130 365 128 385 C126 400 135 410 148 405 C158 400 155 385 145 375 C135 365 132 340 145 325" stroke="#2D6A4F" strokeWidth="1.5" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.6" />
              <path d="M245 320 C260 340 270 365 272 385 C274 400 265 410 252 405 C242 400 245 385 255 375 C265 365 268 340 255 325" stroke="#2D6A4F" strokeWidth="1" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.4" strokeDasharray="3 4" />
              <circle cx="135" cy="155" r="2.5" fill="#C9953C" opacity="0.3" />
              <circle cx="265" cy="155" r="2" fill="#C9953C" opacity="0.25" />
              <circle cx="108" cy="290" r="1.8" fill="#7A2E1A" opacity="0.15" />
              <circle cx="292" cy="290" r="1.5" fill="#7A2E1A" opacity="0.12" />
              <path d="M160 100 L163 108 L171 110 L163 112 L160 120 L157 112 L149 110 L157 108Z" fill="#C9953C" opacity="0.3" />
              <path d="M240 98 L242 104 L248 105 L242 106 L240 112 L238 106 L232 105 L238 104Z" fill="#C9953C" opacity="0.25" />
            </svg>
          </div>
        </div>
      </section>

      <section id="benefits" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why choose HealthConnect?</h2>
          <p className="text-[#9E8E82] text-sm mt-3">Experience healthcare designed around your needs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-[#E8DDD3] card-hover text-center">
              <div className="w-12 h-12 bg-[#7A2E1A]/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <b.icon size={24} className="text-[#7A2E1A]" />
              </div>
              <h3 className="font-extrabold text-sm text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.title}</h3>
              <p className="text-[10px] text-[#9E8E82] font-medium mt-2 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="doctors" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Browse our doctors</h2>
            <p className="text-[#9E8E82] text-sm mt-1">No account needed — explore freely</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8E82]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or specialty..." className="input-field pl-10 py-3 text-sm" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7A2E1A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-[#E8DDD3] p-5 card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7A2E1A] to-[#4F1B0D] rounded-xl flex items-center justify-center text-white text-lg font-extrabold">
                    {doc.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#2B1E16] truncate">{doc.name}</p>
                    <p className="text-[10px] text-[#9E8E82] font-medium">{doc.specialization || 'General Practitioner'}</p>
                  </div>
                </div>
                {doc.hospital && (
                  <p className="text-[10px] text-[#8B7D72] mt-3 flex items-center gap-1">
                    <MapPin size={11} />{doc.hospital}
                  </p>
                )}
                <button onClick={() => handleBook(doc.id)}
                  className="mt-4 w-full py-2.5 rounded-xl border-2 border-[#E8DDD3] text-xs font-bold text-[#7A2E1A] hover:border-[#7A2E1A] hover:bg-[#7A2E1A]/5 transition-all">
                  {token ? 'Book Appointment' : 'Sign In to Book'}
                </button>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <p className="col-span-full text-center py-16 text-[#9E8E82] font-medium">No doctors found</p>
            )}
          </div>
        )}
      </section>

      <footer className="bg-[#1A0F0A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#C9953C]" />
            <span className="font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</span>
          </div>
          <p className="text-[#9E8E82] text-xs font-medium">Healing meets the human spirit.</p>
        </div>
      </footer>
    </div>
  );
}
