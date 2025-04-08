"use client";

import { Staff } from "@/interfaces/Staff";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiJson } from "@/lib/apiJson";
import Image from "next/image";
import { api } from "@/lib/api";

interface StaffFormProps {
    initialData?: Staff;
    staffId?: number;
}

const StaffForm = ({ initialData, staffId }: StaffFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Staff>(
        initialData || {
            name: "",
            bio: "",
            certifications: "",
            expertise: "",
            email: "",
            phoneNumber: "",
            schedule: "",
            hierarchy: "",
            featured: false,
            isHeadCoach: false,
        }
    );
    const [staffImage, setStaffImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
        initialData?.staffImage?.url || null
    );

    useEffect(() => {
        if (initialData?.staffImage?.url) {
            setImagePreviewUrl(initialData.staffImage.url);
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setStaffImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        debugger;
        e.preventDefault();
        try {
            let staffImageId = formData.staffImageId;

            if (staffImage) {
                const formData = new FormData();

                const mediaResponse = await api.post('/media/upload-multiple', {
                    files: [{ binary: staffImage }]
                });
            
                if (mediaResponse && mediaResponse.length > 0) {
                    staffImageId = mediaResponse[0].id;
                }
            }

            debugger;

            const staffData = {
                ...formData,
                staffImageId
            };

            if (staffId) {
                await apiJson.patch(`/staff/${staffId}`, staffData);
                toast.success("Staff member updated successfully");
            } else {
                await apiJson.post("/staff", staffData);
                toast.success("Staff member created successfully");
            }
            router.push("/staff");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    return (
        <div className="p-7">
            <form onSubmit={handleSubmit}>
                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="staffImage"
                    >
                        Staff Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    />
                    {imagePreviewUrl && (
                        <div className="mt-4">
                            <Image
                                src={imagePreviewUrl}
                                alt="Staff preview"
                                width={200}
                                height={200}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    )}
                </div>

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
                            required
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

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                    >
                        Phone Number
                    </label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                </div>

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="expertise"
                    >
                        Expertise
                    </label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="expertise"
                        id="expertise"
                        value={formData.expertise}
                        onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                    />
                </div>

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="certifications"
                    >
                        Certifications
                    </label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="certifications"
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    />
                </div>

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="schedule"
                    >
                        Schedule
                    </label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="schedule"
                        id="schedule"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    />
                </div>

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="hierarchy"
                    >
                        Hierarchy
                    </label>
                    <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="hierarchy"
                        id="hierarchy"
                        value={formData.hierarchy}
                        onChange={(e) => setFormData({...formData, hierarchy: e.target.value})}
                    />
                </div>

                <div className="mb-5.5">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="bio"
                    >
                        Bio
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

                <div className="mb-5.5 flex items-center gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                            className="mr-2"
                        />
                        <label htmlFor="featured">Featured Staff</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isHeadCoach"
                            checked={formData.isHeadCoach}
                            onChange={(e) => setFormData({...formData, isHeadCoach: e.target.checked})}
                            className="mr-2"
                        />
                        <label htmlFor="isHeadCoach">Head Coach</label>
                    </div>
                </div>

                <div className="flex justify-end gap-4.5">
                    <button
                        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button"
                        onClick={() => router.push('/staff')}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                        type="submit"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StaffForm;
