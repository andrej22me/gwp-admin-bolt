'use client';
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import { Gender, Newsletter } from "@/interfaces/Newsletter";
import { apiJson } from "@/lib/apiJson";

const defaultNewsletterMessage: Newsletter = {
    email: '',
    message: '',
    name: '',
    phone: '',
    club: '',
    gender: Gender.Male,
    birthDate: new Date(),
    id: 0,
    highSchool: '',
    cityCountry: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
};

const EditNewsletterPage = () => {
    const router = useRouter();
    const params = useParams();
    const newsletterId = Number(params.id);
    const [formData, setFormData] = useState<Newsletter>(defaultNewsletterMessage);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const newsletterPage = await api.get(`/newsletter/${newsletterId}`);
                const formattedData = {
                    ...newsletterPage,
                    birthDate: newsletterPage.birthDate ? new Date(newsletterPage.birthDate) : null,
                };
                setFormData(formattedData);

            } catch (err: any) {
                console.error("Error fetching data:", err.message);
                setError(err.message || "Failed to load data.");
                toast.error(err.message || "Failed to load data.");
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
            const response = await apiJson.patch(`/newsletter/${newsletterId}`, formData);
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
            <ToastContainer position={'bottom-right'} />
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Newsletter Message" />

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
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Club / Team
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter club/team"
                                    value={formData.club}
                                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    High School
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter high school"
                                    value={formData.highSchool}
                                    onChange={(e) => setFormData({ ...formData, highSchool: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {/* Gender Dropdown */}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Gender
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value={Gender.Male}>Male</option>
                                    <option value={Gender.Female}>Female</option>
                                </select>
                            </div>

                            {/* Birth Date Input */}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Birth Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData({ ...formData, birthDate: new Date(e.target.value) })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Parent's Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter parent's name"
                                    value={formData.parentName}
                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Parent's Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter parent's phone number"
                                    value={formData.parentPhone}
                                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Parent's Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter parent's email"
                                    value={formData.parentEmail}
                                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/form/newsletter')}
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

export default EditNewsletterPage;
