"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/apiJson";

export enum GalleryType {
    PHOTO = "PHOTO",
    VIDEO = "VIDEO",
}

interface GalleryAlbum {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    category: string;
    season: string;
    type: GalleryType;
    eventType: "training" | "competition";
    imageCount: number;
    createdAt: string;
    media: any;
}

const GalleryPage = () => {
    const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        category: "",
        season: "",
        type: "",
        eventType: ""
    });

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiJson.get('/galleries');
            setAlbums(response);
        } catch (err: any) {
            console.error('Error fetching galleries:', err);
            setError(err.message || 'Failed to load galleries');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAlbums(albums.map(album => album.id));
        } else {
            setSelectedAlbums([]);
        }
    };

    const handleSelectAlbum = (albumId: number) => {
        if (selectedAlbums.includes(albumId)) {
            setSelectedAlbums(selectedAlbums.filter(id => id !== albumId));
        } else {
            setSelectedAlbums([...selectedAlbums, albumId]);
        }
    };

    const filteredAlbums = albums.filter(album => {
        const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            album.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || album.category === filters.category;
        const matchesSeason = !filters.season || album.season === filters.season;
        const matchesType = !filters.type || album.type === filters.type;
        const matchesEventType = !filters.eventType || album.eventType === filters.eventType;

        return matchesSearch && matchesCategory && matchesSeason && matchesType && matchesEventType;
    });

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
                <Breadcrumb pageName="Gallery" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/gallery/new"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                    Create New Album
                                </Link>
                                <div className="relative flex">
                                    <select
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        defaultValue=""
                                    >
                                        <option value="">Bulk Actions</option>
                                        <option value="delete">Delete</option>
                                        <option value="download">Download</option>
                                    </select>
                                    <button className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="search relative">
                                <input
                                    type="text"
                                    placeholder="Search albums..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <button className="absolute left-2 top-1/2 -translate-y-1/2">
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
                        </div>

                        {/* Filters */}
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                                className="rounded border border-stroke bg-transparent p-2.5"
                            >
                                <option value="">All Categories</option>
                                <option value="Training Camp">Training Camp</option>
                                <option value="Championships">Championships</option>
                            </select>

                            <select
                                value={filters.season}
                                onChange={(e) => setFilters({...filters, season: e.target.value})}
                                className="rounded border border-stroke bg-transparent p-2.5"
                            >
                                <option value="">All Seasons</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>

                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                className="rounded border border-stroke bg-transparent p-2.5"
                            >
                                <option value="">Team/Individual</option>
                                <option value="team">Team</option>
                                <option value="individual">Individual</option>
                            </select>

                            <select
                                value={filters.eventType}
                                onChange={(e) => setFilters({...filters, eventType: e.target.value})}
                                className="rounded border border-stroke bg-transparent p-2.5"
                            >
                                <option value="">Training/Competition</option>
                                <option value="training">Training</option>
                                <option value="competition">Competition</option>
                            </select>
                        </div>

                        {/* Albums Grid */}
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredAlbums.map((album) => (
                                <Link
                                    href={`/gallery/${album.id}`}
                                    key={album.id}
                                    className="relative rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
                                >
                                    <div className="relative mb-3 aspect-[4/3]">
                                        {
                                            album.media && album.media.length > 0 && (
                                                <>
                                                    {album.type === 'VIDEO' ? (
                                                        <>
                                                            <video
                                                                src={album.media[0].media.url}
                                                                className="h-full w-full rounded-sm object-cover"
                                                                preload="metadata"
                                                                playsInline
                                                                muted
                                                                controls={false}
                                                            />
                                                            <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                                </svg>
                                                                {album.media.length} videos
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Image
                                                                src={album.media[0].media.url}
                                                                alt={album.title}
                                                                fill
                                                                className="rounded-sm object-cover"
                                                            />
                                                            <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                                                                {album.media.length} photos
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                    </div>
                                    <h5 className="mb-1 text-sm font-medium text-black dark:text-white">
                                        {album.title}
                                    </h5>
                                    <p className="text-xs text-body line-clamp-2">
                                        {album.description}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-gray-2 px-2 py-1 text-xs font-medium dark:bg-meta-4">
                                            {album.category}
                                        </span>
                                        <span className="rounded-full bg-gray-2 px-2 py-1 text-xs font-medium dark:bg-meta-4">
                                            {album.season}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default GalleryPage;