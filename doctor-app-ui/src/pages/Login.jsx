import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BodyHeart = () => (
  <svg viewBox="0 0 400 520" className="w-80 h-auto" fill="none">
    <path d="M185 58 C188 70 192 78 198 82 C204 78 208 70 212 58" stroke="#7A2E1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
    <path d="M185 58 C155 62 128 78 112 100 C100 116 94 134 92 152" stroke="#7A2E1A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.35" />
    <path d="M212 58 C242 62 268 78 285 100 C297 116 303 134 305 152" stroke="#7A2E1A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.35" />
    <path d="M92 152 C88 170 86 190 92 210 C98 230 110 248 130 265" stroke="#7A2E1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />
    <path d="M305 152 C308 170 310 190 305 210 C300 230 288 248 268 265" stroke="#7A2E1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />
    <path d="M130 265 C155 285 180 295 200 298 C220 295 245 285 268 265" stroke="#7A2E1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />

    <path d="M198 82 C196 90 194 100 196 110 C198 118 202 125 200 132" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.25" strokeDasharray="2 3" />
    <path d="M202 82 C204 90 206 100 204 110 C202 118 198 125 200 132" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.25" strokeDasharray="2 3" />

    <path d="M200 145 C178 118 148 128 138 158 C128 188 155 228 200 268 C245 228 272 188 262 158 C252 128 222 118 200 145Z" stroke="#7A2E1A" strokeWidth="2" fill="#7A2E1A" fillOpacity="0.06" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 165 C188 148 170 155 165 175 C160 195 178 220 200 242 C222 220 240 195 235 175 C230 155 212 148 200 165Z" stroke="#7A2E1A" strokeWidth="1.5" fill="#7A2E1A" fillOpacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 180 C195 172 185 175 183 185 C181 195 192 210 200 220 C208 210 219 195 217 185 C215 175 205 172 200 180Z" stroke="#7A2E1A" strokeWidth="1.2" fill="#7A2E1A" fillOpacity="0.18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 190 C198 186 194 187 193 192 C192 197 197 205 200 209 C203 205 208 197 207 192 C206 187 202 186 200 190Z" fill="#7A2E1A" fillOpacity="0.35" />

    <path d="M130 180 C118 170 112 158 118 148 C124 138 135 145 132 155" stroke="#C9953C" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
    <path d="M268 180 C280 170 286 158 280 148 C274 138 263 145 266 155" stroke="#C9953C" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />

    <path d="M108 215 C95 200 90 185 98 175 C106 165 118 175 115 188" stroke="#C9953C" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="2 3" />
    <path d="M290 215 C303 200 308 185 300 175 C292 165 280 175 283 188" stroke="#C9953C" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="2 3" />

    <path d="M200 300 C198 320 192 340 185 360 C178 380 170 395 162 410" stroke="#7A2E1A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.2" />
    <path d="M200 300 C202 320 208 340 215 360 C222 380 230 395 238 410" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.12" strokeDasharray="3 4" />

    <path d="M145 340 C130 355 120 375 118 390 C116 405 125 415 140 410 C152 406 150 390 140 380 C130 370 125 355 135 345" stroke="#2D6A4F" strokeWidth="1.5" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.7" />
    <path d="M255 340 C270 355 280 375 282 390 C284 405 275 415 260 410 C248 406 250 390 260 380 C270 370 275 355 265 345" stroke="#2D6A4F" strokeWidth="1" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.5" strokeDasharray="3 4" />

    <path d="M162 410 C168 425 175 435 185 445" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.15" strokeDasharray="2 3" />
    <path d="M238 410 C232 425 225 435 215 445" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.15" strokeDasharray="2 3" />

    <circle cx="112" cy="140" r="2.5" fill="#C9953C" opacity="0.35" />
    <circle cx="286" cy="140" r="2" fill="#C9953C" opacity="0.3" />
    <circle cx="100" cy="195" r="1.8" fill="#7A2E1A" opacity="0.2" />
    <circle cx="298" cy="195" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="155" cy="105" r="2" fill="#C9953C" opacity="0.25" />
    <circle cx="242" cy="105" r="1.5" fill="#C9953C" opacity="0.2" />
    <circle cx="145" cy="300" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="255" cy="300" r="1.8" fill="#7A2E1A" opacity="0.12" />

    <path d="M155 95 L158 103 L166 105 L158 107 L155 115 L152 107 L144 105 L152 103Z" fill="#C9953C" opacity="0.3" />
    <path d="M242 92 L244 98 L250 99 L244 100 L242 106 L240 100 L234 99 L240 98Z" fill="#C9953C" opacity="0.25" />
    <path d="M200 80 L202 84 L206 85 L202 86 L200 90 L198 86 L194 85 L198 84Z" fill="#C9953C" opacity="0.2" />
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
      <div className="hidden lg:flex w-1/2 items-center justify-center flex-col gap-10">
        <BodyHeart />
        <div className="text-center px-16">
          <h1 className="text-4xl font-extrabold text-[#2B1E16] mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</h1>
          <p className="text-[#9E8E82] text-sm font-medium leading-relaxed max-w-sm mx-auto">Where healing meets the human spirit. Every heartbeat matters, every recovery is a victory.</p>
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
