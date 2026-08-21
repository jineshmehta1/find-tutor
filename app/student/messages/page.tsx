"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Send, User, Search, MessageSquare, ShieldCheck, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface Teacher {
    id: string;
    user: {
        name: string;
        profilePhoto?: string;
        phone: string;
    };
}

interface ChatMessage {
    id: string;
    sender: "student" | "tutor";
    text: string;
    timestamp: string;
}

interface Conversation {
    tutorId: string;
    tutorName: string;
    tutorPhoto?: string;
    studentName?: string;
    studentPhoto?: string;
    messages: ChatMessage[];
}

export default function StudentMessagesPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const activeTutorId = searchParams.get("tutor");

    const [tutors, setTutors] = useState<Teacher[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTutorsAndChats();
    }, []);

    useEffect(() => {
        if (activeTutorId) {
            setSelectedTutorId(activeTutorId);
            // Ensure this conversation exists
            const tutorObj = tutors.find(t => t.id === activeTutorId);
            if (tutorObj && !conversations.some(c => c.tutorId === activeTutorId)) {
                const newConv: Conversation = {
                    tutorId: activeTutorId,
                    tutorName: tutorObj.user.name,
                    tutorPhoto: tutorObj.user.profilePhoto,
                    studentName: session?.user?.name || "Student",
                    studentPhoto: session?.user?.image || "",
                    messages: [
                        {
                            id: `msg_init_${Date.now()}`,
                            sender: "tutor",
                            text: `Hello! Thanks for reaching out. How can I help you with your learning goals?`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ]
                };
                const updated = [newConv, ...conversations];
                setConversations(updated);
                localStorage.setItem("student_chat_history", JSON.stringify(updated));
            }
        }
    }, [activeTutorId, tutors, session]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTutorId, conversations]);

    const fetchTutorsAndChats = async () => {
        try {
            const res = await fetch("/api/teachers?approved=true");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setTutors(data);

                // Load chats from localStorage
                const saved = localStorage.getItem("student_chat_history");
                let chatList: Conversation[] = [];
                if (saved) {
                    try { chatList = JSON.parse(saved); } catch {}
                }

                setConversations(chatList);
                if (chatList.length > 0 && !selectedTutorId) {
                    setSelectedTutorId(chatList[0].tutorId);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const activeChat = conversations.find(c => c.tutorId === selectedTutorId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTutorId) return;

        const sentMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            sender: "student",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updated = conversations.map(c => {
            if (c.tutorId === selectedTutorId) {
                return { ...c, messages: [...c.messages, sentMsg] };
            }
            return c;
        });

        setConversations(updated);
        localStorage.setItem("student_chat_history", JSON.stringify(updated));
        setNewMessage("");

        // Simulate tutor auto-reply after 1.5 seconds to make the chat feel functional
        setTimeout(() => {
            const replies = [
                "Sure! I can certainly guide you through those topics. Let's schedule a call to coordinate further details.",
                "Yes, I teach classes on weekdays as well as weekends. What slots work best for you?",
                "That works! I will send over some learning materials so we can start our preparation.",
                "Excellent! Let me check my schedule calendar and get back to you with the timing."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg: ChatMessage = {
                id: `msg_reply_${Date.now()}`,
                sender: "tutor",
                text: randomReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const autoUpdated = updated.map(c => {
                if (c.tutorId === selectedTutorId) {
                    return { ...c, messages: [...c.messages, replyMsg] };
                }
                return c;
            });
            setConversations(autoUpdated);
            localStorage.setItem("student_chat_history", JSON.stringify(autoUpdated));
        }, 1500);
    };

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            <div className="mb-4">
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Messages</h1>
                <p className="text-xs font-bold text-slate-400">Direct workspace chats with your active tutors and instructors</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : conversations.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Active Messages</h3>
                    <p>Contact a tutor or bookmark a profile to initiate workspace communications.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden h-[600px]">
                    
                    {/* Left Sidebar: Conversations List (4 Cols) */}
                    <div className="lg:col-span-4 border-r border-slate-100 flex flex-col h-full">
                        <div className="p-4 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Active Chats</span>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                            {conversations.map(conv => {
                                const isSelected = conv.tutorId === selectedTutorId;
                                const lastMsg = conv.messages[conv.messages.length - 1];
                                return (
                                    <div
                                        key={conv.tutorId}
                                        onClick={() => setSelectedTutorId(conv.tutorId)}
                                        className={`p-4 flex gap-3 items-start cursor-pointer transition-colors ${
                                            isSelected ? "bg-amber-50/30 border-l-4 border-[#ffb800]" : "hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border">
                                            <img src={conv.tutorPhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt={conv.tutorName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs font-black text-slate-900 truncate">{conv.tutorName}</h4>
                                                <span className="text-[9px] text-slate-400 font-bold shrink-0">{lastMsg?.timestamp}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate mt-1">
                                                {lastMsg ? `${lastMsg.sender === "student" ? "You: " : ""}${lastMsg.text}` : "No messages"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Area: Active Chat Window (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col h-full justify-between">
                        {activeChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border">
                                        <img src={activeChat.tutorPhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt={activeChat.tutorName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-xs font-black text-slate-900">{activeChat.tutorName}</h4>
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider block">Online / Available</span>
                                    </div>
                                </div>

                                {/* Messages Bubble Stream */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                                    {activeChat.messages.map(msg => {
                                        const isStudent = msg.sender === "student";
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs ${
                                                    isStudent 
                                                        ? "bg-[#0a1829] text-white rounded-tr-none" 
                                                        : "bg-white border border-slate-200/60 text-slate-800 rounded-tl-none"
                                                }`}>
                                                    <p className="font-bold leading-relaxed">{msg.text}</p>
                                                    <div className={`flex items-center justify-end gap-1 text-[8px] mt-1.5 ${
                                                        isStudent ? "text-slate-350" : "text-slate-400"
                                                    }`}>
                                                        <span>{msg.timestamp}</span>
                                                        {isStudent && <CheckCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input Box */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
                                    <input
                                        type="text"
                                        placeholder="Type your message here..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                    />
                                    <button type="submit" className="px-4 py-3 bg-[#0a1829] hover:bg-[#ffb800] hover:text-slate-950 text-white rounded-xl transition-all shadow-md">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-slate-400 font-semibold text-xs">
                                <p>Select a chat conversation from the list to begin messaging.</p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
