"use client";
import React from "react";
import { Staff } from "@/interfaces/Staff";
import Link from "next/link";

interface StaffTableProps {
    staff: Staff[];
    selectedStaff: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectStaff: (staffId: number) => void;
    onDeleteStaff: (e: React.MouseEvent<HTMLButtonElement>, staffId: number) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
    staff,
    selectedStaff,
    onSelectAll,
    onSelectStaff,
    onDeleteStaff
}) => {
    // Filter staff with valid IDs first
    const validStaff = staff.filter((member): member is Staff & { id: number } => 
        typeof member.id === 'number'
    );

    const allSelectableStaffSelected = validStaff.length > 0 && 
        validStaff.every(member => selectedStaff.includes(member.id));

    return (
        <div className="mt-5 overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <input
                                type="checkbox"
                                onChange={onSelectAll}
                                checked={allSelectableStaffSelected}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                            />
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {validStaff.map((member) => (
                        <tr key={member.id}>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <input
                                    type="checkbox"
                                    checked={selectedStaff.includes(member.id)}
                                    onChange={() => onSelectStaff(member.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative group">
                                <Link href={`/staff/${member.id}`} className="text-primary dark:text-white">
                                    {member.name}
                                </Link>
                                <button
                                    onClick={(e) => onDeleteStaff(e, member.id)}
                                    className="text-xs text-red-600 hidden group-hover:block cursor-pointer absolute bottom-1 left-4"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black">{member.email || 'N/A'}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{member.isHeadCoach ? 'Head Coach' : 'Coach'}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffTable;
