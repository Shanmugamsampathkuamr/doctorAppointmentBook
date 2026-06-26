import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A0F0A] via-[#2D6A4F]/20 to-[#1A0F0A] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, #2D6A4F 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-32 right-16 w-72 h-72 bg-[#7A2E1A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-[#C9953C]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="text-center z-10 px-16">
          <div className="w-20 h-20 mx-auto mb-8 animate-pulse-glow">
            <div className="w-full h-full bg-gradient-to-br from-[#2D6A4F]/20 to-[#C9953C]/20 rounded-2xl flex items-center justify-center border border-[#C9953C]/20">
              <Sparkles size={36} className="text-[#C9953C]" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Healing Journey Starts Here</h3>
          <p className="text-[#E8D5A3]/60 leading-relaxed">Every step forward is a victory. We're with you on the path to recovery and wellness.</p>
        </div>
      </div>
    </div>
  );
}
