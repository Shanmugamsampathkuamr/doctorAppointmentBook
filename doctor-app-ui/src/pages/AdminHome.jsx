import { useState, useEffect } from 'react';
import { Users, Shield, RefreshCcw, Activity, UserX, UserCheck, Clock, AlertTriangle, Plus, X, Stethoscope } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [showCreate, setShowCreate] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '' });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, sagaRes] = await Promise.all([
        api.get('/users?page=0&size=100'),
        api.get('/sagas'),
      ]);
      setUsers(userRes.data.data?.content || userRes.data.data || []);
      setSagas(sagaRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchData(); }
    catch { toast.error('Failed to delete user'); }
  };

  const createDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.email || !newDoctor.password) { toast.error('Fill all fields'); return; }
    setCreateLoading(true);
    try {
      await api.post('/users', { ...newDoctor, role: 'DOCTOR' });
      toast.success('Doctor account created');
      setShowCreate(false);
      setNewDoctor({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create doctor');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSagaAction = async (id, action) => {
    try {
      if (action === 'retry') await api.post(`/sagas/${id}/retry`);
      else await api.post(`/sagas/${id}/cancel`);
      toast.success(`Saga ${action}ed`);
      fetchData();
    } catch { toast.error(`Failed to ${action} saga`); }
  };

  const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
  const stuckSagas = sagas.filter(s => s.status === 'PENDING' || s.status === 'COMPENSATING').length;

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6 rounded-2xl text-white">
          <Users size={28} className="text-blue-200 mb-3" />
          <p className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{users.length}</p>
          <p className="text-sm text-blue-200 font-semibold mt-1">Total Users</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <UserCheck size={28} className="text-[#059669] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{roleCounts['PATIENT'] || 0}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Patients</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <Activity size={28} className="text-[#F59E0B] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{roleCounts['DOCTOR'] || 0}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Doctors</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] card-hover">
          <AlertTriangle size={28} className="text-[#DC2626] mb-3" />
          <p className="text-3xl font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stuckSagas}</p>
          <p className="text-sm text-[#94A3B8] font-semibold mt-1">Active Sagas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center border-b border-[#E2E8F0]">
          <button onClick={() => setTab('users')} className={`px-8 py-4 text-sm font-bold transition-all ${tab === 'users' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}>
            <Users size={16} className="inline mr-2" />Users
          </button>
          <button onClick={() => setTab('sagas')} className={`px-8 py-4 text-sm font-bold transition-all ${tab === 'sagas' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}>
            <Activity size={16} className="inline mr-2" />Sagas
          </button>
          <div className="flex-1" />
          {tab === 'users' && (
            <button onClick={() => setShowCreate(true)}
              className="mr-2 flex items-center gap-2 px-4 py-2 bg-[#059669] text-white rounded-xl text-xs font-bold hover:bg-[#047857] transition-all">
              <Plus size={14} /> Add Doctor
            </button>
          )}
          <button onClick={fetchData} disabled={loading}
            className="mr-4 flex items-center gap-2 px-4 py-2 bg-[#F0F4F8] rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <th className="text-left px-6 py-4">Name</th>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-center px-6 py-4">Role</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#F0F4F8] hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center text-[#2563EB] text-xs font-extrabold">{u.name?.charAt(0)}</div>
                        <span className="font-bold text-sm text-[#1E293B]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">{u.email}</td>
                    <td className="px-6 py-4 text-center"><span className={`status-badge ${u.role === 'DOCTOR' ? 'completed' : u.role === 'ADMIN' ? 'booked' : 'pending'}`}>{u.role}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(u.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <UserX size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'sagas' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <th className="text-left px-6 py-4">ID</th>
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-center px-6 py-4">Status</th>
                  <th className="text-center px-6 py-4">Step</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sagas.map((s) => (
                  <tr key={s.id} className="border-b border-[#F0F4F8] hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 text-sm font-bold text-[#1E293B]">#{s.id}</td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">{s.sagaType}</td>
                    <td className="px-6 py-4 text-center"><span className="status-badge pending">{s.status}</span></td>
                    <td className="px-6 py-4 text-center text-sm text-[#64748B]">{s.currentStep || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      {s.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleSagaAction(s.id, 'retry')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 border border-emerald-100">Retry</button>
                          <button onClick={() => handleSagaAction(s.id, 'cancel')} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-100">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {sagas.length === 0 && <tr><td colSpan="5" className="py-16 text-center text-[#94A3B8] font-medium">No sagas</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-extrabold text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Doctor</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#94A3B8] hover:text-[#64748B] p-1"><X size={20} /></button>
            </div>
            <form onSubmit={createDoctor} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Full name</label>
                <input type="text" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="Dr. Name" className="input-field py-3 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} placeholder="doctor@example.com" className="input-field py-3 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Password</label>
                <input type="password" value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} placeholder="Temporary password" className="input-field py-3 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-[#F0F4F8] rounded-xl text-sm font-bold text-[#64748B] hover:bg-[#E2E8F0] transition-all">Cancel</button>
                <button type="submit" disabled={createLoading} className="flex-1 btn-primary text-sm py-3 flex items-center justify-center gap-2">
                  {createLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
