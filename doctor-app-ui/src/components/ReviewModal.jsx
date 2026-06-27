import { useState } from 'react';
import { X, Star } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ReviewModal({ appointment, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (rating === 0) { toast.error('Select a rating'); return; }
    setLoading(true);
    try {
      await api.post('/reviews', { appointmentId: appointment.id, patientId: Number(localStorage.getItem('userId')), doctorId: appointment.doctorId, rating, comment });
      toast.success('Review submitted!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-sm shadow-lg border border-[#E4E4E7] animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <h3 className="text-base font-bold text-[#18181B]">Rate Your Visit</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#52525B] p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#18181B] mb-0.5">Dr. {appointment.doctorName}</p>
            <p className="text-xs text-[#A1A1AA]">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                className="transition-all hover:scale-110">
                <Star size={28} className={`${star <= (hover || rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E4E4E7]'} transition-colors`} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Share your experience (optional)..." className="input-field resize-none" />
          <button onClick={submit} disabled={loading || rating === 0} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
