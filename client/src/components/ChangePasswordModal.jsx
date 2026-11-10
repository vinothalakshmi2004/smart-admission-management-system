import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { FaKey, FaTimes } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const inputClass =
    'w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl outline-none focus:border-primary transition-all font-bold text-gray-700';

// A button that opens a small "change my password" dialog.
const ChangePasswordModal = ({ buttonClassName = '' }) => {
    const { changePassword } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });

    const close = () => {
        setOpen(false);
        setForm({ current: '', next: '', confirm: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.next.length < 6) return toast.error('New password must be at least 6 characters');
        if (form.next !== form.confirm) return toast.error('New passwords do not match');

        setSaving(true);
        const result = await changePassword(form.current, form.next);
        setSaving(false);
        if (result.success) {
            toast.success('Password changed successfully');
            close();
        } else {
            toast.error(result.message);
        }
    };

    const field = (name, label, autoComplete) => (
        <label className="block space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <input
                type="password"
                required
                autoComplete={autoComplete}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className={inputClass}
            />
        </label>
    );

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    buttonClassName ||
                    'bg-white text-primary border-2 border-primary px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center cursor-pointer'
                }
            >
                <FaKey className="mr-2" /> Change Password
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-md max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Change Password</h2>
                            <button type="button" onClick={close} aria-label="Close" className="text-gray-400 hover:text-primary bg-transparent border-none cursor-pointer">
                                <FaTimes />
                            </button>
                        </div>
                        {field('current', 'Current password', 'current-password')}
                        {field('next', 'New password (min 6 characters)', 'new-password')}
                        {field('confirm', 'Confirm new password', 'new-password')}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all disabled:opacity-60 border-none cursor-pointer"
                        >
                            {saving ? 'Saving...' : 'Save New Password'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChangePasswordModal;
