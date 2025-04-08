'use client';

import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import StaffForm from "@/components/pages/staff/StaffForm";
import { Staff } from "@/interfaces/Staff";
import { apiJson } from "@/lib/apiJson";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export default function EditStaffPage() {
    const params = useParams();
    const id = params?.id as string;
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
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Edit Staff Member" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Edit Staff Member
                        </h3>
                    </div>
                    <StaffForm initialData={staff} staffId={parseInt(id)} />
                </div>
            </div>
        </DefaultLayout>
    );
}