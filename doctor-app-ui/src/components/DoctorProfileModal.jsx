import { X, User, Mail, Shield, Calendar } from 'lucide-react';

export default function DoctorProfileModal({ onClose }) {
  const user = {
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || '',
    role: localStorage.getItem('userRole') || '',
    id: localStorage.getItem('userId') || '',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-sm shadow-lg border border-[#E4E4E7] animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <h3 className="text-base font-bold text-[#18181B]">Profile</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#52525B] p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-bold text-[#18181B]">{user.name}</p>
              <span className="status-badge booked text-[10px]">{user.role}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
              <Mail size={15} className="text-[#A1A1AA]" />
              <span className="text-sm text-[#52525B]">{user.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
              <Shield size={15} className="text-[#A1A1AA]" />
              <span className="text-sm text-[#52525B] capitalize">{user.role.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
              <Calendar size={15} className="text-[#A1A1AA]" />
              <span className="text-sm text-[#52525B]">ID: {user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
