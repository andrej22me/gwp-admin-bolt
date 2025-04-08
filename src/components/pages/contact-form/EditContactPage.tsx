"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {api} from "@/lib/api";
import {toast, ToastContainer} from "react-toastify";
import {ContactMessage} from "@/interfaces/ContactMessage";
import {apiJson} from "@/lib/apiJson";

const defaultContactMessage = {
    id: 0,
    email: '',
    message: '',
    name: '',
    phone: '',
    subject: '',
};

const EditContactPage = () => {

    const router = useRouter();
    const params = useParams();
    const contactMessageId = Number(params.id);
    const [formData, setFormData] = useState<ContactMessage>(defaultContactMessage);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const contactPage = await api.get(`/contact/${contactMessageId}`);
                setFormData(contactPage);
            } catch (err: any) {
                console.error("Error fetching data:", err.message);
                setError(err.message || "Failed to load data.");
                toast.success(err.message || "Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Assuming you have an endpoint to create or update the page
            const response = await apiJson.patch(`/contact/${contactMessageId}`, formData); // Adjust the endpoint as per your backend
            console.log(response);
            toast.success('Saved!');
        } catch (err: any) {
            setError(err.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <ToastContainer position={'bottom-right'}/>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Contact Message" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Phone number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Enter message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>


                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/form/contact')}
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default EditContactPage;