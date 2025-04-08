"use client";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { ToastContainer, toast } from 'react-toastify';
import {useEffect, useState} from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EditPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        heroImage: {
            url: ""
        },
        slug: '',
        sections: [],
        seoTitle: '',
        seoDescription: ''
    });

    const [heroImage, setHeroImage] =  useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const contactPage = await api.get("/pages/testimonials");

                setFormData(contactPage);
            } catch (err: any) {
                console.error("Error fetching data:", err.message);
                setError(err.message || "Failed to load data.");
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

        const contactPageData = {
            title: formData.title,
            heroImage: heroImage,
            slug: formData.slug,
            sections: JSON.stringify(formData.sections),
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription
        };

        try {
            // Assuming you have an endpoint to create or update the page
            const response = await api.patch("/pages/testimonials", contactPageData); // Adjust the endpoint as per your backend
            setFormData(response);
            toast.success("Saved!")
        } catch (err: any) {
            setError(err.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData( {
                ...formData,
                heroImage: {
                    url: ''
                }
            })
            setHeroImage(file);

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DefaultLayout>
            <ToastContainer />
            <div className="mx-auto max-w-270">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Testimonials</h1>
                {error && <p className="text-red-600">{error}</p>}

                <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
                    {/* Title on Left */}
                    <div className="col-span-3 p-7 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5.5">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="title"
                                >
                                    Title
                                </label>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="button"
                                    onClick={() => router.push("/pages")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Hero Image on Right */}
                    <div
                        className="col-span-2 flex flex-col items-center p-7 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="mb-5.5 w-full text-center">
                            {
                                formData && formData.heroImage && (
                                    <img src={formData.heroImage.url}/>
                                )
                            }
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="heroImage"
                            >
                                Hero Image
                            </label>
                            <div
                                className="relative block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                                id="FileUpload"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    {imagePreviewUrl ? (
                                        <Image
                                            src={imagePreviewUrl}
                                            alt="Image preview"
                                            width={100}
                                            height={100}
                                            className="w-24 h-24 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-primary">Click to upload or drag and drop</p>
                                    )}
                                    <p className="mt-1.5">Supported: PNG, JPG</p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 w-full">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                SEO Title
                            </label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                value={formData.seoTitle || ""}
                                onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}

                            />
                        </div>
                        <div className="mb-5.5 w-full">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                SEO Description
                            </label>
                            <textarea
                                rows={5}
                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                value={formData.seoDescription || ""}
                                onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default EditPage;
