'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import { api } from "@/lib/api";
import { Gender, JoinUs } from "@/interfaces/JoinUs";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { apiJson } from "@/lib/apiJson";
import { Event } from "@/interfaces/Event";

const defaultJoinUsMessage: JoinUs = {
    email: '',
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

const JoinUsEntryPage = () => {
    const router = useRouter();
    const params = useParams();
    const joinUsId = Number(params.id);
    const [formData, setFormData] = useState<JoinUs>(defaultJoinUsMessage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [joinUsPage, eventsList] = await Promise.all([
                    api.get(`/join-us/${joinUsId}`),
                    api.get('/events')
                ]);
                
                const formattedData = {
                    ...joinUsPage,
                    birthDate: joinUsPage.birthDate ? new Date(joinUsPage.birthDate) : null,
                };
                setFormData(formattedData);
                setEvents(eventsList);
            } catch (err: any) {
                console.error("Error fetching data:", err.message);
                setError(err.message || "Failed to load data.");
                toast.error(err.message || "Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [joinUsId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiJson.post('/join-us/', formData);
            console.log(response);
            toast.success('Saved!');
            router.push('/form/join-us');
        } catch (err: any) {
            setError(err.message || "An error occurred while submitting the form.");
            toast.error(err.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DefaultLayout>
            <ToastContainer position={'bottom-right'} />
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Join Us Entry" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Entry Details
                        </h3>
                    </div>
                    <div className="p-6.5">
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
                                    onKeyDown={(e) => e.preventDefault()}
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
                                    Event
                                </label>
                                <select
                                    value={formData.eventId || ''}
                                    onChange={(e) => setFormData({ ...formData, eventId: Number(e.target.value) })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="">Select an event</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/form/join-us')}
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default JoinUsEntryPage;
