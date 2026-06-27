import { useState, useEffect } from 'react';
import { Users, Shield, RefreshCcw, Heart, UserX, UserCheck, AlertTriangle, Plus, X } from 'lucide-react';
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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, sagaRes] = await Promise.all([
        api.get('/users?page=0&size=100'),
        api.get('/sagas'),
      ]);
      setUsers(userRes.data.data?.content || userRes.data.data || []);
      setSagas(sagaRes.data.data || []);
    } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchData(); } catch { toast.error('Failed to delete user'); }
  };

  const createDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.email || !newDoctor.password) { toast.error('Fill all fields'); return; }
    setCreateLoading(true);
    try {
      await api.post('/users', { ...newDoctor, role: 'DOCTOR' });
      toast.success('Doctor created');
      setShowCreate(false);
      setNewDoctor({ name: '', email: '', password: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setCreateLoading(false); }
  };

  const handleSagaAction = async (id, action) => {
    try {
      if (action === 'retry') await api.post(`/sagas/${id}/retry`);
      else await api.post(`/sagas/${id}/cancel`);
      toast.success(`Saga ${action}ed`);
      fetchData();
    } catch { toast.error(`Failed to ${action}`); }
  };

  const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
  const stuckSagas = sagas.filter(s => s.status === 'PENDING' || s.status === 'COMPENSATING').length;

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] p-5 rounded-xl text-white">
          <Users size={24} className="text-white/70 mb-3" />
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-white/70 font-medium mt-0.5">Total Users</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <UserCheck size={24} className="text-[#10B981] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{roleCounts['PATIENT'] || 0}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Patients</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <Heart size={24} className="text-[#06B6D4] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{roleCounts['DOCTOR'] || 0}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Doctors</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] card-hover">
          <AlertTriangle size={24} className="text-[#EF4444] mb-3" />
          <p className="text-2xl font-bold text-[#18181B]">{stuckSagas}</p>
          <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Active Sagas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E4E4E7]">
        <div className="flex items-center border-b border-[#E4E4E7]">
          <button onClick={() => setTab('users')} className={`px-6 py-3.5 text-sm font-semibold transition-all ${tab === 'users' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-[#A1A1AA] hover:text-[#52525B]'}`}>
            <Users size={16} className="inline mr-1.5" />Users
          </button>
          <button onClick={() => setTab('sagas')} className={`px-6 py-3.5 text-sm font-semibold transition-all ${tab === 'sagas' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-[#A1A1AA] hover:text-[#52525B]'}`}>
            <Heart size={16} className="inline mr-1.5" />Sagas
          </button>
          <div className="flex-1" />
          {tab === 'users' && (
            <button onClick={() => setShowCreate(true)}
              className="mr-2 flex items-center gap-1.5 px-4 py-2 bg-[#10B981] text-white rounded-lg text-xs font-semibold hover:bg-[#059669] transition-all">
              <Plus size={14} /> Add Doctor
            </button>
          )}
          <button onClick={fetchData} disabled={loading}
            className="mr-3 flex items-center gap-1.5 px-4 py-2 bg-[#FAFAFA] rounded-lg text-xs font-semibold text-[#52525B] hover:bg-[#F4F4F5] transition-all">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider border-b border-[#E4E4E7]">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-center px-5 py-3">Role</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#4F46E5] text-xs font-bold">{u.name?.charAt(0)}</div>
                        <span className="font-semibold text-sm text-[#18181B]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#52525B]">{u.email}</td>
                    <td className="px-5 py-3.5 text-center"><span className={`status-badge ${u.role === 'DOCTOR' ? 'completed' : u.role === 'ADMIN' ? 'booked' : 'pending'}`}>{u.role}</span></td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => deleteUser(u.id)} className="p-1.5 text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-all">
                        <UserX size={16} />
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
                <tr className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider border-b border-[#E4E4E7]">
                  <th className="text-left px-5 py-3">ID</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-center px-5 py-3">Status</th>
                  <th className="text-center px-5 py-3">Step</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sagas.map((s) => (
                  <tr key={s.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA]">
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#18181B]">#{s.id}</td>
                    <td className="px-5 py-3.5 text-sm text-[#52525B]">{s.sagaType}</td>
                    <td className="px-5 py-3.5 text-center"><span className="status-badge pending">{s.status}</span></td>
                    <td className="px-5 py-3.5 text-center text-sm text-[#52525B]">{s.currentStep || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      {s.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleSagaAction(s.id, 'retry')} className="px-3 py-1.5 bg-[#D1FAE5] text-[#10B981] rounded-lg text-xs font-semibold hover:bg-[#A7F3D0] transition-all">Retry</button>
                          <button onClick={() => handleSagaAction(s.id, 'cancel')} className="px-3 py-1.5 bg-[#FEE2E2] text-[#EF4444] rounded-lg text-xs font-semibold hover:bg-[#FECACA] transition-all">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {sagas.length === 0 && <tr><td colSpan="5" className="py-12 text-center text-sm text-[#A1A1AA]">No sagas</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm shadow-lg border border-[#E4E4E7] animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
              <h3 className="text-base font-bold text-[#18181B]">Create Doctor</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#A1A1AA] hover:text-[#52525B] p-1"><X size={18} /></button>
            </div>
            <form onSubmit={createDoctor} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Full name</label>
                <input type="text" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="Dr. Name" className="input-field py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Email</label>
                <input type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} placeholder="doctor@example.com" className="input-field py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Password</label>
                <input type="password" value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} placeholder="Temporary password" className="input-field py-2.5 text-sm" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-[#FAFAFA] rounded-lg text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] transition-all">Cancel</button>
                <button type="submit" disabled={createLoading} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
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
