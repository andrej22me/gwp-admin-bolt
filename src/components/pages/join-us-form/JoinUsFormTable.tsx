import React from "react";
import Link from "next/link";
import { JoinUs } from "@/interfaces/JoinUs";

interface JoinUsFormTableProps {
    joinUsData: JoinUs[];
    selectedJoinMessages: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectUser: (userId: number) => void;
    onDeleteJoinUsMessage: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

const JoinUsFormTable: React.FC<JoinUsFormTableProps> = ({
    joinUsData,
    selectedJoinMessages,
    onSelectAll,
    onSelectUser,
    onDeleteJoinUsMessage,
}) => {
    return (
        <div className="mt-5 overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <input
                                type="checkbox"
                                onChange={onSelectAll}
                                checked={selectedJoinMessages.length === joinUsData.length}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                            />
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Club</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {joinUsData.map((joinUsMessage) => (
                        <tr key={joinUsMessage.id} className="group relative hover:bg-gray-1 dark:hover:bg-meta-4">
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <input
                                    type="checkbox"
                                    checked={selectedJoinMessages.includes(joinUsMessage.id)}
                                    onChange={() => onSelectUser(joinUsMessage.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <Link href={`/form/join-us/${joinUsMessage.id}`} className="text-primary dark:text-white block">
                                    {joinUsMessage.name}
                                </Link>
                                <button
                                    onClick={(e) => onDeleteJoinUsMessage(e, joinUsMessage.id)}
                                    className="text-xs text-red-500 hidden group-hover:block cursor-pointer absolute bottom-1"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{joinUsMessage.email}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{joinUsMessage.club}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{joinUsMessage.event?.title}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JoinUsFormTable;
