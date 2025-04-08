"use client";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { apiJson } from "@/lib/apiJson";

interface Testimonial {
  id: number;
  authorName: string;
  authorRole: string;
  testimonialType: string;
  position: string;
  content: string;
  rating: number;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
}

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonials, setSelectedTestimonials] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkAction, setBulkAction] = useState('');

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response);
      } catch (err: any) {
        console.error("Error fetching testimonials:", err.message);
        setError(err.message || "Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Handle selecting individual testimonial
  const handleSelectTestimonial = (testimonialId: number) => {
    if (selectedTestimonials.includes(testimonialId)) {
      setSelectedTestimonials(selectedTestimonials.filter(id => id !== testimonialId));
    } else {
      setSelectedTestimonials([...selectedTestimonials, testimonialId]);
    }
  };

  // Handle selecting all testimonials
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTestimonials(testimonials.map(t => t.id));
    } else {
      setSelectedTestimonials([]);
    }
  };

  // Handle deleting a testimonial
  const handleDeleteTestimonial = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  };

  // Handle bulk action change
  const handleBulkActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setBulkAction(e.target.value);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (e: React.MouseEvent<HTMLButtonElement>, action: string) => {
    if (action !== 'delete') {
      return;
    }

    if (selectedTestimonials.length === 0) {
      toast.warning("Please select testimonials to delete");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiJson.delete("/testimonials/bulk-delete", selectedTestimonials);
      
      setTestimonials(prevTestimonials => 
        prevTestimonials.filter(testimonial => !selectedTestimonials.includes(testimonial.id))
      );
      setSelectedTestimonials([]);
      toast.success(`Successfully deleted ${selectedTestimonials.length} testimonial(s)`);
    } catch (err: any) {
      console.error("Failed to delete testimonials:", err.message);
      setError(err.message || "Failed to delete testimonials.");
      toast.error("Failed to delete testimonials");
    } finally {
      setLoading(false);
    }
  };

  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter((testimonial) =>
      testimonial.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <DefaultLayout>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <Breadcrumb pageName="Testimonials" pageList={[{ name: "Testimonials", url: "/testimonials" }]} />
          <ToastContainer />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-4 sm:p-6 xl:p-9">
              <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/testimonials/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    Add New Testimonial
                  </Link>
                  <div className="relative flex flex-row items-center">
                    <select
                      onChange={handleBulkActionChange}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      defaultValue=""
                    >
                      <option value="">Bulk Actions</option>
                      <option value="delete">Delete</option>
                    </select>
                    <button 
                      onClick={(e) => handleBulkDelete(e, bulkAction)} 
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {loading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
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
                        d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-600">Loading testimonials...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <table className="w-full table-auto">
                      <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedTestimonials.length === testimonials.length}
                              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                          />
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Author</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Type</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Position</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Rating</th>
                      </tr>
                      </thead>
                      <tbody>
                      {filteredTestimonials.map((testimonial) => (
                          <tr key={testimonial.id} className="group relative">
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <input
                                  type="checkbox"
                                  checked={selectedTestimonials.includes(testimonial.id)}
                                  onChange={() => handleSelectTestimonial(testimonial.id)}
                                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark"
                              />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <Link href={`/testimonials/${testimonial.id}`} className="text-primary dark:text-white block">
                                {testimonial.authorName}
                              </Link>
                              <button
                                  onClick={(e) => handleDeleteTestimonial(e, testimonial.id)}
                                  className="text-xs text-red hidden group-hover:block cursor-pointer absolute bottom-1"
                              >
                                Delete
                              </button>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{testimonial.authorRole}</td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              {testimonial.testimonialType === "VIDEO" ? "🎥 Video" : "📝 Text"}
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{testimonial.position}</td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{testimonial.rating} ⭐</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
  );
};

export default TestimonialsPage;
