import React, {MouseEventHandler, useState} from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/config";

interface UsersControlsProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    bulkDelete: (e: React.MouseEvent<HTMLButtonElement>, action: any) => void;
}

const UsersControls: React.FC<UsersControlsProps> = ({ searchTerm, onSearchChange, bulkDelete }) => {
    const [bulkAction, setBulkAction] = useState('');
    const [exporting, setExporting] = useState(false);

    const handleChange = (e: any) => {
        if (e.target.value) {
            setBulkAction(e.target.value);
            console.log(bulkAction);
        }
    }

    const handleExport = async () => {
        try {
            setExporting(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/contact/export`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `contact-forms-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            toast.success('Export completed successfully');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export contact forms');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex flex-row items-center">
                    <select
                        onChange={handleChange}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        defaultValue=""
                    >
                        <option value="">Bulk Actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <button 
                        onClick={(e) => bulkDelete(e, bulkAction)} 
                        className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90"
                    >
                        Apply
                    </button>
                </div>
                <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="ml-2 inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {exporting ? 'Exporting...' : 'Export CSV'}
                    </button>
            </div>

            <div className="relative inline-flex">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e)}
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
    );
};

export default UsersControls;
