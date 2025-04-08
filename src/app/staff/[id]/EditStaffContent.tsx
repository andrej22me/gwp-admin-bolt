'use client';

import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import StaffForm from "@/components/pages/staff/StaffForm";
import { Staff } from "@/interfaces/Staff";
import { apiJson } from "@/lib/apiJson";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditStaffContentProps {
    id: string;
}

export default function EditStaffContent({ id }: EditStaffContentProps) {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await apiJson.get(`/staff/${id}`);
                setStaff(response);
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch staff member");
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [id]);

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            </DefaultLayout>
        );
    }

    if (!staff) {
        return (
            <DefaultLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-danger">Staff member not found</div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Edit Staff Member" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <StaffForm initialData={staff} staffId={parseInt(id)} />
            </div>
        </DefaultLayout>
    );
}
