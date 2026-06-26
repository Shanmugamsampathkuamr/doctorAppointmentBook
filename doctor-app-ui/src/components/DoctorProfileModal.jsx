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
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E8DDD3]">
          <h3 className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profile</h3>
          <button onClick={onClose} className="text-[#9E8E82] hover:text-[#8B7D72] p-1"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7A2E1A] to-[#4F1B0D] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.name}</p>
              <span className="status-badge booked text-[10px]">{user.role}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#FAF5EF] rounded-xl">
              <Mail size={16} className="text-[#9E8E82]" />
              <span className="text-sm text-[#8B7D72]">{user.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAF5EF] rounded-xl">
              <Shield size={16} className="text-[#9E8E82]" />
              <span className="text-sm text-[#8B7D72] capitalize">{user.role.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FAF5EF] rounded-xl">
              <Calendar size={16} className="text-[#9E8E82]" />
              <span className="text-sm text-[#8B7D72]">ID: {user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
