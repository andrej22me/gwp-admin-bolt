import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { apiJson } from "@/lib/apiJson";
import { UserRole } from "@/interfaces/UserRole";
import { User } from "@/interfaces/User";

interface UsersControlsProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedUsers: number[];
    onUsersDeleted: () => void;
    onBulkDelete: () => void;
    currentUser: User;
}

const UsersControls: React.FC<UsersControlsProps> = ({ 
    searchTerm, 
    onSearchChange, 
    selectedUsers,
    onUsersDeleted,
    onBulkDelete,
    currentUser
}) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleBulkAction = () => {
        setIsConfirmModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                {selectedUsers.length > 0 && (
                    <button
                        onClick={handleBulkAction}
                        className="flex justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
                    >
                        Delete Selected ({selectedUsers.length})
                    </button>
                )}
               {
                (currentUser?.role === UserRole.SuperAdmin || currentUser?.role === UserRole.Admin) && (
                    <Link
                    href="/users/new"
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                >
                    Add User
                </Link>
                )
               }
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    onBulkDelete();
                    setIsConfirmModalOpen(false);
                }}
                title="Delete Users"
                message={`Are you sure you want to delete ${selectedUsers.length} selected users?`}
            />
        </div>
    );
};

export default UsersControls;
