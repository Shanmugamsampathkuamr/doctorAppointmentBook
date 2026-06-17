import React, { useState } from 'react';
import { Star, X, Send, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ReviewModal = ({ appointment, onClose, onRefresh }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (rating === 0) return toast.error("Please select a star rating");

      setLoading(true);
      try {
        // Check: Does your ReviewController expect doctorId and patientId?
        await api.post('/api/reviews', {
          doctorId: Number(appointment.doctorId),
          patientId: Number(localStorage.getItem('userId')),
          rating: rating,
          comment: comment
        });

        toast.success("Feedback submitted!");
        onRefresh();
        onClose();
      } catch (err) {
        toast.error("You have already reviewed this visit or the session expired.");
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black italic tracking-tight">Rate Experience</h3>
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Dr. {appointment.doctorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Star Rating Section */}
          <div className="flex flex-col items-center gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How was your visit?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      (hover || rating) >= star ? "text-amber-400 fill-amber-400" : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
              <MessageSquare size={14} /> Your Comments
            </label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the consultation..."
              className="w-full h-32 bg-slate-50 border-none rounded-3xl p-5 text-slate-700 font-semibold focus:ring-4 focus:ring-emerald-100 transition-all resize-none outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;