"use client";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { ToastContainer, toast } from 'react-toastify';
import {useEffect, useState} from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {Page} from "@/interfaces/Page";
import {Media} from "@/interfaces/Media";

const getDefaultMedia = (): Media => ({
    id: 0,
    title: "",
    description: "",
    caption: "",
    url: "",
    thumbnail: "",
    size: "",
    dimensions: null,
    uploadedBy: "",
    fileType: "",
    user: undefined, // Optional field
});


const getDefaultPage = (): Page => ({
    id: 0, // Default ID (if needed)
    title: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    heroImageId: undefined,
    heroImage: getDefaultMedia(), // ✅ Use default Media object
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [],
});



const EditPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<Page>(getDefaultPage());
    const [heroImage, setHeroImage] =  useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [componentImages, setComponentImages] = useState<{ [key: string]: File }>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const galleryPage = await api.get("/pages/gallery");
                console.log(galleryPage);
                setFormData(galleryPage);
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

        try {
            // First, upload all component images
            const updatedSections = [...formData.sections];
            for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
                const section = updatedSections[sectionIndex];
                if (section.components) {
                    for (let componentIndex = 0; componentIndex < section.components.length; componentIndex++) {
                        const component = section.components[componentIndex];
                        if (component.type === 'IMAGE') {
                            const key = `${sectionIndex}-${componentIndex}`;
                            const imageFile = componentImages[key];
                            if (imageFile) {
                                // Upload the image
                                const mediaResponse = await api.post('/media/upload-multiple', {
                                    files: [{ binary: imageFile }]
                                });
                                
                                // Update component with the media ID from response
                                if (mediaResponse && mediaResponse.length > 0) {
                                    updatedSections[sectionIndex].components[componentIndex].componentFileId = mediaResponse[0].id;
                                    updatedSections[sectionIndex].components[componentIndex].componentFile = mediaResponse[0];
                                    
                                    // Clear the temporary image from componentImages
                                    setComponentImages(prev => {
                                        const updated = { ...prev };
                                        delete updated[key];
                                        return updated;
                                    });
                                }
                            }
                        }
                    }
                }
            }

            // Update formData with the new sections containing media IDs
            setFormData(prev => ({
                ...prev,
                sections: updatedSections
            }));

            const aboutPageData = {
                title: formData.title,
                heroImage: heroImage,
                slug: formData.slug,
                sections: JSON.stringify(updatedSections),
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription
            };

            // Save the page with updated media IDs
            const response = await api.patch("/pages/gallery", aboutPageData);
            toast.success("Saved!");

        } catch (err: any) {
            toast.error(err.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                heroImage: getDefaultMedia()
            })
            setHeroImage(file);

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleComponentFileChange = (sectionIndex: number, componentIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const key = `${sectionIndex}-${componentIndex}`;
            setComponentImages(prev => ({
                ...prev,
                [key]: file
            }));

            // Also update the sections to remove the existing componentFile
            const updatedSections = [...formData.sections];
            if (updatedSections[sectionIndex]?.components[componentIndex]) {
                updatedSections[sectionIndex].components[componentIndex].componentFile = null;
                updatedSections[sectionIndex].components[componentIndex].componentFileId = null;
                setFormData(prev => ({
                    ...prev,
                    sections: updatedSections
                }));
            }
        }
    };


    return (
        <DefaultLayout>
            <ToastContainer />
            <div className="mx-auto max-w-270">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Gallery</h1>
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

                            {formData.sections && formData.sections.length > 0 &&
                                formData.sections.map((section, index) => (
                                    <div key={index} className="mb-5.5">
                                    <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                                        {section.title}
                                    </h3>
                                    <div className="border-t border-b border-stroke py-4 dark:border-strokedark">
                                        {section.components && section.components.length > 0 &&
                                            section.components.map((component, cIndex) => (
                                                <div key={cIndex} className="py-4 dark:border-strokedark">
                                                <label
                                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                    htmlFor="title"
                                                >
                                                    {component.label}
                                                </label>
                                                {
                                                    component.type === "TEXT" && (
                                                    <input
                                                    type="text"
                                                    value={component.title || ""}
                                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    onChange={(e) => {
                                                        const updatedSections = [...formData.sections];
                                                        updatedSections[index].components[cIndex].title = e.target.value;
                                                        setFormData({...formData, sections: updatedSections});
                                                    }}
                                                />
                                                    )
                                                }
                                                  {
                                                    component.type === "TEXTAREA" && (
                                                    <textarea
                                                    rows={8}
                                                    value={component.description || ""}
                                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    onChange={(e) => {
                                                        const updatedSections = [...formData.sections];
                                                        updatedSections[index].components[cIndex].description = e.target.value;
                                                        setFormData({...formData, sections: updatedSections});
                                                    }}
                                                />
                                                    )
                                                }
                                                {
                                                    component.type === "BUTTON" && (
                                                    <input
                                                        type="text"
                                                        value={component.buttonText || ""}
                                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                        onChange={(e) => {
                                                        const updatedSections = [...formData.sections];
                                                        updatedSections[index].components[cIndex].buttonText = e.target.value;
                                                        setFormData({...formData, sections: updatedSections});
                                                        }}
                                                    />
                                                    )
                                                }
                                                {
                                                    component.type === 'IMAGE' && (
                                                        <div className="mb-5.5">
                                                            <label
                                                                className="mb-2.5 block font-medium text-black dark:text-white">
                                                                Image
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleComponentFileChange(index, cIndex, e)}
                                                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                                                />
                                                                {component.componentFileId && (
                                                                    <p className="mt-2 text-sm text-gray-500">
                                                                        Current image ID: {component.componentFileId}
                                                                    </p>
                                                                )}
                                                                {component.componentFile?.url && (
                                                                    <div className="mt-4">
                                                                        <Image
                                                                            src={component.componentFile.url}
                                                                            alt={component.title || "Component image"}
                                                                            width={200}
                                                                            height={200}
                                                                            className="rounded-lg object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {/* Preview for newly selected image */}
                                                                {componentImages[`${index}-${cIndex}`] && (
                                                                    <div className="mt-4">
                                                                        <p className="mb-2 text-sm text-gray-500">New image preview:</p>
                                                                        <Image
                                                                            src={URL.createObjectURL(componentImages[`${index}-${cIndex}`])}
                                                                            alt="New image preview"
                                                                            width={200}
                                                                            height={200}
                                                                            className="rounded-lg object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                </div>
                                            ))
                                        }
                                    </div>
                                    </div>
                                ))
                            }

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
                                    <p className="mt-1.5">Supported: PNG, JPG, GIF (max 800x800px)</p>
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
                                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}

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
                                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default EditPage;
