import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ChatWindow = ({ appointment, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isClosed, setIsClosed] = useState(false);
    const scrollRef = useRef(null);

    // Get current user ID from storage
    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const loadChat = async () => {
            try {
                // 1. Updated path to match @RequestMapping("/api/chat")
                const res = await api.get(`/api/chat/history/${appointment.id}`);
                setMessages(res.data.data || []);

                // 2. Check 24h Expiry logic
                const completionTime = new Date(appointment.updatedAt || appointment.appointmentDate);
                const now = new Date();
                const diffHours = (now - completionTime) / (1000 * 60 * 60);

                if (diffHours > 24) {
                    setIsClosed(true);
                }
            } catch (err) {
                console.error("Chat loading failed", err);
                toast.error("Could not load chat history");
            }
        };
        if (appointment?.id) loadChat();
    }, [appointment]);

    // Auto-scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isClosed) return;

        try {
            // Updated path to match @RequestMapping("/api/chat")
            const res = await api.post('/api/chat/send', {
                appointmentId: appointment.id,
                senderId: currentUserId,
                message: newMessage
            });

            setMessages(prev => [...prev, res.data.data]);
            setNewMessage("");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Message failed to send";
            toast.error(errorMsg);
            if (err.response?.status === 400) setIsClosed(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col z-[100] border border-gray-100 overflow-hidden border-t-4 border-t-blue-600 animate-in slide-in-from-right-4 duration-300">

            {/* Header */}
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-xl">
                        <MessageCircle size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest">Dr. {appointment.doctorName}</h4>
                        <p className="text-[9px] text-slate-400 font-bold tracking-tight">
                            Follow-up for Apt #{appointment.id}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                    <X size={20}/>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.length > 0 ? messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] text-slate-400 mb-1 px-1 font-black uppercase tracking-tighter">
                            {msg.senderId === currentUserId ? 'You' : msg.senderName}
                        </span>
                        <div className={`p-3 rounded-2xl text-xs font-medium shadow-sm max-w-[85%] leading-relaxed ${
                            msg.senderId === currentUserId
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                        }`}>
                            {msg.message}
                        </div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                        <MessageCircle size={32} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No messages yet</p>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                {isClosed ? (
                    <div className="bg-amber-50 text-amber-700 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 border border-amber-100">
                        <Clock size={14}/> 24h Window Closed
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                        <button
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-100"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;