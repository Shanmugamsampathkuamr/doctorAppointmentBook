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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E8DDD3]">
          <h3 className="text-lg font-extrabold text-[#2B1E16]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rate Your Visit</h3>
          <button onClick={onClose} className="text-[#9E8E82] hover:text-[#8B7D72] p-1"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-sm font-bold text-[#2B1E16] mb-1">Dr. {appointment.doctorName}</p>
            <p className="text-xs text-[#9E8E82] font-medium">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                className="transition-all hover:scale-110">
                <Star size={32} className={`${star <= (hover || rating) ? 'text-[#C9953C] fill-[#C9953C]' : 'text-[#E8DDD3]'} transition-colors`} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Share your experience (optional)..."
            className="input-field resize-none" />
          <button onClick={submit} disabled={loading || rating === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
