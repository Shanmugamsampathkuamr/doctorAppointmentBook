import React, { useState } from 'react';
import { KeyRound, Mail, ArrowLeft, ShieldCheck, Send } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Controls which form shows
  const [loading, setLoading] = useState(false);

  // STEP 1: Request OTP from Backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password-otp', { email });
      toast.success("OTP sent! Check your backend console.");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Matches your new ResetPasswordRequest DTO
      await api.put('/auth/reset-password', { email, otp, newPassword });
      toast.success("Password updated successfully!");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or Expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
       {/* Background Decoration */}
       <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-bold text-sm transition-all"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="mb-10 text-center">
          <div className="bg-blue-600 p-4 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-100">
            {otpSent ? <ShieldCheck size={32} /> : <KeyRound size={32} />}
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">
            {otpSent ? "Verify Identity" : "Reset Password"}
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
            {otpSent ? "Enter the 6-digit code from console" : "We'll send a code to your email"}
          </p>
        </div>

        {!otpSent ? (
          /* PHASE 1: EMAIL REQUEST */
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email" placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : <><Send size={18}/> Get Reset Code</>}
            </button>
          </form>
        ) : (
          /* PHASE 2: OTP + NEW PASSWORD */
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text" placeholder="6-Digit OTP"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password" placeholder="New Strong Password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition-all"
            >
              {loading ? "Verifying..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-tighter hover:text-blue-600 mt-2"
            >
              Entered wrong email? Go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;