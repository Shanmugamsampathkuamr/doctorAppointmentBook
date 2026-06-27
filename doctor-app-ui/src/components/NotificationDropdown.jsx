import { Bell, Check, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function NotificationDropdown({ notifications, onRefresh, onClose }) {
  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); if (onRefresh) onRefresh(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-[#E4E4E7] z-50 animate-scale-in">
      <div className="flex items-center justify-between p-4 border-b border-[#E4E4E7]">
        <h3 className="text-sm font-bold text-[#18181B]">Notifications</h3>
        <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#52525B]"><X size={15} /></button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#A1A1AA]">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-[#F4F4F5] hover:bg-[#FAFAFA] transition-all ${!n.isRead ? 'bg-[#EEF2FF]' : ''}`}>
              <div className={`p-1.5 rounded-lg ${n.type === 'APPOINTMENT' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#FEF3C7] text-[#B45309]'}`}>
                <Bell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#18181B]">{n.message}</p>
                <p className="text-[10px] text-[#A1A1AA] mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="p-1 text-[#A1A1AA] hover:text-[#4F46E5] rounded-lg hover:bg-[#EEF2FF] transition-all shrink-0">
                  <Check size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
