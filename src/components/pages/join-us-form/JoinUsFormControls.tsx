import React, { MouseEventHandler, useState } from "react";

interface JoinUsFormControlsProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    bulkDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: string) => void;
}

const JoinUsControls: React.FC<JoinUsFormControlsProps> = ({ searchTerm, onSearchChange, bulkDelete }) => {
    const [bulkAction, setBulkAction] = useState('');

    const handleChange = (e: any) => {
        if (e.target.value) {
            setBulkAction(e.target.value);
            console.log(bulkAction);
        }
    }

    return (
        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex flex-row items-center">
                    <select
                        onChange={handleChange}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        defaultValue=""
                    >
                        <option value="">Bulk Actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <button onClick={(e) => bulkDelete(e, bulkAction)} className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium text-black hover:bg-opacity-90 dark:text-white">
                        Apply
                    </button>
                </div>
            </div>

            <div className="relative inline-flex">
                <input
                    type="text"
                    placeholder="Search join us entries..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
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

export default JoinUsControls;
