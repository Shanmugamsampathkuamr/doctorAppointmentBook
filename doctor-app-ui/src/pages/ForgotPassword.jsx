import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password-otp', { email });
      setSent(true);
      toast.success('OTP sent to your email');
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-md animate-scale-in shadow-2xl">
        <div className="w-14 h-14 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center mb-6">
          <Mail size={28} className="text-[#2563EB]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0A1628] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Forgot password?</h2>
        <p className="text-[#94A3B8] font-medium mt-1 text-sm mb-8">Enter your email and we'll send you a reset OTP.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" disabled={sent} />
          </div>
          <button type="submit" disabled={loading || sent} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : sent ? 'OTP Sent!' : 'Send OTP'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        <Link to="/login" className="flex items-center gap-2 text-sm text-[#94A3B8] font-medium mt-8 hover:text-[#2563EB] transition-colors">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
