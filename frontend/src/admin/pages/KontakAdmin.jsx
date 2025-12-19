import React, { useState, useEffect } from "react";

const KontakAdmin = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log("📧 [KontakAdmin] Fetching contact messages...");
                setMessages([
                    {
                        id: 1,
                        name: "John Doe",
                        email: "john@example.com",
                        subject: "Pertanyaan Layanan",
                        message: "Saya ingin tahu lebih banyak tentang layanan web development Anda",
                        date: "2025-12-10",
                        status: "unread",
                        replies: [],
                    },
                    {
                        id: 2,
                        name: "Jane Smith",
                        email: "jane@example.com",
                        subject: "Kolaborasi Bisnis",
                        message: "Apakah Anda tertarik untuk berkolaborasi?",
                        date: "2025-12-09",
                        status: "read",
                        replies: ["Terima kasih telah menghubungi kami..."],
                    },
                ]);
                setLoading(false);
            } catch (error) {
                console.error("❌ [KontakAdmin] Error:", error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleReply = (messageId) => {
        if (!replyText.trim()) return;

        console.log("💬 [KontakAdmin] Sending reply to message:", messageId);
        setMessages(
            messages.map((msg) =>
                msg.id === messageId
                    ? { ...msg, replies: [...msg.replies, replyText], status: "read" }
                    : msg
            )
        );
        setReplyText("");
    };

    const handleDelete = (id) => {
        console.log("🗑️ [KontakAdmin] Deleting message:", id);
        setMessages(messages.filter((m) => m.id !== id));
        setSelectedMessage(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Kelola Kontak</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Message List */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
                        {messages.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                <i className="ri-mail-line text-3xl mb-2 opacity-50"></i>
                                <p>Tidak ada pesan</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-4 cursor-pointer hover:bg-[#0F172A]/50 transition ${
                                            selectedMessage?.id === msg.id ? "bg-[#0F172A]" : ""
                                        } ${msg.status === "unread" ? "border-l-2 border-blue-500" : ""}`}
                                    >
                                        <p className="font-medium text-white truncate">{msg.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                                        <p className="text-xs text-gray-500 mt-1">{msg.date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                                    <p className="text-gray-400">Dari: {selectedMessage.name}</p>
                                    <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="text-red-400 hover:text-red-300 transition"
                                    title="Hapus"
                                >
                                    <i className="ri-delete-line text-xl"></i>
                                </button>
                            </div>

                            <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-300">{selectedMessage.message}</p>
                            </div>

                            {/* Replies */}
                            {selectedMessage.replies.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-300">Balasan:</h3>
                                    {selectedMessage.replies.map((reply, idx) => (
                                        <div key={idx} className="bg-[#0F172A] rounded-lg p-4 border border-gray-700">
                                            <p className="text-gray-300">{reply}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Form */}
                            <div className="space-y-2 border-t border-gray-700 pt-4">
                                <label className="block text-sm font-medium text-gray-300">Balas Pesan</label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                                    placeholder="Tulis balasan Anda..."
                                ></textarea>
                                <button
                                    onClick={() => handleReply(selectedMessage.id)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                >
                                    <i className="ri-send-plane-line mr-2"></i>
                                    Kirim Balasan
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-12 flex items-center justify-center h-full text-center">
                            <div className="text-gray-400">
                                <i className="ri-mail-open-line text-4xl mb-3 opacity-50"></i>
                                <p>Pilih pesan untuk melihat detail</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KontakAdmin;
