"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {api} from "@/lib/api";
import {Testimonial, TestimonialCategory, TestimonialType} from "@/interfaces/Testimonial";

const defaultTestimonial: Testimonial = {
    authorName: "",
    authorRole: TestimonialCategory.ATHLETE, // Default role
    testimonialType: TestimonialType.TEXT, // Default type
    content: "",
    rating: 5,
    position: "",
    media: null,
    isFeatured: false,
    isApproved: false,
    showOnHome: false,
    showOnTestimonials: false,
    createdAt: new Date().toISOString(),
    user: undefined,
    eventId: undefined,
    // event: undefined,
};

const NewTestimonialPage = () => {
    const params = useParams();
    const router = useRouter();
    const newsLetterId = Number(params.id);
    const [formData, setFormData] = useState<Testimonial>(defaultTestimonial);
    const [uploadMedia, setUploadMedia] = useState<File | null>(null); // State to store image file
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState<boolean>(false);

    const isVideoFile = (fileName: string): boolean => {
        const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'];
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return videoExtensions.includes(ext);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadMedia(file);

            const isVideoType = isVideoFile(file.name);
            setIsVideo(isVideoType);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            setFormData({
                ...formData,
                file: file
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsLetterId) {
            save();
        } else {
            edit();
        }
    }

    const save = async () => {
        try {
            debugger;
            const testimonialData = {
                authorName: formData.authorName,
                position: formData.position,
                authorRole: formData.authorRole,
                rating: formData.rating,
                content: formData.content,
                file: uploadMedia,
                testimonialType: formData.testimonialType,
                showOnHome: formData.showOnHome,
                showOnTestimonials: formData.showOnTestimonials
            };

            const data = await api.post(`/testimonials`, testimonialData); // Call the get API endpoint
            setFormData(defaultTestimonial); // Update the users state with the fetched data
            // router.push('/users');
        } catch (err: any) {
            console.error("Error fetching users:", err.message);
            setError(err.message || "Failed to load users."); // Set error state
        } finally {
            setLoading(false); // Stop loading

        }
    }

    const edit = async () => {
        try {
            const testimonialData = {
                authorName: formData.authorName,
                position: formData.position,
                authorRole: formData.authorRole,
                rating: formData.rating,
                content: formData.content,
                file: uploadMedia,
                testimonialType: formData.testimonialType,
                showOnHome: formData.showOnHome,
                showOnTestimonials: formData.showOnTestimonials
            };

            const data = await api.patch(`/testimonials/${newsLetterId}`, testimonialData); // Call the get API endpoint
            setFormData(data); // Update the users state with the fetched data
            // router.push('/users');
        } catch (err: any) {
            console.error("Error fetching users:", err.message);
            setError(err.message || "Failed to load users."); // Set error state
        } finally {
            setLoading(false); // Stop loading
        }
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Testimonials" pageList={[{name: 'Testimonials', url: '/testimonials'}, {name: 'Add New Testimonial', url: '/'}]}/>

                <div
                    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-4 sm:p-6 xl:p-9">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Testimonial Type
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={formData.testimonialType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            testimonialType: e.target.value as TestimonialType
                                        })}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    >
                                        <option value={TestimonialType.TEXT}>Text Testimonial</option>
                                        <option value={TestimonialType.VIDEO}>Video Testimonial</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Author Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            {formData.testimonialType === TestimonialType.TEXT && (
                                <>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Author position
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter position"
                                            value={formData.position}
                                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Upload File
                                        </label>
                                        <div className="relative">
                                            {imagePreviewUrl && (
                                                isVideo ? (
                                                    <video 
                                                        controls 
                                                        className="max-w-full h-auto mb-4"
                                                        style={{ maxHeight: '400px' }}
                                                    >
                                                        <source src={imagePreviewUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <img
                                                        src={imagePreviewUrl}
                                                        alt="Preview"
                                                        className="object-contain mb-4"
                                                        style={{ maxHeight: '400px' }}
                                                    />
                                                )
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Kategorija
                                        </label>
                                        <select
                                            value={formData.authorRole}
                                            onChange={(e) => setFormData({...formData, authorRole: e.target.value as TestimonialCategory})}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                            <option value={TestimonialCategory.PARENT}>Roditelj</option>
                                            <option value={TestimonialCategory.ATHLETE}>Sportista</option>
                                            <option value={TestimonialCategory.PARENT}>Trener</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Rating
                                        </label>
                                        <select
                                            value={formData.rating}
                                            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <option key={rating} value={rating as number}>{rating} Stars</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="mb-4.5">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Display Options
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOnHome"
                                            checked={formData.showOnHome}
                                            onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                                            className="mr-2 h-5 w-5 cursor-pointer rounded border-gray focus:border-primary dark:border-strokedark dark:bg-form-input"
                                        />
                                        <label htmlFor="showOnHome" className="cursor-pointer">
                                            Show on Homepage
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOnTestimonials"
                                            checked={formData.showOnTestimonials}
                                            onChange={(e) => setFormData({ ...formData, showOnTestimonials: e.target.checked })}
                                            className="mr-2 h-5 w-5 cursor-pointer rounded border-gray focus:border-primary dark:border-strokedark dark:bg-form-input"
                                        />
                                        <label htmlFor="showOnTestimonials" className="cursor-pointer">
                                            Show in Testimonials
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Testimonial
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder="Enter testimonial"
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/testimonials')}
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                >
                                    Create Testimonial
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewTestimonialPage;
