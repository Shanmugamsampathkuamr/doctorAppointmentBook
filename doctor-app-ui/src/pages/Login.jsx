import React, { useState } from 'react';
import { Activity, LogIn, Lock, Mail } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      const loginPayload = {
        email: formData.email.trim(),
        password: formData.password
      };

      try {
        const res = await api.post('/auth/login', loginPayload);
        const data = res.data.data || res.data;
        const { token, role, id, name } = data;

        if (!token) throw new Error("No token received");

        const userRole = (role || 'PATIENT').toUpperCase().trim();

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name || "User");

        toast.success(`Access Granted: Welcome ${name || 'User'}`);

        // TRAFFIC CONTROLLER
        if (userRole === 'ADMIN') {
          navigate('/admin-home');
        } else if (userRole === 'DOCTOR') {
          navigate('/doctor-home');
        } else {
          // Send patients to the root home page
          navigate('/');
        }

      } catch (err) {
        console.error("Login Error:", err.response?.data || err.message);
        const message = err.response?.data?.message || "Invalid Credentials";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl mb-6 shadow-xl shadow-blue-200">
            <Activity className="text-white" size={36} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tight text-center">HealthConnect</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Secure Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {/* --- NEW FORGOT PASSWORD LINK --- */}
          <div className="text-right px-2">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-all"
            >
              Forgot Password?
            </button>
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
              isLoading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 hover:shadow-blue-200"
            }`}
          >
            {isLoading ? "Validating..." : <><LogIn size={22} /> Sign In</>}
          </button>
        </form>

        <div className="mt-10 text-center flex flex-col gap-2">
            <p className="text-slate-400 font-medium text-sm">Don't have an account?</p>
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 font-black hover:underline text-sm transition-all"
            >
              Create a free account
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;