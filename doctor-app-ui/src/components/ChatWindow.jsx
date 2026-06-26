import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, MessageCircle, Clock, Check, CheckCheck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useWebSocket } from '../hooks/useWebSocket';

const ChatWindow = ({ appointment, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isClosed, setIsClosed] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const typingTimeoutRef = useRef(null);
    const scrollRef = useRef(null);

    const currentUserId = Number(localStorage.getItem('userId'));

    const onMessageReceived = useCallback((msg) => {
        setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
        });
    }, []);

    const onReadReceipt = useCallback(() => {
        setMessages(prev => prev.map(m => {
            if (m.senderId !== currentUserId && !m.readAt) {
                return { ...m, readAt: new Date().toISOString(), read: true };
            }
            return m;
        }));
    }, [currentUserId]);

    const onTyping = useCallback((data) => {
        if (data.userId !== currentUserId) {
            setTypingUser(data.typing ? data.userId : null);
            if (data.typing) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
            }
        }
    }, [currentUserId]);

    const { sendTyping } = useWebSocket(appointment?.id, onMessageReceived, onReadReceipt, onTyping);

    useEffect(() => {
        const loadChat = async () => {
            try {
                const res = await api.get(`/api/chat/history/${appointment.id}`);
                setMessages(res.data.data || []);

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
        if (appointment?.id) {
            loadChat();
        }
    }, [appointment]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        markAsRead();
    }, [appointment?.id]);

    const markAsRead = async () => {
        if (!appointment?.id) return;
        try {
            await api.put(`/api/chat/read/${appointment.id}?userId=${currentUserId}`);
        } catch (e) {
            // silent
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isClosed) return;

        const tempMsg = {
            id: Date.now(),
            appointmentId: appointment.id,
            senderId: currentUserId,
            senderName: 'You',
            message: newMessage,
            timestamp: new Date().toISOString(),
            readAt: null,
            read: false,
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");

        try {
            const res = await api.post('/api/chat/send', {
                appointmentId: appointment.id,
                senderId: currentUserId,
                senderName: localStorage.getItem('userName') || '',
                message: newMessage
            });

            setMessages(prev => prev.map(m =>
                m.id === tempMsg.id ? res.data.data : m
            ));
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Message failed to send";
            toast.error(errorMsg);
            if (err.response?.status === 400) setIsClosed(true);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        sendTyping(e.target.value.length > 0);
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
                    <div key={msg.id || index} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
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
                        {msg.senderId === currentUserId && (
                            <span className="text-[8px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                                {msg.readAt ? (
                                    <><CheckCheck size={12} className="text-blue-500" /> Read</>
                                ) : (
                                    <><Check size={12} /> Sent</>
                                )}
                            </span>
                        )}
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                        <MessageCircle size={32} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No messages yet</p>
                    </div>
                )}

                {typingUser && (
                    <div className="flex items-start">
                        <span className="text-[9px] text-slate-400 mb-1 px-1 font-black uppercase tracking-tighter">
                            Someone is typing...
                        </span>
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
                            onChange={handleTyping}
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