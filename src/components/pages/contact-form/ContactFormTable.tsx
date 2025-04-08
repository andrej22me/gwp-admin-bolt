import React from "react";
import Image from "next/image";
import {User} from "@/interfaces/User";
import Link from "next/link";
import {ContactMessage} from "@/interfaces/ContactMessage";

interface ContactFormTableProps {
    contactData: ContactMessage[];
    selectedUsers: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectContact: (userId: number) => void;
    onDeleteContactMessage: (e: React.MouseEvent<HTMLButtonElement>, userId: number) => void;
}

const ContactFormTable: React.FC<ContactFormTableProps> = ({
                                                   contactData,
                                                   selectedUsers,
                                                   onSelectAll,
                                                   onSelectContact,
                                                   onDeleteContactMessage
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
                            checked={selectedUsers.length === contactData.length}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                        />
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Subject</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Phone number</th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">Message</th>
                </tr>
                </thead>
                <tbody>
                {contactData.map((contactMessage) => (
                    <tr key={contactMessage.id} className="group relative">
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(contactMessage.id)}
                                onChange={() => onSelectContact(contactMessage.id)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                            />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <Link href={`/form/contact/${contactMessage.id}`}
                                  className="text-primary dark:text-white block">{contactMessage.name}</Link>
                            <button onClick={(e) => onDeleteContactMessage(e, contactMessage.id)} className="text-xs text-red hidden group-hover:block cursor-pointer absolute bottom-1">Delete</button>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black">{contactMessage.email}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{contactMessage.subject}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{contactMessage.phone}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white w-60 truncate overflow-hidden">{contactMessage.message}</p>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactFormTable;
