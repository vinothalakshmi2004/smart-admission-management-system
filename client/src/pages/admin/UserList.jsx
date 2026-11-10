import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FaUserGraduate, FaUserTie, FaEnvelope, FaPhone, FaTrash } from 'react-icons/fa';

const UserList = ({ role }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const roleQuery = role ? `?role=${role}` : '';
            const { data } = await axios.get(`http://localhost:5000/api/users${roleQuery}`, config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading {role}s...</div>;

    return (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 animate-fadeIn">
            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter font-serif italic mb-10 flex items-center">
                <div className="bg-primary text-white p-4 rounded-2xl mr-4 shadow-xl transform -rotate-3">
                    {role === 'student' ? <FaUserGraduate size={24} /> : <FaUserTie size={24} />}
                </div>
                {role ? `${role}s` : 'System Admins'} <span className="text-primary font-sans not-italic tracking-normal ml-3">Registry</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((u) => (
                    <div key={u._id} className="p-8 bg-neutralLight/50 border border-gray-100 rounded-[32px] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-20 w-20 bg-primary opacity-5 rounded-full pointer-events-none group-hover:scale-125 transition-transform"></div>

                        <div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="h-14 w-14 rounded-2xl bg-white text-primary flex items-center justify-center text-2xl font-black shadow-lg transform group-hover:rotate-6 transition-transform">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] bg-primary text-white shadow-lg shadow-red-100">
                                    {u.role}
                                </span>
                            </div>

                            <h3 className="text-lg font-black text-gray-800 truncate uppercase italic font-serif tracking-tight border-b-2 border-primary/10 pb-3 mb-4">{u.name}</h3>

                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center group/item p-2 hover:bg-white rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm group-hover/item:text-primary transition-colors">
                                        <FaEnvelope className="opacity-40" />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 lowercase truncate">{u.email}</p>
                                </div>
                                <div className="flex items-center group/item p-2 hover:bg-white rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm group-hover/item:text-primary transition-colors">
                                        <FaPhone className="opacity-40" />
                                    </div>
                                    <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">{u.contactNumber || 'NOT RECORDED'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200/20 flex justify-end">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="text-center py-10 text-gray-400 italic">
                    No {role}s found in the system.
                </div>
            )}
        </div>
    );
};

export default UserList;
