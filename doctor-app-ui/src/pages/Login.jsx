import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const HealingHeart = () => (
  <svg viewBox="0 0 400 480" className="w-72 h-auto" fill="none">
    <ellipse cx="200" cy="240" rx="160" ry="170" fill="#C9953C" opacity="0.04" />
    <path d="M70 380 C50 290 110 210 170 190 C230 170 280 200 340 230" stroke="#C9953C" strokeWidth="1.2" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M50 310 C30 230 90 160 160 140 C220 120 290 140 350 180" stroke="#C9953C" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
    <path d="M90 420 C70 350 130 270 180 250 C240 230 290 260 340 290" stroke="#C9953C" strokeWidth="1.2" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M200 160 C160 120 110 135 95 175 C80 215 135 280 200 340 C265 280 320 215 305 175 C290 135 240 120 200 160Z" stroke="#C9953C" strokeWidth="2.5" fill="#C9953C" fillOpacity="0.12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 190 C180 170 148 178 140 200 C132 222 165 258 200 285 C235 258 268 222 260 200 C252 178 220 170 200 190Z" fill="#C9953C" fillOpacity="0.25" />
    <path d="M200 215 C190 203 172 208 168 220 C164 232 182 250 200 262 C218 250 236 232 232 220 C228 208 210 203 200 215Z" fill="#C9953C" fillOpacity="0.4" />
    <path d="M115 260 C105 240 108 218 125 220 C137 222 132 240 122 252Z" fill="#C9953C" fillOpacity="0.15" stroke="#C9953C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M285 260 C295 240 292 218 275 220 C263 222 268 240 278 252Z" fill="#C9953C" fillOpacity="0.15" stroke="#C9953C" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="110" cy="130" r="3" fill="#C9953C" opacity="0.4" />
    <circle cx="310" cy="150" r="2.5" fill="#C9953C" opacity="0.3" />
    <circle cx="350" cy="300" r="3" fill="#C9953C" opacity="0.35" />
    <circle cx="60" cy="270" r="2" fill="#C9953C" opacity="0.3" />
    <circle cx="140" cy="90" r="1.5" fill="#C9953C" opacity="0.3" />
    <circle cx="290" cy="100" r="2" fill="#C9953C" opacity="0.35" />
    <circle cx="340" cy="210" r="1.5" fill="#C9953C" opacity="0.25" />
    <circle cx="55" cy="200" r="2.5" fill="#C9953C" opacity="0.3" />
    <path d="M160 95 C165 85 170 80 175 85 L178 95 L170 90Z" fill="#C9953C" opacity="0.4" />
    <path d="M260 85 C263 78 267 75 270 78 L272 85 L266 82Z" fill="#C9953C" opacity="0.35" />
    <path d="M200 70 C202 64 205 62 207 64 L208 70 L204 67Z" fill="#C9953C" opacity="0.3" />
    <path d="M130 350 C120 340 125 325 135 328 C140 330 135 338 130 342Z" fill="#C9953C" fillOpacity="0.15" stroke="#C9953C" strokeWidth="1" strokeLinecap="round" />
    <path d="M270 340 C280 330 275 318 265 320 C260 322 265 330 270 334Z" fill="#C9953C" fillOpacity="0.15" stroke="#C9953C" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, refreshToken, id, name, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      toast.success(`Welcome back, ${name}!`);
      if (role === 'DOCTOR') navigate('/doctor-home');
      else if (role === 'ADMIN') navigate('/admin-home');
      else navigate('/patient-home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A0F0A] via-[#2D1B10] to-[#3D2215] relative overflow-hidden items-center justify-center flex-col gap-8">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #C9953C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7A2E1A]/10 to-transparent pointer-events-none" />
        <div className="z-10">
          <HealingHeart />
        </div>
        <div className="text-center z-10 px-16">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</h1>
          <p className="text-[#E8D5A3]/60 text-sm font-medium leading-relaxed max-w-sm mx-auto">Where healing meets the human spirit. Every heartbeat matters, every recovery is a victory.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white lg:rounded-l-[3rem] p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <div className="w-14 h-14 bg-[#7A2E1A]/10 rounded-2xl flex items-center justify-center mb-6">
              <Heart size={28} className="text-[#7A2E1A]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#2B1E16] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome back</h2>
            <p className="text-[#9E8E82] font-medium mt-2 text-sm">Sign in to continue your healing journey</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E8E82] hover:text-[#8B7D72]">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-[#7A2E1A] hover:text-[#4F1B0D] transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#9E8E82] font-medium">
            Don't have an account? <Link to="/register" className="text-[#7A2E1A] font-bold hover:text-[#4F1B0D] transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
