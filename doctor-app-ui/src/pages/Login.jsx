import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A0F0A] via-[#2D1B10] to-[#3D2215] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #C9953C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7A2E1A]/10 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#C9953C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#2D6A4F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="text-center z-10 px-16">
          <div className="w-24 h-24 mx-auto mb-8 relative animate-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9953C]/20 to-[#7A2E1A]/20 rounded-[2rem] blur-xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-[#7A2E1A] to-[#4F1B0D] rounded-[2rem] flex items-center justify-center border border-[#C9953C]/20">
              <Heart size={44} className="text-[#C9953C]" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</h1>
          <p className="text-[#E8D5A3]/70 text-lg font-medium leading-relaxed max-w-md mx-auto">Where healing meets the human spirit. Every heartbeat matters, every recovery is a victory.</p>
          <div className="mt-10 flex justify-center gap-3">
            {['Healing', 'Care', 'Compassion'].map((tag) => (
              <span key={tag} className="px-5 py-2 bg-white/5 rounded-full text-[#C9953C]/50 text-xs font-semibold tracking-wider uppercase border border-[#C9953C]/10">{tag}</span>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} size={14} className="text-[#C9953C]/30 animate-float" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
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
