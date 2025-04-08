"use client";

import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const NewGalleryCategoryPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            // Simple validation
            if (!formData.name.trim()) {
                throw new Error("Please provide a category name.");
            }

            // Make a POST request to create the new gallery category
            // using your custom `api.post` helper
            const response = await api.post("/gallery-category", { name: formData.name });

            // If `response` is falsy or indicates a failure, throw an error
            if (!response) {
                throw new Error("Failed to create gallery category.");
            }
            router.push("/gallery/categories");
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            console.error("Create Gallery Category Error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="New Gallery Category" />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {/* Display any error message */}
                            {error && <p className="text-red-500">{error}</p>}

                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push("/gallery/categories")}
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewGalleryCategoryPage;
