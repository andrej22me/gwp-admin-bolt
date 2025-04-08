import React from "react";
import Link from "next/link";
import { Newsletter } from "@/interfaces/Newsletter";

interface NewsletterFormTableProps {
    newsletterData: Newsletter[];
    selectedUsers: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectUser: (userId: number) => void;  // Added here
    onDeleteNewsletterMessage: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}


const NewsletterFormTable: React.FC<NewsletterFormTableProps> = ({
                                                                     newsletterData,
                                                                     selectedUsers,
                                                                     onSelectAll,
                                                                     onSelectUser,
                                                                     onDeleteNewsletterMessage,
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
                            checked={selectedUsers.length === newsletterData.length}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                        />
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Club</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">High School</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Parent's Name</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Parent's Phone</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Message</th>
                </tr>
                </thead>
                <tbody>
                {newsletterData.map((newsletterMessage) => (
                    <tr key={newsletterMessage.id} className="group relative">
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(newsletterMessage.id)}
                                onChange={() => onSelectUser(newsletterMessage.id)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                            />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <Link href={`/form/newsletter/${newsletterMessage.id}`} className="text-primary dark:text-white block">
                                {newsletterMessage.name}
                            </Link>
                            <button
                                onClick={(e) => onDeleteNewsletterMessage(e, newsletterMessage.id)}
                                className="text-xs text-red hidden group-hover:block cursor-pointer absolute bottom-1"
                            >
                                    Delete
                                </button>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black">{newsletterMessage.email}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{newsletterMessage.club}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{newsletterMessage.highSchool}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{newsletterMessage.parentName}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{newsletterMessage.parentPhone}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white w-60 truncate overflow-hidden">{newsletterMessage.message}</p>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default NewsletterFormTable;
