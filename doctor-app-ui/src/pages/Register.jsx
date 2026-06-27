import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create account</h2>
            <p className="text-[#A1A1AA] text-sm mt-1.5">Start your health journey today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="input-field" />
            </div>
            <input type="hidden" name="role" value="PATIENT" />
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#A1A1AA]">
            Already have an account? <Link to="/login" className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#06B6D4] to-[#4F46E5] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="text-center z-10 px-12 max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <span className="text-white text-2xl font-black">H</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your health journey starts here</h3>
          <p className="text-white/60 text-sm leading-relaxed">Join thousands of patients who trust HealthConnect for their healthcare needs. Premium care at your fingertips.</p>
        </div>
      </div>
    </div>
  );
}
