"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
// Import your custom API helper
import { api } from "@/lib/api";

const GalleryCategoriesPage = () => {
    const router = useRouter();

    // State to hold categories from the server
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Make a GET request to your categories endpoint
                // Adjust the route if needed (e.g., "/gallery-categories" or "/gallery-category")
                const response = await api.get("/gallery-category");

                if (response) {
                    for (let i = 0; i < response.length; i++) {
                        response[i].createdAt = new Date(response[i].createdAt).toLocaleString('me');
                    }
                }

                setCategories(response);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Handle "select all" checkbox
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCategories(categories.map((cat: any) => cat.id));
        } else {
            setSelectedCategories([]);
        }
    };

    // Handle single category selection
    const handleSelectCategory = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(
                selectedCategories.filter((id) => id !== categoryId)
            );
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    // Filter categories by search term
    const filteredCategories = categories.filter((category: any) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Gallery Categories" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/gallery/categories/new"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                    Add New Category
                                </Link>
                                <div className="relative flex">
                                    <select
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        defaultValue=""
                                    >
                                        <option value="">Bulk Actions</option>
                                        <option value="delete">Delete</option>
                                        <option value="edit">Edit</option>
                                    </select>
                                    <button className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="search relative">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
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

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={
                                                categories.length > 0 &&
                                                selectedCategories.length === categories.length
                                            }
                                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Name
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Galleries
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Created At
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCategories.map((category: any) => (
                                    <tr key={category.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                                            />
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <Link
                                                href={`/gallery/categories/${category.id}`}
                                                className="text-black dark:text-white hover:text-primary"
                                            >
                                                {category.name}
                                            </Link>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {category.galleryCount ?? 0}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {category.createdAt}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Link
                                                    href={`/gallery/categories/${category.id}`}
                                                    className="hover:text-primary"
                                                >
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </Link>
                                                <button className="hover:text-primary">
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-5 px-4 text-center text-gray-500"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default GalleryCategoriesPage;
