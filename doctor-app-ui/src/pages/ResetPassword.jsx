import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Heart, ArrowRight, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) { toast.error('Fill in all fields'); return; }
    if (newPassword.length < 6) { toast.error('Password too short'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-md animate-scale-in shadow-2xl">
        <div className="w-14 h-14 bg-[#2D6A4F]/10 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={28} className="text-[#2D6A4F]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#2B1E16] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reset password</h2>
        <p className="text-[#9E8E82] font-medium mt-1 text-sm mb-8">Enter the OTP sent to <strong className="text-[#2B1E16]">{email || 'your email'}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">OTP Code</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="input-field" maxLength={6} />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8B7D72] uppercase tracking-wider mb-2 block">New password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="input-field pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E8E82]">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-healing w-full flex items-center justify-center gap-2 text-sm">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        <Link to="/login" className="flex items-center gap-2 text-sm text-[#9E8E82] font-medium mt-8 hover:text-[#7A2E1A] transition-colors">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
