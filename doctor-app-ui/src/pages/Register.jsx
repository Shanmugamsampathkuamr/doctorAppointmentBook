import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BodyRising = () => (
  <svg viewBox="0 0 400 520" className="w-80 h-auto" fill="none">
    <circle cx="200" cy="90" r="45" stroke="#7A2E1A" strokeWidth="1.2" opacity="0.18" fill="none" strokeDasharray="3 5" />
    <circle cx="200" cy="90" r="26" stroke="#C9953C" strokeWidth="1" opacity="0.22" fill="none" />
    <circle cx="200" cy="90" r="14" stroke="#7A2E1A" strokeWidth="1.5" fill="#7A2E1A" fillOpacity="0.06" />
    <circle cx="200" cy="90" r="5" fill="#C9953C" fillOpacity="0.3" />

    <path d="M148 100 C132 92 118 104 125 118 C130 128 142 122 148 114" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M252 100 C268 92 282 104 275 118 C270 128 258 122 252 114" stroke="#C9953C" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
    <path d="M162 68 C153 55 138 58 142 72 C145 82 155 77 160 70" stroke="#C9953C" strokeWidth="0.8" opacity="0.28" fill="none" strokeLinecap="round" />
    <path d="M238 68 C247 55 262 58 258 72 C255 82 245 77 240 70" stroke="#C9953C" strokeWidth="0.8" opacity="0.28" fill="none" strokeLinecap="round" />
    <path d="M178 60 C172 44 158 48 162 62 C165 72 175 67 178 60" stroke="#C9953C" strokeWidth="0.6" opacity="0.22" fill="none" strokeLinecap="round" />
    <path d="M222 60 C228 44 242 48 238 62 C235 72 225 67 222 60" stroke="#C9953C" strokeWidth="0.6" opacity="0.22" fill="none" strokeLinecap="round" />

    <path d="M200 104 C197 122 192 140 186 158 C180 176 174 192 166 208 C158 224 150 238 142 250" stroke="#7A2E1A" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
    <path d="M200 104 C203 122 208 140 214 158 C220 176 226 192 234 208 C242 224 250 238 258 250" stroke="#7A2E1A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.25" strokeDasharray="4 5" />

    <path d="M142 250 C148 260 152 268 155 278 C158 288 158 298 155 308" stroke="#7A2E1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35" />
    <path d="M258 250 C252 260 248 268 245 278 C242 288 242 298 245 308" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.18" strokeDasharray="3 4" />

    <path d="M170 185 C158 178 144 186 142 200 C140 214 152 220 165 214" stroke="#2D6A4F" strokeWidth="1.8" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.8" />
    <path d="M162 210 C152 224 158 240 170 236 C178 232 172 218 162 210Z" fill="#2D6A4F" fillOpacity="0.1" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M176 232 C168 248 176 262 188 256 C196 252 188 238 176 232Z" fill="#2D6A4F" fillOpacity="0.1" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M148 162 C138 156 128 164 126 176 C124 188 134 192 144 186" stroke="#2D6A4F" strokeWidth="1.2" opacity="0.55" fill="none" strokeLinecap="round" />

    <path d="M228 185 C240 178 254 186 256 200 C258 214 246 220 233 214" stroke="#2D6A4F" strokeWidth="1.2" opacity="0.35" fill="none" strokeLinecap="round" strokeDasharray="3 4" />
    <path d="M222 208 C214 222 220 236 232 232 C240 228 232 216 222 208Z" fill="#2D6A4F" fillOpacity="0.06" stroke="#2D6A4F" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M155 308 C160 322 162 335 160 350 C158 365 152 378 145 390" stroke="#7A2E1A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.2" />
    <path d="M245 308 C240 322 238 335 240 350 C242 365 248 378 255 390" stroke="#7A2E1A" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.12" strokeDasharray="2 4" />

    <path d="M145 390 C140 405 140 420 148 430 C156 440 168 438 175 428 C180 420 175 408 165 405 C155 402 148 395 148 388" stroke="#2D6A4F" strokeWidth="1.5" fill="#2D6A4F" fillOpacity="0.06" strokeLinecap="round" opacity="0.65" />
    <path d="M255 390 C260 405 260 420 252 430 C244 440 232 438 225 428 C220 420 225 408 235 405 C245 402 252 395 252 388" stroke="#2D6A4F" strokeWidth="0.8" fill="#2D6A4F" fillOpacity="0.04" strokeLinecap="round" opacity="0.4" strokeDasharray="3 4" />

    <path d="M148 430 C155 442 165 452 175 460" stroke="#7A2E1A" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.12" strokeDasharray="2 3" />
    <path d="M252 430 C245 442 235 452 225 460" stroke="#7A2E1A" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.1" strokeDasharray="2 3" />

    <path d="M130 320 C112 310 100 322 108 338 C114 350 126 344 132 334" stroke="#C9953C" strokeWidth="0.8" opacity="0.25" fill="none" strokeLinecap="round" />
    <path d="M270 320 C288 310 300 322 292 338 C286 350 274 344 268 334" stroke="#C9953C" strokeWidth="0.6" opacity="0.2" fill="none" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M105 365 C95 358 88 368 94 380 C98 388 108 384 110 375" stroke="#C9953C" strokeWidth="0.6" opacity="0.18" fill="none" strokeLinecap="round" />
    <path d="M295 365 C305 358 312 368 306 380 C302 388 292 384 290 375" stroke="#C9953C" strokeWidth="0.5" opacity="0.15" fill="none" strokeLinecap="round" strokeDasharray="2 3" />

    <path d="M80 490 C120 472 180 485 240 490 C300 495 340 482 370 470" stroke="#7A2E1A" strokeWidth="1" opacity="0.1" fill="none" strokeLinecap="round" />
    <path d="M60 505 C110 488 190 500 270 505 C330 510 360 498 390 488" stroke="#7A2E1A" strokeWidth="0.6" opacity="0.07" fill="none" strokeLinecap="round" />

    <circle cx="130" cy="140" r="2" fill="#7A2E1A" opacity="0.2" />
    <circle cx="272" cy="140" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="108" cy="285" r="1.8" fill="#C9953C" opacity="0.22" />
    <circle cx="292" cy="280" r="1.5" fill="#C9953C" opacity="0.18" />
    <circle cx="85" cy="245" r="1.5" fill="#7A2E1A" opacity="0.15" />
    <circle cx="315" cy="240" r="1.2" fill="#7A2E1A" opacity="0.12" />
    <circle cx="155" cy="110" r="1.2" fill="#C9953C" opacity="0.22" />
    <circle cx="245" cy="110" r="1.5" fill="#C9953C" opacity="0.18" />
    <circle cx="120" cy="340" r="1.2" fill="#7A2E1A" opacity="0.12" />
    <circle cx="280" cy="340" r="1.5" fill="#7A2E1A" opacity="0.1" />

    <path d="M168 72 L171 80 L179 82 L171 84 L168 92 L165 84 L157 82 L165 80Z" fill="#C9953C" opacity="0.28" />
    <path d="M232 70 L234 76 L240 77 L234 78 L232 84 L230 78 L224 77 L230 76Z" fill="#C9953C" opacity="0.22" />
    <path d="M200 58 L202 62 L206 63 L202 64 L200 68 L198 64 L194 63 L198 62Z" fill="#C9953C" opacity="0.18" />
    <path d="M120 128 L123 133 L128 134 L123 135 L120 140 L117 135 L112 134 L117 133Z" fill="#C9953C" opacity="0.18" />
    <path d="M280 128 L283 133 L288 134 L283 135 L280 140 L277 135 L272 134 L277 133Z" fill="#C9953C" opacity="0.15" />
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
        <BodyRising />
        <div className="text-center px-16">
          <h3 className="text-3xl font-extrabold text-[#2B1E16] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Healing Journey Starts Here</h3>
          <p className="text-[#9E8E82] leading-relaxed text-sm">Every step forward is a victory. We're with you on the path to recovery and wellness.</p>
        </div>
      </div>
    </div>
  );
}
