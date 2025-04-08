"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import Image from "next/image";
import {useEffect, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";
import {Media} from "@/interfaces/Media";

interface MediaWithThumbnail extends Media {
    generatedThumbnail?: string;
}

const MediaPage = () => {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [media, setMedia] = useState<MediaWithThumbnail[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [bulkAction, setBulkAction] = useState<"" | "delete" | "download">("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await api.get("/media");
                setMedia(data);
            } catch (err: any) {
                console.error("Error fetching media:", err.message);
                setError(err.message || "Failed to load media.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const validationError = validateFiles(e.target.files);
        if (validationError) {
            setError(validationError);
            e.target.value = '';
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const filesData = await Promise.all(
                Array.from(e.target.files).map(async file => {
                    return {
                        binary: file,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                    };
                })
            );

            const uploadData = {
                files: filesData,
                description: '',
                caption: ''
            };

            await api.post('/media/upload-multiple', uploadData);
            
            const data = await api.get("/media");
            setMedia(data);
        } catch (err: any) {
            console.error("Error uploading files:", err.message);
            setError(err.message || "Failed to upload files.");
        } finally {
            setUploading(false);
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            setError('Please select items to delete');
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await Promise.all(
                selectedItems.map(id => 
                    api.delete(`/media/${id}`)
                )
            );
            
            const data = await api.get("/media");
            setMedia(data);
            setSelectedItems([]); 
            setBulkAction(''); 
        } catch (err: any) {
            console.error("Error deleting media:", err.message);
            setError(err.message || "Failed to delete media items.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkActionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value as "" | "delete" | "download";
        setBulkAction(action);

        if (action === "delete") {
            await handleDelete();
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: number, e?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            e.stopPropagation();
        }

        setSelectedItems(prev => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter(itemId => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.length === media.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(media.map(item => item.id));
        }
    };

    const handleImageClick = (id: number) => {
        if (!isSelectionMode) {
            router.push(`/media/${id}`);
        } else {
            handleSelectItem(id);
        }
    };

    const renderMediaItem = (item: MediaWithThumbnail) => {
        if (item.fileType.includes('video/')) {
            return (
                <div className="relative mb-3 aspect-[4/3] bg-gray-100">
                    <video
                        src={item.url}
                        className="h-full w-full rounded-sm object-cover"
                        preload="metadata"
                        playsInline
                        muted
                        controls={false}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                        Video
                    </div>
                </div>
            );
        }

        return (
            <div className="relative mb-3 aspect-[4/3]">
                <Image
                    src={item.url || '/images/cover/cover-01.png'}
                    alt={item.title}
                    fill
                    className="rounded-sm object-cover"
                />
            </div>
        );
    };

    const validateFiles = (files: FileList): string | null => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.name.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi|wmv)$/i)) {
                return `File "${file.name}" is not allowed. Only image and video files are supported.`;
            }
            if (file.size > 100 * 1024 * 1024 * 1024) { 
                return `File "${file.name}" is too large. Maximum file size is 100GB.`;
            }
        }
        return null;
    };

    const handleItemClick = (itemId: number) => {
        if (bulkAction === "") {
            router.push(`/media/${itemId}`);
        } else {
            handleSelectItem(itemId);
        }
    };

    const handleApplyAction = () => {
        if (bulkAction === "delete") {
            console.log("Deleting items:", selectedItems);
        } else if (bulkAction === "download") {
            console.log("Downloading items:", selectedItems);
        }
        setSelectedItems([]);
        setBulkAction("");
    };

    const filteredItems = media.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Media Library" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">   
                                {isSelectionMode && (
                                    <>
                                        <button
                                            onClick={handleSelectAll}
                                            className="inline-flex items-center justify-center rounded-md border border-stroke py-2.5 px-6 text-center font-medium text-body hover:text-primary"
                                        >
                                            {selectedItems.length === media.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                        
                                        <div className="relative">
                                            <select
                                                value={bulkAction}
                                                onChange={handleBulkActionChange}
                                                className="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-2.5 px-6 text-body font-medium outline-none transition focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                disabled={isDeleting || selectedItems.length === 0}
                                            >
                                                <option value="">Bulk Action</option>
                                                <option value="delete">Delete Selected ({selectedItems.length})</option>
                                            </select>
                                            {isDeleting && (
                                                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                                                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={toggleSelectionMode}
                                    className={`inline-flex items-center justify-center rounded-md py-2.5 px-6 text-center font-medium ${
                                        isSelectionMode 
                                            ? 'bg-primary text-white hover:bg-opacity-90' 
                                            : 'border border-stroke text-body hover:text-primary'
                                    }`}
                                >
                                    {isSelectionMode ? 'Cancel Selection' : 'Select Media'}
                                </button>

                                <div className="relative">
                                    <label htmlFor="fileUpload" className={`inline-flex items-center justify-center rounded-md py-2.5 px-6 text-center font-medium text-white bg-primary hover:bg-opacity-90 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </label>
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.wmv"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="search relative">
                                    <input
                                        type="text"
                                        placeholder="Search media..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2.5 pl-10 pr-4 font-medium outline-none transition focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    <button className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <svg
                                            className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332Z"
                                                fill=""
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                                fill=""
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`inline-flex items-center justify-center rounded-md border border-stroke p-2.5 hover:text-primary ${viewMode === 'grid' ? 'text-primary bg-gray-100' : 'text-body'}`}
                                    >
                                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M5 5h4v4H5V5zm6 0h4v4h-4V5zM5 11h4v4H5v-4zm6 0h4v4h-4v-4z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`inline-flex items-center justify-center rounded-md border border-stroke p-2.5 hover:text-primary ${viewMode === 'list' ? 'text-primary bg-gray-100' : 'text-body'}`}
                                    >
                                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'grid' && !uploading ? (
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {media.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative rounded-sm border bg-white p-4 dark:border-strokedark dark:bg-boxdark ${
                                            isSelectionMode 
                                                ? 'cursor-pointer border-stroke hover:border-primary' 
                                                : 'border-stroke hover:shadow-lg cursor-pointer'
                                        } ${
                                            selectedItems.includes(item.id) 
                                                ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                                                : ''
                                        }`}
                                        onClick={() => isSelectionMode ? handleSelectItem(item.id) : handleImageClick(item.id)}
                                    >
                                        {isSelectionMode && (
                                            <div className="absolute top-2 right-2 z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectItem(item.id, e);
                                                    }}
                                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                                />
                                            </div>
                                        )}
                                        {renderMediaItem(item)}
                                        <h5 className="mb-1 text-sm font-medium text-black dark:text-white break-words">
                                            {item.title}
                                        </h5>
                                        <div className="flex items-center gap-2 text-xs text-body">
                                            <span>{item.fileType}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-body">
                                            <p>{item.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        {bulkAction && (
                                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedItems.length === media.length}
                                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                                />
                                            </th>
                                        )}
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">File</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Type</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Size</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Uploaded By</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleItemClick(item.id)}
                                            style={{ cursor: bulkAction ? 'default' : 'pointer' }}
                                        >
                                            {bulkAction && (
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={(e) => handleSelectItem(item.id, e)}
                                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                                    />
                                                </td>
                                            )}
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-black dark:text-white">{item.title}</p>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{item.fileType}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{item.size}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{item.user?.name}</p>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {error && (
                            <div className="mt-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default MediaPage;