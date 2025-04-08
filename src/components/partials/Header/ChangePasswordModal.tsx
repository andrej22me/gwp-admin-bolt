import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { apiJson } from '@/lib/apiJson';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: number;
}

const ChangePasswordModal = ({ isOpen, onClose, userId }: ChangePasswordModalProps) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await apiJson.post(`/users/${userId}/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            
            toast.success('Password changed successfully');
            onClose();
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed h-screen inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
            <ToastContainer />
            <div className="w-full max-w-md rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        Change Password
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-black dark:text-white hover:text-opacity-70"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Current Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
