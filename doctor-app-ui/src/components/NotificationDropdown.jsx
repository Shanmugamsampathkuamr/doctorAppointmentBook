import React from 'react';
import { Bell, Check, Clock, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const NotificationDropdown = ({ notifications, onRefresh, onClose }) => {

  const markAsRead = async (id) => {
      try {
        // Ensure your Java Controller has @PutMapping("/{id}/read")
        await api.put(`/api/notifications/${id}/read`);

        // Call the parent's refresh function to clear the red dot on the bell
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error("Error marking read", err);
      }
    };

  return (
    <div className="absolute top-16 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
          <Bell size={14} className="text-blue-600" /> Notifications
        </h3>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <X size={16} />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 border-b border-slate-50 transition-colors flex gap-4 ${n.isRead ? 'opacity-50' : 'bg-blue-50/30'}`}
            >
              <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-slate-200' : 'bg-blue-600 animate-pulse'}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700 leading-relaxed mb-2">{n.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1">
                    <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[9px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1"
                    >
                      <Check size={10} /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;