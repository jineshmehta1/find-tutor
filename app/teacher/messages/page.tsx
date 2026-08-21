"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, User, Search, MessageSquare, ShieldCheck, CheckCheck } from "lucide-react";
import { toast } from "sonner";

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

export default function TeacherMessagesPage() {
    const { data: session } = useSession();
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            await fetchTeacherProfile();
        };
        loadInitialData();

        // Listen for storage events (allows multi-tab live chat testing!)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "student_chat_history") {
                loadChatsFromStorage();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (teacherId) {
            loadChatsFromStorage();
        }
    }, [teacherId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedStudentId, conversations]);

    const fetchTeacherProfile = async () => {
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data = await res.json();
                if (data.teacher?.id) {
                    setTeacherId(data.teacher.id);
                }
            }
        } catch (err) {
            console.error("Failed to load teacher profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadChatsFromStorage = () => {
        const saved = localStorage.getItem("student_chat_history");
        if (saved) {
            try {
                const list = JSON.parse(saved);
                if (Array.isArray(list)) {
                    setConversations(list);
                    if (list.length > 0 && !selectedStudentId) {
                        setSelectedStudentId(list[0].tutorId);
                    }
                }
            } catch (e) {}
        }
    };

    // Filter conversations where tutorId matches current logged-in teacher
    const myConversations = conversations.filter(c => c.tutorId === teacherId);
    const activeChat = myConversations.find(c => c.tutorId === selectedStudentId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedStudentId) return;

        const sentMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            sender: "tutor",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updated = conversations.map(c => {
            if (c.tutorId === selectedStudentId) {
                return { ...c, messages: [...c.messages, sentMsg] };
            }
            return c;
        });

        setConversations(updated);
        localStorage.setItem("student_chat_history", JSON.stringify(updated));
        
        // Dispatch local event to trigger sidebar/header updates instantly
        window.dispatchEvent(new Event("storage"));
        
        setNewMessage("");
    };

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            <div className="mb-4">
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Student Chats</h1>
                <p className="text-xs font-bold text-slate-400">Direct message workspace communications with active parents and students</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : myConversations.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Active Chats</h3>
                    <p>When student inquiries contact you directly, your messaging channels will be generated here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden h-[600px]">
                    
                    {/* Left Sidebar: Student list (4 Cols) */}
                    <div className="lg:col-span-4 border-r border-slate-100 flex flex-col h-full bg-white">
                        <div className="p-4 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Student Conversations</span>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                            {myConversations.map(conv => {
                                const isSelected = conv.tutorId === selectedStudentId;
                                const lastMsg = conv.messages[conv.messages.length - 1];
                                const studentInitials = conv.studentName ? conv.studentName.split(" ").map(n => n[0]).join("") : "S";
                                return (
                                    <div
                                        key={conv.tutorId}
                                        onClick={() => setSelectedStudentId(conv.tutorId)}
                                        className={`p-4 flex gap-3 items-start cursor-pointer transition-colors ${
                                            isSelected ? "bg-amber-50/30 border-l-4 border-[#ffb800]" : "hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#ffb800]/10 text-slate-950 flex items-center justify-center text-xs font-black uppercase shrink-0 border border-slate-200">
                                            {studentInitials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs font-black text-slate-900 truncate">{conv.studentName || "Student Parent"}</h4>
                                                <span className="text-[9px] text-slate-400 font-bold shrink-0">{lastMsg?.timestamp}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate mt-1">
                                                {lastMsg ? `${lastMsg.sender === "tutor" ? "You: " : ""}${lastMsg.text}` : "No messages"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Pane: Chat stream (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col h-full justify-between bg-slate-50/10">
                        {activeChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-white">
                                    <div className="w-10 h-10 rounded-full bg-[#ffb800]/10 text-slate-950 flex items-center justify-center text-xs font-black uppercase border">
                                        {activeChat.studentName ? activeChat.studentName.split(" ").map(n => n[0]).join("") : "S"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-xs font-black text-slate-900">{activeChat.studentName || "Student Parent"}</h4>
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider block">Student Lead Profile</span>
                                    </div>
                                </div>

                                {/* Messages Bubble stream */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                                    {activeChat.messages.map(msg => {
                                        const isTutor = msg.sender === "tutor";
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isTutor ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs ${
                                                    isTutor 
                                                        ? "bg-[#0a1829] text-white rounded-tr-none" 
                                                        : "bg-white border border-slate-200/60 text-slate-800 rounded-tl-none"
                                                }`}>
                                                    <p className="font-bold leading-relaxed">{msg.text}</p>
                                                    <div className={`flex items-center justify-end gap-1 text-[8px] mt-1.5 ${
                                                        isTutor ? "text-slate-355" : "text-slate-400"
                                                    }`}>
                                                        <span>{msg.timestamp}</span>
                                                        {isTutor && <CheckCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input form */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
                                    <input
                                        type="text"
                                        placeholder="Type your reply here..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                    />
                                    <button type="submit" className="px-4 py-3 bg-[#0a1829] hover:bg-[#ffb800] hover:text-slate-950 text-white rounded-xl transition-all shadow-md cursor-pointer">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-slate-400 font-semibold text-xs">
                                <p>Select a student conversation from the list to begin messaging.</p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
