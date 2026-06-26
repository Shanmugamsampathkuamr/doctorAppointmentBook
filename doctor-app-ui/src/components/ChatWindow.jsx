import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, MessageCircle, Clock, Check, CheckCheck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useWebSocket } from '../hooks/useWebSocket';

export default function ChatWindow({ appointment, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);
  const currentUserId = Number(localStorage.getItem('userId'));

  const onMsg = useCallback((msg) => {
    setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
  }, []);

  const onRead = useCallback(() => {
    setMessages(prev => prev.map(m => m.senderId !== currentUserId && !m.readAt ? { ...m, readAt: new Date().toISOString() } : m));
  }, [currentUserId]);

  const onTyping = useCallback((data) => {
    if (data.userId !== currentUserId) {
      setTypingUser(data.typing ? data.userId : null);
      clearTimeout(typingTimeout.current);
      if (data.typing) typingTimeout.current = setTimeout(() => setTypingUser(null), 3000);
    }
  }, [currentUserId]);

  const { sendTyping } = useWebSocket(appointment?.id, onMsg, onRead, onTyping);

  useEffect(() => {
    if (!appointment?.id) return;
    const load = async () => {
      try {
        const res = await api.get(`/api/chat/history/${appointment.id}`);
        setMessages(res.data.data || []);
        const t = new Date(appointment.updatedAt || appointment.appointmentDate);
        if ((Date.now() - t) / (1000 * 60 * 60) > 24) setIsClosed(true);
        await api.put(`/api/chat/read/${appointment.id}?userId=${currentUserId}`);
      } catch { toast.error('Failed to load chat'); }
    };
    load();
  }, [appointment?.id]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isClosed) return;
    const temp = { id: Date.now(), appointmentId: appointment.id, senderId: currentUserId, senderName: 'You', message: newMessage, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, temp]);
    setNewMessage('');
    try {
      const res = await api.post('/api/chat/send', { appointmentId: appointment.id, senderId: currentUserId, senderName: localStorage.getItem('userName') || '', message: newMessage });
      setMessages(prev => prev.map(m => m.id === temp.id ? res.data.data : m));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Send failed');
      if (err.response?.status === 400) setIsClosed(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-[#E2E8F0] overflow-hidden animate-scale-in">
      <div className="bg-[#0A1628] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg"><MessageCircle size={18} className="text-blue-400" /></div>
          <div>
            <p className="text-xs font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dr. {appointment.doctorName}</p>
            <p className="text-[9px] text-blue-300/60 font-semibold">Apt #{appointment.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC] scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1 px-1">
              {msg.senderId === currentUserId ? 'You' : msg.senderName}
            </span>
            <div className={`p-3 rounded-xl text-xs font-medium max-w-[85%] leading-relaxed ${
              msg.senderId === currentUserId
                ? 'bg-[#2563EB] text-white rounded-br-none'
                : 'bg-white text-[#1E293B] rounded-bl-none border border-[#E2E8F0]'
            }`}>{msg.message}</div>
            {msg.senderId === currentUserId && (
              <span className="text-[8px] text-[#94A3B8] mt-1 px-1 flex items-center gap-1">
                {msg.readAt ? <><CheckCheck size={11} className="text-[#2563EB]" /> Read</> : <><Check size={11} /> Sent</>}
              </span>
            )}
          </div>
        ))}
        {typingUser && <div className="text-[10px] text-[#94A3B8] italic px-1">Someone is typing...</div>}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-[#E2E8F0]">
        {isClosed ? (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-2 border border-amber-100">
            <Clock size={14} /> 24h Window Closed
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input type="text" value={newMessage} onChange={(e) => { setNewMessage(e.target.value); sendTyping(e.target.value.length > 0); }}
              placeholder="Type your message..." className="input-field py-3 text-sm flex-1" />
            <button type="submit" disabled={!newMessage.trim()}
              className="bg-[#2563EB] text-white p-3 rounded-xl hover:bg-[#1D4ED8] transition-all disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
