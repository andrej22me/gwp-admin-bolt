"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {Media} from "@/interfaces/Media";
import {undefined} from "zod";
import {api} from "@/lib/api";
import { apiJson } from "@/lib/apiJson";

const EditMediaPage = () => {
    const params = useParams();
    const router = useRouter();
    const mediaId = Number(params.id);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [formData, setFormData] = useState<Media>({
        uploadedBy: "",
        caption: "",
        description: "",
        dimensions: null,
        fileType: "",
        id: 0,
        size: "",
        thumbnail: "",
        title: "",
        url: ""
    });

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await api.get(`/media/${mediaId}`);
                setFormData(data);
            } catch (err: any) {
                console.error("Error fetching media:", err.message);
                setError(err.message || "Failed to load media.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        const data = {
            title: formData.title,
            caption: formData.caption,
            description: formData.description,
        }

        try {
            await apiJson.patch(`/media/${mediaId}`, data);
            setSuccessMessage('Media updated successfully');
            setTimeout(() => {
                router.push('/media');
            }, 1500);
        } catch (err: any) {
            console.error("Error updating media:", err.message);
            setError(err.message || "Failed to update media.");
        } finally {
            setSaving(false);
        }
    };

    const renderMediaPreview = () => {
        if (formData.fileType === 'video/mp4') {
            return (
                <div className="relative w-full">
                    <div className="aspect-video w-full bg-gray-100 rounded-sm overflow-hidden">
                        <video
                            ref={videoRef}
                            src={formData.url}
                            className="w-full h-full object-contain"
                            onEnded={handleVideoEnded}
                            controls
                            controlsList="nodownload"
                            preload="metadata"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {formData.fileType}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePlayPause}
                                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-white hover:bg-opacity-90"
                            >
                                {isPlaying ? (
                                    <>
                                        <svg 
                                            className="w-5 h-5 mr-2" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <svg 
                                            className="w-5 h-5 mr-2" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Play
                                    </>
                                )}
                            </button>
                            <a 
                                href={formData.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-6 text-black hover:border-primary hover:text-primary dark:text-white"
                            >
                                <svg 
                                    className="w-5 h-5 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative aspect-video w-full">
                <Image
                    src={formData.url}
                    alt={formData.title}
                    fill
                    className="rounded-sm object-cover"
                />
            </div>
        );
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Edit Media" />

                {error && (
                    <div className="mb-6 rounded-sm border border-[#F87171] bg-[#F87171] py-3 px-4 text-white">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-sm border border-[#34D399] bg-[#34D399] py-3 px-4 text-white">
                        {successMessage}
                    </div>
                )}

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <div className="mb-6">
                                    <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                                        Media Preview
                                    </h4>
                                    {renderMediaPreview()}
                                </div>

                                <div className="mb-6">
                                    <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                                        File Information
                                    </h4>
                                    <div className="rounded-sm border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
                                        <div className="flex flex-col gap-4">
                                            {
                                                formData.user && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-black dark:text-white">Uploaded By:</span>
                                                        <span>{formData.user.name}</span>
                                                    </div>
                                                )
                                            }
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-black dark:text-white">File Name:</span>
                                                <span>{formData.title}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-black dark:text-white">File Type:</span>
                                                <span>{formData.fileType}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-black dark:text-white">File Size:</span>
                                                <span>{formData.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <form onSubmit={handleSubmit}>
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

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            File URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.url}
                                            readOnly
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className={`flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:shadow-1 ${
                                                saving ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push('/media')}
                                            disabled={saving}
                                            className="rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default EditMediaPage;