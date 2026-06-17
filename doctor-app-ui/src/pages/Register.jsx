import React, { useState } from 'react';
import { Activity, UserPlus, Mail, Lock, User } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  // Role is now fixed to PATIENT for public registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint updated to include /api prefix to match your SecurityConfig
      await api.post('/auth/register', formData);
      toast.success("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-xl shadow-blue-200">
            <Activity className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">HealthConnect</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Patient Registration Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text" placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="email" placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="password" placeholder="Create Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95">
            <UserPlus size={20} /> Register as Patient
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center mt-8 text-slate-400 font-bold hover:text-blue-600 transition text-sm"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;