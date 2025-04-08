"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {User} from "@/interfaces/User";
import {api} from "@/lib/api";
import {load} from "signal-exit";
import {UserRole} from "@/interfaces/UserRole";

const EditUserPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = Number(params.id);
    const [userImage, setUserImage] = useState<File | null>(null);
    const [formData, setFormData] = useState<User>({
        name: '',
        email: '',
        role: UserRole.User, // Replace with your actual role enum values
        bio: undefined,
        expertise: undefined,
        password: '',
        contactInfo: undefined,
        image: undefined,
        imageId: undefined,
        imageUrl: undefined,
        newPassword: undefined
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch users using the `api.get` method
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                return;
            }
            setLoading(true);
            setError(null); // Reset error

            try {
                const data = await api.get(`/users/${userId}`); // Call the get API endpoint
                console.log(data);
                setFormData(data); // Update the users state with the fetched data
            } catch (err: any) {
                console.error("Error fetching users:", err.message);
                setError(err.message || "Failed to load users."); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // router.push('/users');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prevData) => ({ ...prevData, image: null, imageId: undefined, imageUrl: undefined }));
            const file = e.target.files[0];
            console.log(file);
            setUserImage(e.target.files[0]);

            // Create a FileReader to generate a preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    image: {
                        url: reader.result as string
                    }, // Update the imageUrl field
                }));
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const saveChanges = async () => {
       if (!userId) {
           save();
       } else {
           edit();
       }
    }

    const edit = async ()=> {
        try {
            let newData = formData;
            newData.image = userImage;

            const data = await api.patch(`/users/${userId}`, newData); // Call the get API endpoint
            setFormData(data); // Update the users state with the fetched data
            router.push('/users');
        } catch (err: any) {
            console.error("Error fetching users:", err.message);
            setError(err.message || "Failed to load users."); // Set error state
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const save = async () => {
        try {
            let newData = formData;
            newData.image = userImage;

            const data = await api.post(`/users`, newData); // Call the get API endpoint
            setFormData(data); // Update the users state with the fetched data
            router.push('/users');
        } catch (err: any) {
            console.error("Error fetching users:", err.message);
            setError(err.message || "Failed to load users."); // Set error state
        } finally {
            setLoading(false); // Stop loading
        }
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Edit User" />

                {
                    !loading && (
                        <div className="grid grid-cols-5 gap-8">
                            <div className="col-span-5 xl:col-span-3">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                                        <h3 className="font-medium text-black dark:text-white">
                                            User Information
                                        </h3>
                                    </div>
                                    <div className="p-7">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                                <div className="w-full">
                                                    <label
                                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                        htmlFor="fullName"
                                                    >
                                                        Full Name
                                                    </label>
                                                    <input
                                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        type="text"
                                                        name="fullName"
                                                        id="fullName"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                            </div>


                                            <div className="mb-5.5">
                                                <label
                                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                    htmlFor="email"
                                                >
                                                    Email Address
                                                </label>
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>

                                            {
                                                userId ? (
                                                    <div className="mb-5.5">
                                                        <label
                                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                            htmlFor="email"
                                                        >
                                                            Password
                                                        </label>
                                                        <input
                                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                            type="text"
                                                            name="newPassword"
                                                            id="newPassword"
                                                            value={formData.newPassword}
                                                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="mb-5.5">
                                                        <label
                                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                            htmlFor="email"
                                                        >
                                                            Password
                                                        </label>
                                                        <input
                                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                            type="text"
                                                            name="password"
                                                            id="password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                        />
                                                    </div>
                                                )
                                            }


                                            <div className="mb-5.5">
                                                <label
                                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                    htmlFor="role"
                                                >
                                                    Role
                                                </label>
                                                <select
                                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    name="role"
                                                    id="role"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as unknown as UserRole })}
                                                >
                                                    <option value={UserRole.SuperAdmin}>SuperAdmin</option>
                                                    <option value={UserRole.Admin}>Admin</option>
                                                    <option value={UserRole.User}>User</option>
                                                </select>
                                            </div>

                                            <div className="mb-5.5">
                                                <label
                                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                    htmlFor="bio"
                                                >
                                                    BIO
                                                </label>
                                                <textarea
                                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    name="bio"
                                                    id="bio"
                                                    rows={6}
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                                ></textarea>
                                            </div>

                                            <div className="flex justify-end gap-4.5">
                                                <button
                                                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                                    type="button"
                                                    onClick={() => router.push('/users')}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveChanges}
                                                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                                    type="submit"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-5 xl:col-span-2">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                                        <h3 className="font-medium text-black dark:text-white">
                                            User Photo
                                        </h3>
                                    </div>
                                    <div className="p-7">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="h-14 w-14 rounded-full">
                                                {
                                                    formData.image ? (
                                                        <Image
                                                            src={formData.image.url}
                                                            width={56}
                                                            height={56}
                                                            alt="User"
                                                            className="rounded-full h-14 w-14"
                                                        />
                                                    ): (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 100 100"
                                                            width="56"
                                                            height="56"
                                                            fill="none"
                                                        >
                                                            <circle cx="50" cy="50" r="50" fill="#E0E0E0" />
                                                            <circle cx="50" cy="40" r="20" fill="#BDBDBD" />
                                                            <ellipse cx="50" cy="70" rx="25" ry="15" fill="#BDBDBD" />
                                                        </svg>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                {
                                                    formData.image && (
                                                        <button
                                                            onClick={() => setFormData((prevData) => ({ ...prevData, image: null, imageId: undefined, imageUrl: undefined }))}
                                                            className="mb-1.5 text-red-600 dark:text-white"
                                                        >
                                                            Remove photo
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div
                                            id="FileUpload"
                                            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                        />
                      </svg>
                    </span>
                                                <p>
                                                    <span className="text-primary">Click to upload</span> or
                                                    drag and drop
                                                </p>
                                                <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                                <p>(max, 800 X 800px)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </DefaultLayout>
    );
};

export default EditUserPage;