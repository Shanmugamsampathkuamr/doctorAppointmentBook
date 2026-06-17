import React, { useState, useEffect } from 'react';
import { Users, UserCheck, ShieldAlert, LogOut, Activity, Trash2, Search, UserPlus, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [docData, setDocData] = useState({
    name: '', email: '', password: '', specialization: '', experience: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');

      // DEBUG: Check your browser console (F12) to see this output!
      console.log("Backend Response:", res.data);

      /**
       * FIX: Handle different response shapes
       * 1. res.data.data (if wrapped in an ApiResponse object)
       * 2. res.data (if the backend returns a direct List/Array)
       */
      const userData = res.data.data || res.data || [];
      setUsers(Array.isArray(userData) ? userData : []);

    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Could not load user database");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: docData.name,
      email: docData.email.trim().toLowerCase(),
      password: docData.password,
      specialization: docData.specialization,
      experience: docData.experience === '' ? 0 : Number(docData.experience)
    };

    try {
      await api.post('/doctors', payload);
      toast.success(`Dr. ${docData.name} onboarded!`);
      setDocData({ name: '', email: '', password: '', specialization: '', experience: '' });
      fetchUsers();
    } catch (err) {
      console.log("Onboarding Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Onboarding failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure? This will remove the user from the system.")) {
      try {
        await api.delete(`/users/${id}`);
        toast.success("User removed");
        fetchUsers();
      } catch (err) {
        toast.error("Delete failed: Admin authorization required");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("System Locked");
    navigate('/login');
  };

  // Helper to normalize roles (handles 'DOCTOR' vs 'ROLE_DOCTOR')
  const getRole = (roleStr) => {
    if (!roleStr) return 'USER';
    return roleStr.replace('ROLE_', '').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 p-8 border-r border-slate-800 flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 text-emerald-400 font-black text-2xl mb-12 italic tracking-tighter">
          <ShieldAlert size={32} strokeWidth={2.5} />
          <span>ADMIN CTRL</span>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">System Core</div>
          <button className="w-full flex items-center gap-4 p-4 bg-slate-800 rounded-2xl text-emerald-400 font-bold shadow-lg shadow-emerald-900/10 transition text-left border border-transparent hover:border-emerald-500/20">
            <Users size={20} /> User Records
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition font-black mt-auto border-t border-slate-800 pt-8 group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">System Overview</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Pune Engine Status: Active</p>
          </div>
          <div className="flex bg-slate-900 p-3 rounded-2xl border border-slate-800 w-[400px] shadow-inner focus-within:border-emerald-500/50 transition-colors">
            <Search className="text-slate-600 m-2" />
            <input
              type="text"
              placeholder="Search by identity..."
              className="bg-transparent outline-none w-full font-bold text-slate-300 placeholder:text-slate-700"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </header>

        {/* ONBOARDING FORM */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 mb-12 shadow-xl hover:border-emerald-500/20 transition-all">
          <div className="flex items-center gap-4 mb-8">
             <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400">
                <UserPlus size={24} />
             </div>
             <h3 className="text-2xl font-black italic">Onboard Medical Staff</h3>
          </div>

          <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Full Name</label>
               <input
                 type="text" placeholder="Dr. John Doe"
                 className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500/50 font-bold transition-all text-slate-200"
                 value={docData.name} onChange={(e) => setDocData({...docData, name: e.target.value})} required
               />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Email Address</label>
               <input
                 type="email" placeholder="doc@hospital.com"
                 className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500/50 font-bold transition-all text-slate-200"
                 value={docData.email} onChange={(e) => setDocData({...docData, email: e.target.value})} required
               />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Initial Password</label>
               <input
                 type="password" placeholder="••••••••"
                 className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500/50 font-bold transition-all text-slate-200"
                 value={docData.password} onChange={(e) => setDocData({...docData, password: e.target.value})} required
               />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Specialization</label>
               <input
                 type="text" placeholder="Cardiology"
                 className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500/50 font-bold transition-all text-slate-200"
                 value={docData.specialization} onChange={(e) => setDocData({...docData, specialization: e.target.value})} required
               />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Experience (Years)</label>
               <input
                 type="number" placeholder="5"
                 className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500/50 font-bold transition-all text-slate-200"
                 value={docData.experience} onChange={(e) => setDocData({...docData, experience: e.target.value})} required
               />
            </div>
            <div className="flex items-end">
               <button
                 disabled={isSubmitting}
                 className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 h-[58px] shadow-lg shadow-emerald-500/20"
               >
                 {isSubmitting ? "Syncing..." : "Add Doctor"}
               </button>
            </div>
          </form>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg group hover:border-emerald-500/30 transition-all">
            <Activity className="text-emerald-400 mb-4 group-hover:animate-pulse" />
            <div className="text-5xl font-black italic">{users.length}</div>
            <div className="text-slate-600 font-black text-[10px] uppercase tracking-widest mt-2">System Users</div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg group hover:border-blue-500/30 transition-all">
            <UserCheck className="text-blue-400 mb-4" />
            <div className="text-5xl font-black italic text-blue-400">
              {users.filter(u => getRole(u.role) === 'DOCTOR').length}
            </div>
            <div className="text-slate-600 font-black text-[10px] uppercase tracking-widest mt-2">Doctors</div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg group hover:border-indigo-500/30 transition-all">
             <ShieldAlert className="text-indigo-400 mb-4" />
             <div className="text-5xl font-black italic text-indigo-400">
               {users.filter(u => getRole(u.role) === 'ADMIN').length}
             </div>
             <div className="text-slate-600 font-black text-[10px] uppercase tracking-widest mt-2">Admins</div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-black italic tracking-tighter">Live Database</h2>
            <button onClick={fetchUsers} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-500 hover:text-emerald-400">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950/50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6 text-center">Authorization</th>
                  <th className="px-10 py-6">Secure Email</th>
                  <th className="px-10 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users
                  .filter(u => u.name?.toLowerCase().includes(searchTerm))
                  .map(user => (
                    <tr key={user.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                      <td className="px-10 py-6">
                          <div className="font-black text-slate-200 text-lg">{user.name}</div>
                          <div className="text-[10px] font-bold text-slate-600 uppercase">UID: {user.id}</div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          getRole(user.role) === 'DOCTOR' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                          getRole(user.role) === 'ADMIN' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900/50' :
                          'bg-emerald-900/20 text-emerald-400 border-emerald-900/50'
                        }`}>
                          {getRole(user.role)}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-slate-500 font-bold italic">{user.email}</td>
                      <td className="px-10 py-6 text-right">
                        {getRole(user.role) !== 'ADMIN' && (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-3 bg-slate-950 text-slate-700 hover:text-red-500 border border-slate-800 rounded-xl transition-all hover:scale-110 shadow-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;