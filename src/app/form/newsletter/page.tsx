'use client';

import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import NewsletterFormControls from "@/components/pages/newsletter-form/NewsLetterFormControls";
import NewsletterFormTable from "@/components/pages/newsletter-form/NewsLetterFormTable";
import { Newsletter } from "@/interfaces/Newsletter";
import { apiJson } from "@/lib/apiJson";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
    const [newsletterData, setNewsletterData] = useState<Newsletter[]>([]); // State to store user data
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch newsletter data using the `api.get` method
    useEffect(() => {
        const fetchNewsletterData = async () => {
            setLoading(true);
            setError(null); // Reset error

            try {
                const data = await api.get("/newsletter"); // Call the get API endpoint for newsletter
                setNewsletterData(data); // Update the state with the fetched data
            } catch (err: any) {
                console.error("Error fetching newsletter data:", err.message);
                setError(err.message || "Failed to load newsletter data."); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchNewsletterData();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUsers(newsletterData.map((newsletterMessage) => newsletterMessage.id));
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const deleteNewsletterMessage = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault(); // Make sure to call `e.preventDefault()` to prevent default button behavior

        setLoading(true);
        setError(null);

        try {
            const response = await api.delete(`/newsletter/${id}`);
            if (!response) {
                throw new Error("Failed to delete newsletter message.");
                toast.error('Failed to delete newsletter message.');
            } else {
                toast.success('Deleted!');
                setNewsletterData(newsletterData.filter((newsletterMessage) => newsletterMessage.id !== id)); // Remove from state
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Delete newsletter message error:", err);
        } finally {
            setLoading(false);
        }
    };


    const bulkDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: string) => {
        if (action !== 'delete') {
            return;
        }
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await apiJson.delete('/newsletter/bulk-delete', selectedUsers);

            if (!response) {
                throw new Error("Failed to delete newsletter messages.");
            } else {
                toast.success('Deleted!');
                setNewsletterData(newsletterData.filter((newsletterMessage) => !selectedUsers.includes(newsletterMessage.id)));
                setSelectedUsers([]);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Bulk delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = newsletterData.filter(
        (newsletterMessage) =>
            newsletterMessage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletterMessage.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletterMessage.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletterMessage.highSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletterMessage.cityCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletterMessage.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <ToastContainer position={'bottom-right'} />
            <div>
                <Breadcrumb pageName="Newsletter Submissions" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <NewsletterFormControls
                            searchTerm={searchTerm}
                            bulkDelete={bulkDelete}
                            onSearchChange={handleSearchChange}
                        />
                        <NewsletterFormTable
                            newsletterData={filteredUsers}
                            selectedUsers={selectedUsers}
                            onSelectAll={handleSelectAll}
                            onSelectUser={handleSelectUser}
                            onDeleteNewsletterMessage={deleteNewsletterMessage}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Page;
