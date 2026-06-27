import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm animate-scale-in shadow-lg border border-[#E4E4E7]">
        <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-5">
          <Mail size={24} className="text-[#4F46E5]" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Forgot password?</h2>
        <p className="text-[#A1A1AA] text-sm mt-1 mb-6">Enter your email and we'll send you a reset OTP.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" disabled={sent} />
          </div>
          <button type="submit" disabled={loading || sent} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : sent ? 'OTP Sent!' : 'Send OTP'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        <Link to="/login" className="flex items-center gap-1.5 text-sm text-[#A1A1AA] font-medium mt-6 hover:text-[#4F46E5] transition-colors">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
