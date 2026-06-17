import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, X, ShieldCheck, Award, MapPin } from 'lucide-react';
import api from '../api/axios';

const DoctorProfileModal = ({ doctor, onClose, onBook }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/api/reviews/doctor/${doctor.id}`);
        setReviews(res.data.data || []);
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (doctor?.id) fetchReviews();
  }, [doctor.id]);

  // Calculate Average Rating dynamically if not provided by backend
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[120] p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

        {/* --- HEADER SECTION --- */}
        <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-start relative">
          <div className="flex gap-8">
            <div className="w-28 h-28 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black italic shadow-xl shadow-blue-100">
              {doctor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Dr. {doctor.name}</h2>
                <ShieldCheck className="text-blue-500" size={24} />
              </div>
              <p className="text-blue-600 font-black uppercase text-xs tracking-[0.2em] mb-4">{doctor.specialization}</p>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-black text-slate-700 text-sm">{averageRating}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Award size={16} className="text-blue-500" />
                  <span className="font-black text-slate-700 text-sm">{doctor.experience || '8+'} Yrs Exp.</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- REVIEWS CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <MessageSquare size={14} /> Patient Testimonials ({reviews.length})
            </h3>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-slate-50 rounded-3xl animate-pulse" />
              <div className="h-24 bg-slate-50 rounded-3xl animate-pulse w-3/4" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-50 hover:border-blue-100 transition-colors group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black uppercase">
                            {rev.patientName?.charAt(0) || 'P'}
                        </div>
                        <span className="font-black text-slate-900 text-xs tracking-tight">{rev.patientName}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-4 border-dashed border-slate-50 rounded-[3rem]">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-slate-200" />
              </div>
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest leading-relaxed">
                No reviews yet.<br />Be the first to consult!
              </p>
            </div>
          )}
        </div>

        {/* --- FOOTER ACTION --- */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
            <div className="flex-1 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Consultation Fee</p>
                <p className="text-xl font-black text-slate-900 italic">₹500 <span className="text-[10px] text-slate-400 not-italic">/ session</span></p>
            </div>
            <button
                onClick={() => onBook(doctor)}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
            >
                Schedule Appointment
            </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;