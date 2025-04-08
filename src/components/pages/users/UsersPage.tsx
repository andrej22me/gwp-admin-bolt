"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import {useEffect, useState} from "react";
import UsersControls from "@/components/pages/users/UserControls";
import UserTable from "@/components/pages/users/UserTable";
import { api } from "@/lib/api";
import { apiJson } from "@/lib/apiJson";
import { User } from "@/interfaces/User";
import { UserRole } from "@/interfaces/UserRole";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

const UsersPage = () => {

    const currentUser = useAppSelector((state) => state.user.user);
    const [users, setUsers] = useState<User[]>([]); // State to store user data
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch users using the `api.get` method
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null); // Reset error

            try {
                const data = await api.get("/users"); // Call the get API endpoint
                setUsers(data); // Update the users state with the fetched data
            } catch (err: any) {
                console.error("Error fetching users:", err.message);
                setError(err.message || "Failed to load users."); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUsers();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Filter out undefined IDs and cast remaining to number[]
            setSelectedUsers(users.map(user => user.id).filter((id): id is number => id !== undefined));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleUsersDeleted = () => {
        setSelectedUsers([]);  // Clear selection
        // Refetch users
        const fetchUsers = async () => {
            setLoading(true);
            setError(null); // Reset error

            try {
                const data = await api.get("/users"); // Call the get API endpoint
                setUsers(data); // Update the users state with the fetched data
            } catch (err: any) {
                console.error("Error fetching users:", err.message);
                setError(err.message || "Failed to load users."); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchUsers();
    };

    const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement>, userId: number) => {
        e.preventDefault();
        try {
            await api.delete(`/users/${userId}`);
            toast.success("User deleted successfully");
            handleUsersDeleted();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    const handleBulkDelete = async () => {
        if (!currentUser || (currentUser.role !== UserRole.Admin && currentUser.role !== UserRole.SuperAdmin)) {
            toast.error("You don't have permission to delete users");
            return;
        }

        if (selectedUsers.length === 0) {
            toast.warning("Please select users to delete");
            return;
        }

        try {
            await apiJson.post("/users/bulk-delete", { userIds: selectedUsers });
            toast.success("Selected users deleted successfully");
            handleUsersDeleted();
        } catch (error) {
            console.error("Error deleting users:", error);
            toast.error("Failed to delete selected users");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Users"/>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <UsersControls
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        selectedUsers={selectedUsers}
                        onUsersDeleted={handleUsersDeleted}
                        onBulkDelete={handleBulkDelete}
                        currentUser={currentUser!}
                    />
                    {error && <p className="text-danger mt-4">{error}</p>}
                    {loading ? (
                        <p className="text-center py-4">Loading users...</p>
                    ) : (
                        <UserTable
                            users={filteredUsers}
                            selectedUsers={selectedUsers}
                            onSelectAll={handleSelectAll}
                            onSelectUser={handleSelectUser}
                            onDeleteUser={handleDeleteUser}
                            currentUser={currentUser!}
                        />
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default UsersPage;
