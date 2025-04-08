"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {useUserStore} from "@/store/useUserStore"; // Assuming you have an API helper

const NewMediaPage = () => {
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        caption: "",
        description: "",
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setFileURL(`/uploads/${file.name}`); // Generate static file URL
        }
    };

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        if (!file || !fileURL) {
            setError("Please select a file to upload.");
            setUploading(false);
            return;
        }

        try {
            const mediaData = {
                title: formData.title,
                caption: formData.caption,
                description: formData.description,
                url: fileURL, // Sending file URL instead of FormData
                thumbnail: fileURL, // Assume same as file for now
                size: `${file.size} bytes`,
                fileType: file.type,
                file: file,
                userId: user ? user.id : null
            };

            const response = await api.post("/media", mediaData); // Send JSON

            if (!response) {
                throw new Error("Failed to upload media.");
            }

            alert("Media uploaded successfully!");
            router.push("/media"); // Redirect to media listing page
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Upload Error:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Upload New Media" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <form onSubmit={handleSubmit}>
                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Upload File
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {/* Caption Input */}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter caption"
                                    value={formData.caption}
                                    onChange={(e) => setFormData({...formData, caption: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            {/* Buttons */}
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/media')}
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewMediaPage;
