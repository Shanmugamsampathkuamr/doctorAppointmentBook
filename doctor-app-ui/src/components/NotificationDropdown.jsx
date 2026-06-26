import { Bell, Check, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function NotificationDropdown({ notifications, onRefresh, onClose }) {
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      if (onRefresh) onRefresh();
    } catch { toast.error('Failed to mark as read'); }
  };

  return (
    <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-[#E8DDD3] z-50 animate-scale-in">
      <div className="flex items-center justify-between p-4 border-b border-[#E8DDD3]">
        <h3 className="text-sm font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifications</h3>
        <button onClick={onClose} className="text-[#9E8E82] hover:text-[#8B7D72]"><X size={16} /></button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#9E8E82] font-medium">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-[#FDF6F0] hover:bg-[#FAF5EF] transition-all ${!n.isRead ? 'bg-[#FDF6F0]' : ''}`}>
              <div className={`p-2 rounded-lg ${n.type === 'APPOINTMENT' ? 'bg-[#F0E6DF] text-[#7A2E1A]' : 'bg-[#FDF1D8] text-[#7A5C20]'}`}>
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2B1E16]">{n.message}</p>
                <p className="text-[9px] text-[#9E8E82] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="p-1.5 text-[#9E8E82] hover:text-[#7A2E1A] rounded-lg hover:bg-[#FDF6F0] transition-all flex-shrink-0">
                  <Check size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
