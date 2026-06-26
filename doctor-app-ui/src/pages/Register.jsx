import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const NewDawn = () => (
  <svg viewBox="0 0 400 500" className="w-80 h-auto" fill="none">
    <circle cx="200" cy="105" r="42" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.2" fill="none" strokeDasharray="3 5" />
    <circle cx="200" cy="105" r="22" stroke="#C9953C" strokeWidth="1" opacity="0.25" fill="none" />
    <circle cx="200" cy="105" r="12" stroke="#7A2E1A" strokeWidth="1.5" fill="#7A2E1A" fillOpacity="0.08" />
    <circle cx="200" cy="105" r="5" fill="#C9953C" fillOpacity="0.3" />

    <path d="M135 115 C120 108 108 120 115 132 C120 140 132 135 138 128" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M265 115 C280 108 292 120 285 132 C280 140 268 135 262 128" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M150 82 C142 70 128 72 132 85 C135 94 145 90 150 84" stroke="#C9953C" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
    <path d="M250 82 C258 70 272 72 268 85 C265 94 255 90 250 84" stroke="#C9953C" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
    <path d="M175 75 C170 60 158 62 162 75 C165 84 173 80 175 75" stroke="#C9953C" strokeWidth="0.8" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M225 75 C230 60 242 62 238 75 C235 84 227 80 225 75" stroke="#C9953C" strokeWidth="0.8" opacity="0.25" fill="none" strokeLinecap="round" />

    <path d="M200 117 C198 132 194 145 188 162 C182 179 174 196 165 215 C156 234 148 250 140 268" stroke="#7A2E1A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M200 117 C202 132 206 145 212 162 C218 179 226 196 235 215 C244 234 252 250 260 268" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.3" fill="none" strokeLinecap="round" strokeDasharray="4 4" />
    <path d="M200 117 C202 127 204 137 206 148" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M168 198 C158 192 145 198 142 210 C139 222 150 228 162 222" stroke="#2D6A4F" strokeWidth="1.8" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" />
    <path d="M160 218 C150 230 155 245 166 242 C174 240 170 228 160 218Z" fill="#2D6A4F" fillOpacity="0.08" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M172 238 C165 252 172 265 182 260 C190 256 184 244 172 238Z" fill="#2D6A4F" fillOpacity="0.08" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M148 178 C140 172 130 178 128 188 C126 198 134 203 143 198" stroke="#2D6A4F" strokeWidth="1.2" opacity="0.6" fill="none" strokeLinecap="round" />

    <path d="M230 198 C240 192 253 198 256 210 C259 222 248 228 236 222" stroke="#2D6A4F" strokeWidth="1.2" opacity="0.4" fill="none" strokeLinecap="round" strokeDasharray="3 4" />
    <path d="M226 215 C218 228 225 242 235 238 C242 234 236 222 226 215Z" fill="#2D6A4F" fillOpacity="0.06" stroke="#2D6A4F" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M200 270 C200 280 198 290 195 300 C192 310 188 318 185 325" stroke="#7A2E1A" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M60 390 C100 370 150 380 200 390 C250 400 300 385 340 370" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.15" fill="none" strokeLinecap="round" />
    <path d="M40 410 C90 390 160 405 240 410 C320 415 360 400 380 390" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.1" fill="none" strokeLinecap="round" />
    <path d="M80 370 C110 360 130 368 155 378" stroke="#C9953C" strokeWidth="0.6" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
    <path d="M320 370 C290 360 270 368 245 378" stroke="#C9953C" strokeWidth="0.6" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M90 340 C110 330 125 340 145 350 C160 358 175 355 185 350" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.12" fill="none" strokeLinecap="round" />
    <path d="M310 340 C290 330 275 340 255 350 C240 358 225 355 215 350" stroke="#7A2E1A" strokeWidth="0.8" opacity="0.12" fill="none" strokeLinecap="round" />

    <circle cx="125" cy="155" r="2" fill="#7A2E1A" opacity="0.2" />
    <circle cx="280" cy="155" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="105" cy="300" r="1.8" fill="#C9953C" opacity="0.25" />
    <circle cx="295" cy="295" r="2" fill="#C9953C" opacity="0.2" />
    <circle cx="80" cy="260" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="320" cy="255" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="150" cy="120" r="1.2" fill="#C9953C" opacity="0.25" />
    <circle cx="250" cy="120" r="1.5" fill="#C9953C" opacity="0.2" />
    <circle cx="115" cy="355" r="1.5" fill="#7A2E1A" opacity="0.12" />
    <circle cx="285" cy="355" r="1.8" fill="#7A2E1A" opacity="0.12" />

    <path d="M170 85 L173 92 L180 94 L173 96 L170 103 L167 96 L160 94 L167 92Z" fill="#C9953C" opacity="0.3" />
    <path d="M230 82 L232 87 L237 88 L232 89 L230 94 L228 89 L223 88 L228 87Z" fill="#C9953C" opacity="0.25" />
    <path d="M200 72 L201 75 L204 76 L201 77 L200 80 L199 77 L196 76 L199 75Z" fill="#C9953C" opacity="0.2" />
    <path d="M118 140 L120 144 L124 145 L120 146 L118 150 L116 146 L112 145 L116 144Z" fill="#C9953C" opacity="0.2" />
    <path d="M282 140 L284 144 L288 145 L284 146 L282 150 L280 146 L276 145 L280 144Z" fill="#C9953C" opacity="0.2" />
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
    <div className="min-h-screen bg-[#FDF6F0] flex">
      <div className="flex-1 flex items-center justify-center bg-white lg:rounded-r-[3rem] p-8">
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
      <div className="hidden lg:flex w-1/2 items-center justify-center flex-col gap-10">
        <NewDawn />
        <div className="text-center px-16">
          <h3 className="text-3xl font-extrabold text-[#2B1E16] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Healing Journey Starts Here</h3>
          <p className="text-[#9E8E82] leading-relaxed text-sm">Every step forward is a victory. We're with you on the path to recovery and wellness.</p>
        </div>
      </div>
    </div>
  );
}
