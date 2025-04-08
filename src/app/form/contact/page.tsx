"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import {useEffect, useState} from "react";
import { api } from "@/lib/api";
import ContactFormControls from "@/components/pages/contact-form/ContactFormControls";
import ContactFormTable from "@/components/pages/contact-form/ContactFormTable";
import {ContactMessage} from "@/interfaces/ContactMessage";
import {apiJson} from "@/lib/apiJson";
import {toast, ToastContainer} from "react-toastify";

const Page = () => {

    const [contactData, setContactData] = useState<ContactMessage[]>([]); // State to store user data
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch users using the `api.get` method
    useEffect(() => {
        const fetchContactFormData = async () => {
            setLoading(true);
            setError(null); // Reset error

            try {
                const data = await api.get("/contact"); // Call the get API endpoint
                setContactData(data); // Update the users state with the fetched data
            } catch (err: any) {
                console.error("Error fetching users:", err.message);
                setError(err.message || "Failed to load users."); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchContactFormData();
    }, []);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        debugger;
        if (e.target.checked) {
            setSelectedUsers(contactData.map((contactMessage) => contactMessage.id));
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

    const deleteContactMessage = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await api.delete(`/contact/${id}`,);
            // If `response` is falsy or indicates a failure, throw an error
            if (!response) {
                throw new Error("Failed to delete contact message.");
                toast.error('Failed to delete contact message.');
            } else{
                toast.success('Deleted!');
                setContactData(contactData.filter((contactMessage) => contactMessage.id !== id)); // Remove from state
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Create Gallery Category Error:", err);
        } finally {
            setLoading(false);
        }

    }

    const bulkDelete = async (e: React.MouseEvent<HTMLButtonElement>, action: any) => {
        if (action !== 'delete') {
            return;
        }
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            // Wrap the selectedUsers in the 'data' field to be sent in the body
            const response = await apiJson.delete('/contact/bulk-delete', selectedUsers);

            if (!response) {
                throw new Error("Failed to delete contact messages.");
            } else {
                toast.success('Deleted!');
                // Filter out the deleted contacts from state
                setContactData(contactData.filter((contactMessage) => !selectedUsers.includes(contactMessage.id)));
                setSelectedUsers([]);
            }
        } catch (err: any) {
            console.log(err);
            setError(err.message || "Something went wrong.");
            console.error("Bulk delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = contactData.filter(
        (contactMessage) =>
            contactMessage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contactMessage.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contactMessage.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contactMessage.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contactMessage.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <ToastContainer position={'bottom-right'}/>
            <div>
                <Breadcrumb pageName="Contact form" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <ContactFormControls
                            searchTerm={searchTerm}
                            bulkDelete={bulkDelete}
                            onSearchChange={handleSearchChange}
                        />
                        <ContactFormTable
                            contactData={filteredUsers}
                            selectedUsers={selectedUsers}
                            onSelectAll={handleSelectAll}
                            onSelectContact={handleSelectUser}
                            onDeleteContactMessage={deleteContactMessage}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Page;
