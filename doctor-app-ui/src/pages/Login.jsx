import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'DOCTOR') navigate('/doctor-home');
      else if (data.role === 'ADMIN') navigate('/admin-home');
      else navigate('/patient-home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0A1628] via-[#1A2D4A] to-[#0F2027] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="text-center z-10 px-16">
          <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-blue-400/20">
            <Activity size={40} className="text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</h1>
          <p className="text-blue-200/60 text-lg font-medium">Your complete healthcare management platform. Book appointments, consult doctors, and manage your health journey.</p>
          <div className="mt-12 flex justify-center gap-4">
            {['Secure', 'Fast', 'Reliable'].map((tag) => (
              <span key={tag} className="px-5 py-2 bg-white/5 rounded-full text-white/50 text-xs font-semibold tracking-wider uppercase border border-white/10">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white lg:rounded-l-[3rem] p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#0A1628] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome back</h2>
            <p className="text-[#94A3B8] font-medium mt-2 text-sm">Sign in to access your healthcare portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#94A3B8] font-medium">
            Don't have an account? <Link to="/register" className="text-[#2563EB] font-bold hover:text-[#1D4ED8]">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
