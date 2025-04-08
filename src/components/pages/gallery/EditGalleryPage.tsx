"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiJson } from "@/lib/apiJson";
import { Media } from "@/interfaces/Media";
import { GalleryCategory } from "@/interfaces/GalleryCategory";
import { Gallery } from "@/interfaces/Gallery";
import { GalleryType } from "@/interfaces/GalleryType";
import { EventCategory } from "@/interfaces/Event";

const initialGalleryState: Gallery & { selectedImages: number[] } = {
    id: 0,
    title: "",
    eventYear: new Date().getFullYear(),
    season: "",
    type: GalleryType.PHOTO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: EventCategory.INDIVIDUAL,
    eventId: undefined,
    Event: undefined,
    media: [],
    selectedImages: [],
};

const EditGalleryPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(initialGalleryState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [media, setMedia] = useState<Media[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [mediaResponse] = await Promise.all([
                    apiJson.get("/media"),
                ]);

                // Convert EventCategory enum to gallery categories array
                const galleryCategories = Object.values(EventCategory).map((category, index) => ({
                    id: index + 1,
                    name: category
                }));

                setCategories(galleryCategories);
                setMedia(mediaResponse);
                console.log(media);
            } catch (err: any) {
                console.error("Error fetching data:", err.message);
                setError(err.message || "Failed to load data.");
                alert("Failed to load data: " + (err.message || "Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title) {
            alert("Title is required");
            return;
        }

        if (!formData.category) {
            alert("Category is required");
            return;
        }

        if (formData.selectedImages.length === 0) {
            alert("Please select at least one image");
            return;
        }

        setIsSubmitting(true);

        try {
            const galleryData = {
                title: formData.title,
                category: formData.category,
                season: formData.season,
                type: formData.type,
                eventYear: formData.eventYear,
                mediaIds: formData.selectedImages
            };

            await apiJson.post("/galleries", galleryData);
            alert("Gallery created successfully");
            router.push("/gallery");
        } catch (error: any) {
            console.error("Error creating gallery:", error);
            alert("Failed to create gallery: " + (error.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleImageSelection = (imageId: number) => {
        setFormData((prev) => ({
            ...prev,
            selectedImages: prev.selectedImages.includes(imageId)
                ? prev.selectedImages.filter((id) => id !== imageId)
                : [...prev.selectedImages, imageId],
        }));
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    <div className="flex items-center justify-center h-48">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (error) {
        return (
            <DefaultLayout>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    <div className="flex items-center justify-center h-48">
                        <p className="text-meta-1">{error}</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Create New Album" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-sm border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
                                        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                                            Album Information
                                        </h3>

                                        {/* Title */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                                Title <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, title: e.target.value })
                                                }
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                                Category <span className="text-meta-1">*</span>
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        category: e.target.value as string,
                                                    })
                                                }
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Season */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                                Season
                                            </label>
                                            <input
                                                type="text"
                                                name="season"
                                                value={formData.season}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, season: e.target.value })
                                                }
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </div>

                                        {/* Gallery Type */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                                Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        type: e.target.value as GalleryType,
                                                    })
                                                }
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            >
                                                {Object.values(GalleryType).map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Event Year */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                                Event Year
                                            </label>
                                            <input
                                                type="number"
                                                name="eventYear"
                                                value={formData.eventYear}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        eventYear: parseInt(e.target.value, 10),
                                                    })
                                                }
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Media Selection */}
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-sm border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
                                        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                                            Select Images <span className="text-meta-1">*</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {media
                                                .filter(item => 
                                                    formData.type === GalleryType.VIDEO 
                                                        ? item.fileType.includes('video/')
                                                        : !item.fileType.includes('video/')
                                                )
                                                .map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleImageSelection(item.id)}
                                                    className={`relative cursor-pointer rounded-sm border-4 ${
                                                        formData.selectedImages.includes(item.id)
                                                            ? "border-primary"
                                                            : "border-stroke dark:border-strokedark"
                                                    }`}
                                                >
                                                    <div className="relative aspect-[4/3]">
                                                        {item.fileType.includes('video/') ? (
                                                            <video
                                                                src={item.url}
                                                                className="h-full w-full rounded-sm object-cover"
                                                                preload="metadata"
                                                                playsInline
                                                                muted
                                                                controls={false}
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={item.preview || ''}
                                                                alt={item.title}
                                                                fill
                                                                className="rounded-sm object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push("/gallery")}
                                    className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                                >
                                    {isSubmitting ? "Creating..." : "Create Album"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default EditGalleryPage;
