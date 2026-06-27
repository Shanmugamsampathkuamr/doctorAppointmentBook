import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm animate-scale-in shadow-lg border border-[#E4E4E7]">
        <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-5">
          <Lock size={24} className="text-[#4F46E5]" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reset password</h2>
        <p className="text-[#A1A1AA] text-sm mt-1 mb-6">Enter the OTP sent to <strong className="text-[#18181B]">{email || 'your email'}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-[#52525B] mb-1.5 block">OTP Code</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="input-field" maxLength={6} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#52525B] mb-1.5 block">New password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="input-field pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
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
