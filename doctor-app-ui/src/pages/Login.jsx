import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const HealingHeart = () => (
  <svg viewBox="0 0 400 500" className="w-80 h-auto" fill="none">
    <path d="M200 105 C190 85 170 75 155 85 C140 95 138 115 145 130 C152 145 170 160 200 180 C230 160 248 145 255 130 C262 115 260 95 245 85 C230 75 210 85 200 105Z" stroke="#7A2E1A" strokeWidth="1.8" fill="#7A2E1A" fillOpacity="0.06" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 125 C195 115 185 110 178 115 C171 120 170 130 174 138 C178 146 188 155 200 165 C212 155 222 146 226 138 C230 130 229 120 222 115 C215 110 205 115 200 125Z" stroke="#7A2E1A" strokeWidth="1.5" fill="#7A2E1A" fillOpacity="0.12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M200 138 C197 132 192 129 188 132 C184 135 183 140 185 144 C187 148 193 154 200 159 C207 154 213 148 215 144 C217 140 216 135 212 132 C208 129 203 132 200 138Z" fill="#7A2E1A" fillOpacity="0.2" />

    <path d="M85 260 C80 240 82 218 95 210 C108 202 118 220 112 238 C106 256 95 268 85 260Z" stroke="#7A2E1A" strokeWidth="1.2" fill="#7A2E1A" fillOpacity="0.08" strokeLinecap="round" />
    <path d="M315 260 C320 240 318 218 305 210 C292 202 282 220 288 238 C294 256 305 268 315 260Z" stroke="#7A2E1A" strokeWidth="1.2" fill="#7A2E1A" fillOpacity="0.08" strokeLinecap="round" />
    <path d="M92 250 C86 235 88 222 98 218 C108 214 114 228 108 242 C102 256 96 258 92 250Z" stroke="#7A2E1A" strokeWidth="0.8" fill="#7A2E1A" fillOpacity="0.06" strokeLinecap="round" />
    <path d="M308 250 C314 235 312 222 302 218 C292 214 286 228 292 242 C298 256 304 258 308 250Z" stroke="#7A2E1A" strokeWidth="0.8" fill="#7A2E1A" fillOpacity="0.06" strokeLinecap="round" />

    <path d="M60 340 C40 280 80 210 130 190 C160 178 185 182 200 190" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M340 340 C360 280 320 210 270 190 C240 178 215 182 200 190" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M45 370 C25 310 70 230 120 210" stroke="#C9953C" strokeWidth="0.7" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M355 370 C375 310 330 230 280 210" stroke="#C9953C" strokeWidth="0.7" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M55 310 C40 260 75 200 115 185" stroke="#C9953C" strokeWidth="0.5" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="3 4" />
    <path d="M345 310 C360 260 325 200 285 185" stroke="#C9953C" strokeWidth="0.5" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="3 4" />

    <path d="M120 420 C100 380 120 350 150 340 C170 333 190 340 200 350" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M280 420 C300 380 280 350 250 340 C230 333 210 340 200 350" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M140 430 C125 400 135 375 155 365" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M260 430 C275 400 265 375 245 365" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round" />

    <circle cx="135" cy="165" r="2.5" fill="#7A2E1A" opacity="0.25" />
    <circle cx="270" cy="165" r="2" fill="#7A2E1A" opacity="0.2" />
    <circle cx="90" cy="290" r="2" fill="#C9953C" opacity="0.3" />
    <circle cx="310" cy="290" r="2.5" fill="#C9953C" opacity="0.25" />
    <circle cx="75" cy="230" r="1.5" fill="#C9953C" opacity="0.25" />
    <circle cx="325" cy="230" r="1.8" fill="#C9953C" opacity="0.2" />
    <circle cx="155" cy="145" r="1.5" fill="#7A2E1A" opacity="0.2" />
    <circle cx="248" cy="145" r="1.5" fill="#7A2E1A" opacity="0.2" />
    <circle cx="110" cy="380" r="1.8" fill="#7A2E1A" opacity="0.15" />
    <circle cx="290" cy="380" r="2" fill="#7A2E1A" opacity="0.15" />
    <circle cx="50" cy="320" r="1.5" fill="#C9953C" opacity="0.2" />
    <circle cx="350" cy="320" r="1.5" fill="#C9953C" opacity="0.2" />

    <path d="M165 110 L168 118 L176 120 L168 122 L165 130 L162 122 L154 120 L162 118Z" fill="#C9953C" opacity="0.35" />
    <path d="M240 108 L242 114 L248 115 L242 116 L240 122 L238 116 L232 115 L238 114Z" fill="#C9953C" opacity="0.3" />
    <path d="M200 95 L201 99 L205 100 L201 101 L200 105 L199 101 L195 100 L199 99Z" fill="#C9953C" opacity="0.25" />
    <path d="M128 205 L130 210 L135 211 L130 212 L128 217 L126 212 L121 211 L126 210Z" fill="#C9953C" opacity="0.25" />
    <path d="M272 205 L274 210 L279 211 L274 212 L272 217 L270 212 L265 211 L270 210Z" fill="#C9953C" opacity="0.2" />

    <path d="M200 180 C195 195 192 205 195 215 C198 225 205 230 200 235" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
    <path d="M200 180 C205 195 208 205 205 215 C202 225 195 230 200 235" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
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
        <HealingHeart />
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
