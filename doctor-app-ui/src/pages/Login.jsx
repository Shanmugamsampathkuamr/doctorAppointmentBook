import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="text-center z-10 px-12 max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <span className="text-white text-2xl font-black">H</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</h1>
          <p className="text-white/60 text-sm leading-relaxed">Your complete healthcare platform. Book appointments with top specialists, manage your health journey, and stay connected with your care team.</p>
          <div className="flex justify-center gap-3 mt-10">
            {['Secure', 'Fast', 'Reliable'].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-white/5 rounded-full text-white/50 text-[11px] font-semibold tracking-wide border border-white/10">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome back</h2>
            <p className="text-[#A1A1AA] text-sm mt-1.5">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#52525B]">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#A1A1AA]">
            Don't have an account? <Link to="/register" className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
