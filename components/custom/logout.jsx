import React from 'react'
import { Button } from '../ui/button';
import { RxCross1 } from 'react-icons/rx';
import { CiWarning } from 'react-icons/ci';
import { logout } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import useLogout from '@/hooks/useLogout';
import { useRouter } from 'next/navigation';

const Logout = ({ onClose, setIsLogoutOpen }) => {
    const { performLogout, loading, error } = useLogout();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            // ✅ Backend logout request
            await performLogout();

            setIsLogoutOpen(false);
            console.log("Logged out");
            router.push("/user");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 h-[100vh]">
            <div className="flex flex-col p-5 gap-4 bg-white rounded-xl shadow-lg w-64 text-center">
                <div className="flex justify-between items-center">
                    <h2 className="text-md font-medium text-stone-800">Confirm logging out</h2>
                    <span
                        onClick={onClose}
                        className="text-sm text-stone-600 hover:underline"
                    >
                        <RxCross1 className="text-md" />
                    </span>
                </div>
                <div className="flex justify-end items-center gap-4 pt-2">
                    <Button
                        variant="logout"
                        onClick={handleLogout} // Replace with actual logout logic
                    >
                        Ok
                    </Button>
                    <Button
                        disabled={loading}
                        variant="cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Logout