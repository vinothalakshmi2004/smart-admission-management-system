import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelopeOpenText, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import { API_URL } from '../../config';

// Messages sent from the public Contact Us page
const ContactMessages = () => {
    const { authConfig } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('New');

    const fetchMessages = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/contact`, authConfig());
            setMessages(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [authConfig]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const setStatus = async (id, status) => {
        try {
            const { data } = await axios.put(`${API_URL}/api/contact/${id}`, { status }, authConfig());
            setMessages((list) => list.map((m) => (m._id === id ? data : m)));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update message');
        }
    };

    if (loading) return <div className="p-8 sm:p-12 md:p-20 text-center text-primary font-bold animate-pulse">Loading Messages...</div>;

    const shown = filter === 'All' ? messages : messages.filter((m) => (m.status || 'New') === filter);
    const newCount = messages.filter((m) => (m.status || 'New') === 'New').length;

    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter font-serif italic">
                        Contact <span className="text-primary font-sans not-italic tracking-normal">Messages</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em]">
                        {newCount} new · {messages.length} total
                    </p>
                </div>
                <div className="flex gap-2">
                    {['New', 'Replied', 'All'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none cursor-pointer ${filter === f ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-red-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {shown.length === 0 ? (
                <div className="text-center py-16 text-gray-300">
                    <FaEnvelopeOpenText className="text-3xl sm:text-4xl md:text-5xl mx-auto mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">No messages</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {shown.map((m) => (
                        <li key={m._id} className="border border-gray-100 rounded-3xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-black text-gray-800">{m.subject}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {m.name} · {new Date(m.createdAt).toLocaleString('en-IN')}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold">
                                        <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="text-primary flex items-center gap-1 break-all">
                                            <FaEnvelope /> {m.email}
                                        </a>
                                        <a href={`tel:${m.mobile}`} className="text-primary flex items-center gap-1">
                                            <FaPhoneAlt /> {m.mobile}
                                        </a>
                                    </div>
                                </div>
                                <select
                                    value={m.status || 'New'}
                                    onChange={(e) => setStatus(m._id, e.target.value)}
                                    aria-label="Message status"
                                    className={`text-[10px] border-2 px-4 py-2 rounded-xl font-black uppercase tracking-widest outline-none cursor-pointer shrink-0 ${m.status === 'Replied' ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}
                                >
                                    <option value="New">New</option>
                                    <option value="Replied">Replied</option>
                                </select>
                            </div>
                            <p className="mt-4 text-sm text-gray-700 whitespace-pre-line break-words">{m.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContactMessages;
