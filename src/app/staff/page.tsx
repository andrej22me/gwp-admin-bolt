"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { Staff } from "@/interfaces/Staff";
import StaffTable from "@/components/pages/staff/StaffTable";
import { apiJson } from "@/lib/apiJson";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { api } from "@/lib/api";

const StaffPage = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiJson.get("/staff");
            setStaff(response);
        } catch (err: any) {
            console.error("Error fetching staff:", err.message);
            setError(err.message || "Failed to load staff.");
            toast.error(err.message || "Failed to load staff.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allStaffIds = staff
                .filter((member): member is Staff & { id: number } => typeof member.id === 'number')
                .map(member => member.id);
            setSelectedStaff(allStaffIds);
        } else {
            setSelectedStaff([]);
        }
    };

    const handleSelectStaff = (staffId: number) => {
        setSelectedStaff(prev => {
            if (prev.includes(staffId)) {
                return prev.filter(id => id !== staffId);
            } else {
                return [...prev, staffId];
            }
        });
    };

    const handleDeleteStaff = async (e: React.MouseEvent<HTMLButtonElement>, staffId: number) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this staff member?")) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/staff/${staffId}`);
            setStaff(prev => prev.filter(member => member.id !== staffId));
            setSelectedStaff(prev => prev.filter(id => id !== staffId));
            toast.success("Staff member deleted successfully");
        } catch (err: any) {
            console.error("Error deleting staff member:", err.message);
            toast.error(err.message || "Failed to delete staff member");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedStaff.length === 0) {
            toast.warn("Please select staff members to delete");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedStaff.length} staff member(s)?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await apiJson.post('/staff/bulk-delete', { ids: selectedStaff });
            setStaff(prev => prev.filter(member => !selectedStaff.includes(member.id || -1)));
            setSelectedStaff([]);
            toast.success("Staff members deleted successfully");
        } catch (err: any) {
            console.error("Error deleting staff members:", err.message);
            toast.error(err.message || "Failed to delete staff members");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            </DefaultLayout>
        );
    }

    if (error) {
        return (
            <DefaultLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-danger">{error}</div>
                </div>
            </DefaultLayout>
        );
    }

    const filteredStaff = staff.filter(member => 
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.isHeadCoach ? 'Head Coach' : 'Coach').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Staff" />
                <ToastContainer />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                            <div className="flex items-center gap-4">
                                <Link 
                                    href="/staff/new"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                    Add New Staff
                                </Link>
                                {selectedStaff.length > 0 && (
                                    <button
                                        disabled={isDeleting}
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-2 rounded bg-danger py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
                                    >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                fill=""
                                            />
                                        </svg>
                                        Delete Selected ({selectedStaff.length})
                                    </button>
                                )}
                            </div>

                            <div className="search relative">
                                <input
                                    type="text"
                                    placeholder="Search staff..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <button className="absolute left-2 top-1/2 -translate-y-1/2">
                                    <svg
                                        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                            fill=""
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-5">
                            <StaffTable
                                staff={filteredStaff}
                                selectedStaff={selectedStaff}
                                onSelectAll={handleSelectAll}
                                onSelectStaff={handleSelectStaff}
                                onDeleteStaff={handleDeleteStaff}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default StaffPage;