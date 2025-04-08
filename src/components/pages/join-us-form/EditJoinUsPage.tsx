'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { JoinUs } from "@/interfaces/JoinUs";
import JoinUsControls from "./JoinUsFormControls";
import JoinUsFormTable from "./JoinUsFormTable";
import { api } from "@/lib/api";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { apiJson } from "@/lib/apiJson";

const EditJoinUsPage: React.FC = () => {
    const [joinUsData, setJoinUsData] = useState<JoinUs[]>([]);
    const [selectedJoinMessages, setselectedJoinMessages] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    // const router = useRouter();

    useEffect(() => {
        fetchJoinUsData();
    }, []);

    const fetchJoinUsData = async () => {
        try {
            const response = await api.get("/join-us");
            setJoinUsData(response);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching join us data:", error);
            toast.error("Failed to fetch join us data");
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setselectedJoinMessages(joinUsData.map((item) => item.id));
        } else {
            setselectedJoinMessages([]);
        }
    };

    const handleSelectUser = (userId: number) => {
        if (selectedJoinMessages.includes(userId)) {
            setselectedJoinMessages(selectedJoinMessages.filter((id) => id !== userId));
        } else {
            setselectedJoinMessages([...selectedJoinMessages, userId]);
        }
    };

    const handleBulkDelete = async (e: React.MouseEvent<HTMLButtonElement>, action: string) => {
        e.preventDefault();
        if (action === "delete" && selectedJoinMessages.length > 0) {
            try {
                await apiJson.post("/join-us/bulk-delete", { ids: selectedJoinMessages });
                toast.success("Selected entries deleted successfully");
                fetchJoinUsData();
                setselectedJoinMessages([]);
            } catch (error) {
                console.error("Error deleting entries:", error);
                toast.error("Failed to delete selected entries");
            }
        }
    };

    const handleDeleteJoinUsMessage = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault();
        try {
            await api.delete(`/join-us/${id}`);
            toast.success("Entry deleted successfully");
            fetchJoinUsData();
        } catch (error) {
            console.error("Error deleting entry:", error);
            toast.error("Failed to delete entry");
        }
    };

    const filteredData = joinUsData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Join Us Form Entries
                    </h3>
                </div>
                <div className="p-6.5">
                    <JoinUsControls
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        bulkDelete={handleBulkDelete}
                    />
                    <JoinUsFormTable
                        joinUsData={filteredData}
                        selectedJoinMessages={selectedJoinMessages}
                        onSelectAll={handleSelectAll}
                        onSelectUser={handleSelectUser}
                        onDeleteJoinUsMessage={handleDeleteJoinUsMessage}
                    />
                </div>
            </div>
        </>
    );
};

export default EditJoinUsPage;
