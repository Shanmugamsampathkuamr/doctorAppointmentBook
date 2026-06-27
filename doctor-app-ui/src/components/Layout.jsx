import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Shield,
  Heart, LogOut, Bell, ChevronLeft, User
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import NotificationDropdown from './NotificationDropdown';
import DoctorProfileModal from './DoctorProfileModal';

const navItems = {
  PATIENT: [
    { path: '/patient-home', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/my-appointments', label: 'Appointments', icon: Calendar },
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
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-[#18181B] transition-all duration-300 flex flex-col sticky top-0 h-screen z-30`}>
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-black">H</span>
          </div>
          {!collapsed && <span className="text-white font-bold text-base tracking-tight">HealthConnect</span>}
        </div>
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {navItems[role]?.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-[#4F46E5] text-white' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'}`}>
                <Icon size={18} />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-2 pb-3 space-y-0.5 border-t border-white/5 pt-3">
          <button onClick={() => { setShowNotif(!showNotif); fetchNotifs(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all relative">
            <Bell size={18} />
            {!collapsed && 'Notifications'}
            {unreadCount > 0 && <span className={`${collapsed ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'} w-4 h-4 bg-[#EF4444] rounded-full text-[8px] font-bold text-white flex items-center justify-center`}>{unreadCount}</span>}
          </button>
          <button onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all">
            <User size={18} />
            {!collapsed && 'Profile'}
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all">
            <LogOut size={18} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-10 border-t border-white/5 text-[#52525B] hover:text-[#A1A1AA] transition-all">
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-[#E4E4E7] flex items-center justify-between px-6 sticky top-0 z-20">
          <h1 className="text-lg font-bold text-[#18181B] tracking-tight">
            {location.pathname === '/patient-home' && 'Dashboard'}
            {location.pathname === '/my-appointments' && 'My Appointments'}
            {location.pathname === '/doctor-home' && 'Dashboard'}
            {location.pathname === '/admin-home' && 'Admin Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => { setShowNotif(!showNotif); fetchNotifs(); }}
                className="relative p-2 rounded-lg bg-[#FAFAFA] hover:bg-[#F4F4F5] transition-all">
                <Bell size={18} className="text-[#52525B]" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EF4444] rounded-full text-[8px] font-bold text-white flex items-center justify-center border-2 border-white">{unreadCount}</span>}
              </button>
              {showNotif && <NotificationDropdown notifications={notifications} onRefresh={fetchNotifs} onClose={() => setShowNotif(false)} />}
            </div>
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E4E4E7]">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#18181B]">{userName}</p>
                <p className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-wide">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>

      {showProfile && <DoctorProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
