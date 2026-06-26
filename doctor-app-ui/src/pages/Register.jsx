import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const NewDawn = () => (
  <svg viewBox="0 0 400 480" className="w-64 h-auto" fill="none">
    <ellipse cx="200" cy="240" rx="150" ry="160" fill="#C9953C" opacity="0.04" />
    <circle cx="200" cy="120" r="40" stroke="#C9953C" strokeWidth="1.5" opacity="0.3" fill="none" strokeDasharray="4 6" />
    <circle cx="200" cy="120" r="18" fill="#C9953C" fillOpacity="0.12" />
    <circle cx="200" cy="120" r="8" fill="#C9953C" fillOpacity="0.2" />
    <path d="M160 130 C145 125 130 135 135 145 C140 150 150 145 155 140" stroke="#C9953C" strokeWidth="1.2" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M240 130 C255 125 270 135 265 145 C260 150 250 145 245 140" stroke="#C9953C" strokeWidth="1.2" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M170 100 C165 85 175 75 185 80" stroke="#C9953C" strokeWidth="1.2" opacity="0.3" fill="none" strokeLinecap="round" />
    <path d="M230 100 C235 85 225 75 215 80" stroke="#C9953C" strokeWidth="1.2" opacity="0.3" fill="none" strokeLinecap="round" />
    <path d="M200 158 C198 170 195 178 190 190 C185 202 178 215 170 230 C162 245 155 255 148 268" stroke="#C9953C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M180 195 C172 190 160 195 158 205 C156 215 165 220 175 215" stroke="#2D6A4F" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
    <path d="M175 210 C165 220 168 235 178 232 C185 230 182 218 175 210Z" fill="#2D6A4F" fillOpacity="0.15" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M185 228 C178 238 182 250 190 248 C196 246 192 236 185 228Z" fill="#2D6A4F" fillOpacity="0.15" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M100 400 C140 380 180 390 220 400 C260 410 300 395 340 380" stroke="#C9953C" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M80 420 C130 400 190 415 250 420 C310 425 350 410 380 400" stroke="#C9953C" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
    <path d="M60 340 C90 325 110 330 140 345" stroke="#C9953C" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
    <path d="M340 340 C310 325 290 330 260 345" stroke="#C9953C" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
    <circle cx="120" cy="300" r="2" fill="#C9953C" opacity="0.3" />
    <circle cx="290" cy="310" r="2.5" fill="#C9953C" opacity="0.25" />
    <circle cx="90" cy="360" r="1.5" fill="#C9953C" opacity="0.3" />
    <circle cx="320" cy="350" r="2" fill="#C9953C" opacity="0.25" />
    <circle cx="145" cy="270" r="1.5" fill="#C9953C" opacity="0.35" />
    <circle cx="265" cy="280" r="2" fill="#C9953C" opacity="0.3" />
    <path d="M225 190 C245 200 255 185 245 177 C235 172 228 180 225 190Z" fill="#2D6A4F" fillOpacity="0.12" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M240 210 C258 218 265 205 257 198 C250 193 243 200 240 210Z" fill="#2D6A4F" fillOpacity="0.12" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M210 170 C220 162 232 168 228 176 C224 182 215 178 210 170Z" fill="#C9953C" fillOpacity="0.12" stroke="#C9953C" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <div className="w-14 h-14 bg-[#7A2E1A]/10 rounded-2xl flex items-center justify-center mb-6">
              <Heart size={28} className="text-[#7A2E1A]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#2B1E16] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create account</h2>
            <p className="text-[#9E8E82] font-medium mt-2 text-sm">Begin your health journey today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="input-field" />
            </div>
            <input type="hidden" name="role" value="PATIENT" />
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#9E8E82] font-medium">
            Already have an account? <Link to="/login" className="text-[#7A2E1A] font-bold hover:text-[#4F1B0D] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A0F0A] via-[#1A0F0A] to-[#2D1B10] items-center justify-center relative overflow-hidden flex-col gap-8">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, #C9953C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D6A4F]/5 to-transparent pointer-events-none" />
        <div className="z-10">
          <NewDawn />
        </div>
        <div className="text-center z-10 px-16">
          <h3 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Healing Journey Starts Here</h3>
          <p className="text-[#E8D5A3]/60 leading-relaxed text-sm">Every step forward is a victory. We're with you on the path to recovery and wellness.</p>
        </div>
      </div>
    </div>
  );
}
