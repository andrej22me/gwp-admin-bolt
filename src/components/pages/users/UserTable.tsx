"use client";
import React from "react";
import Image from "next/image";
import {User} from "@/interfaces/User";
import Link from "next/link";
import {UserRole} from "@/interfaces/UserRole";

interface UsersTableProps {
    users: User[];
    selectedUsers: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectUser: (userId: number) => void;
    onDeleteUser: (e: React.MouseEvent<HTMLButtonElement>, userId: number) => void;
    currentUser: User;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    selectedUsers,
    onSelectAll,
    onSelectUser,
    onDeleteUser,
    currentUser
}) => {
    const canDeleteUser = (userToDelete: User) => {
        if (currentUser.role === UserRole.SuperAdmin) {
            return true;
        }
        if (currentUser.role === UserRole.Admin) {
            return userToDelete.role !== UserRole.SuperAdmin;
        }
        return false;
    };

    // Filter users with valid IDs first
    const validUsers = users.filter((user): user is User & { id: number } => 
        typeof user.id === 'number' && canDeleteUser(user)
    );

    const allSelectableUsersSelected = validUsers.length > 0 && 
        validUsers.every(user => selectedUsers.includes(user.id));

    return (
        <div className="mt-5 overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                        <input
                            type="checkbox"
                            onChange={onSelectAll}
                            checked={allSelectableUsersSelected}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                        />
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                </tr>
                </thead>
                <tbody>
                {validUsers.map((user) => (
                    <tr key={user.id}>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => onSelectUser(user.id)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                            />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative group">
                            <Link href={`/users/${user.id}`} className="text-primary dark:text-white">{user.name}</Link>
                            {canDeleteUser(user) && (
                                <button
                                    onClick={(e) => onDeleteUser(e, user.id)}
                                    className="text-xs text-red-600 hidden group-hover:block cursor-pointer absolute bottom-1 left-4"
                                >
                                    Delete
                                </button>
                            )}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black">{user.email}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{user.role}</p>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
