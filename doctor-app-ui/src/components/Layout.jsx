import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Stethoscope, Users, MessageCircle,
  Activity, LogOut, Bell, ChevronLeft, Menu, User, Shield, Star
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import NotificationDropdown from './NotificationDropdown';
import DoctorProfileModal from './DoctorProfileModal';

const navItems = {
  PATIENT: [
    { path: '/patient-home', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/my-appointments', label: 'My Appointments', icon: Calendar },
  ],
  DOCTOR: [
    { path: '/doctor-home', label: 'Dashboard', icon: LayoutDashboard },
  ],
  ADMIN: [
    { path: '/admin-home', label: 'Dashboard', icon: Shield },
  ],
};

export default function Layout({ children, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userName = localStorage.getItem('userName') || 'User';

  const fetchNotifs = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const res = await api.get(`/notifications/user/${userId}`);
      setNotifications(res.data.data || []);
    } catch {}
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Signed out');
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex">
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#0A1628] transition-all duration-300 flex flex-col sticky top-0 h-screen z-30`}>
        <div className="flex items-center gap-3 px-6 h-20 border-b border-white/5">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity size={20} className="text-white" />
          </div>
          {!collapsed && <span className="text-white font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>HealthConnect</span>}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems[role]?.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all nav-link ${active ? 'active' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <Icon size={20} />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-4">
          <button onClick={() => { setShowNotif(!showNotif); fetchNotifs(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all relative">
            <Bell size={20} />
            {!collapsed && 'Notifications'}
            {unreadCount > 0 && <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">{unreadCount}</span>}
          </button>
          <button onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <User size={20} />
            {!collapsed && 'Profile'}
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-white/5 text-white/30 hover:text-white/60 transition-all">
          <ChevronLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-extrabold text-[#0A1628] tracking-tight capitalize" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {location.pathname === '/patient-home' && 'Patient Dashboard'}
              {location.pathname === '/my-appointments' && 'My Appointments'}
              {location.pathname === '/doctor-home' && 'Doctor Dashboard'}
              {location.pathname === '/admin-home' && 'Admin Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => { setShowNotif(!showNotif); fetchNotifs(); }}
                className="relative p-3 rounded-xl bg-[#F0F4F8] hover:bg-[#E2E8F0] transition-all">
                <Bell size={20} className="text-[#64748B]" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center border-2 border-white">{unreadCount}</span>}
              </button>
              {showNotif && <NotificationDropdown notifications={notifications} onRefresh={fetchNotifs} onClose={() => setShowNotif(false)} />}
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-[#E2E8F0]">
              <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center text-white text-xs font-extrabold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#1E293B]">{userName}</p>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>

      {showProfile && <DoctorProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
