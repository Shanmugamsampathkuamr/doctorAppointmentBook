import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowRight, User, Shield, Stethoscope } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, role });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: 'PATIENT', label: 'Patient', icon: User, desc: 'Book appointments & manage health' },
    { key: 'DOCTOR', label: 'Doctor', icon: Stethoscope, desc: 'Manage practice & patients' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <div className="w-14 h-14 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center mb-6">
              <Activity size={28} className="text-[#2563EB]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0A1628] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create account</h2>
            <p className="text-[#94A3B8] font-medium mt-2 text-sm">Join HealthConnect today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const selected = role === r.key;
                  return (
                    <button type="button" key={r.key} onClick={() => setRole(r.key)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-[#2563EB] bg-[#2563EB]/5' : 'border-[#E2E8F0] hover:border-[#94A3B8]'}`}>
                      <Icon size={20} className={selected ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
                      <p className={`text-sm font-bold mt-1 ${selected ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>{r.label}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#94A3B8] font-medium">
            Already have an account? <Link to="/login" className="text-[#2563EB] font-bold hover:text-[#1D4ED8]">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0A1628] via-[#1A2D4A] to-[#0F2027] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="text-center z-10 px-16">
          <Shield size={64} className="text-emerald-400 mx-auto mb-6" />
          <h3 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Secure & Confidential</h3>
          <p className="text-blue-200/60">Your health data is encrypted and protected with enterprise-grade security.</p>
        </div>
      </div>
    </div>
  );
}
