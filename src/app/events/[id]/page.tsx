"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useParams, useRouter } from "next/navigation";
import { Event, EventCategory, EventStatus, RegistrationStatus } from "@/interfaces/Event";
import { apiJson } from "@/lib/apiJson";
import LexicalEditor from "@/components/editors/LexicalEditor";
import { toast, ToastContainer } from "react-toastify";
import MediaSelectModal from "@/components/modals/MediaSelectModal";
import Image from "next/image";
import { createEventSchema, validateEventDates } from "@/schemas/event.schema";
import { ZodError } from "zod";

interface EventWithImage extends Event {
  eventImage?: {
    url: string;
  };
}

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventWithImage | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await apiJson.get(`/events/${eventId}`);
      // Format dates to YYYY-MM-DD for input[type="date"]
      const formattedData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : ''
      };
      setFormData(formattedData);
      if (formattedData.eventImage?.url) {
        setSelectedImageUrl(formattedData.eventImage.url);
      }
    } catch (err: any) {
      console.error('Error fetching event:', err);
      toast.error(err.message || 'Failed to load event');
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setErrors({});

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };

      // Validate the data
      try {
        const validatedData = createEventSchema.parse(submitData);
        validateEventDates(validatedData);
      } catch (err) {
        if (err instanceof ZodError) {
          const newErrors: { [key: string]: string } = {};
          err.errors.forEach((error) => {
            if (error.path) {
              newErrors[error.path[0]] = error.message;
            }
          });
          setErrors(newErrors);
          toast.error("Please fix the validation errors");
          return;
        }
        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }
      }

      await apiJson.patch(`/events/${eventId}`, submitData);
      toast.success('Event updated successfully');
      router.push('/events');
    } catch (err: any) {
      console.error('Error updating event:', err);
      toast.error(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      
      if (type === 'number') {
        return { ...prev, [name]: Number(value) };
      } else if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        return { ...prev, [name]: checked };
      } else if (type === 'date') {
        return { ...prev, [name]: value || '' };
      }
      return { ...prev, [name]: value };
    });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMediaSelect = (mediaId: number, url: string) => {
    setSelectedImageUrl(url);
    setFormData(prev => prev ? { ...prev, eventImageId: mediaId } : null);
    setIsMediaModalOpen(false);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <ToastContainer position={'bottom-right'}/>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !formData) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex h-screen items-center justify-center">
            <p className="text-xl font-medium text-black dark:text-white">
              {error || 'Event not found'}
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName={formData.title} />
        <ToastContainer position={'bottom-right'} />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-4 sm:p-6 xl:p-9">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title || ''}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    className={`w-full rounded border-[1.5px] ${
                      errors.title ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.title && (
                    <p className="text-meta-1 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Description</label>
                  <LexicalEditor
                    content={formData.description}
                    onChange={(value) => setFormData(prev => prev ? { ...prev, description: value } : prev)}
                    placeholder="Enter event description..."
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  >
                    {Object.values(EventCategory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    {Object.values(EventStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Event Image</label>
                  <div className="relative">
                    {selectedImageUrl ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={selectedImageUrl}
                          alt="Selected event image"
                          fill
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImageUrl(null);
                            setFormData(prev => prev ? { ...prev, eventImageId: undefined } : null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsMediaModalOpen(true)}
                        className="w-full h-48 rounded border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary flex items-center justify-center"
                      >
                        <span className="text-body">Click to select an image</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Registration Status</label>
                  <select
                    name="registrationStatus"
                    value={formData.registrationStatus}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    {Object.values(RegistrationStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Capacity Limit</label>
                  <input
                    type="number"
                    name="capacityLimit"
                    value={formData.capacityLimit}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Location Details</label>
                  <input
                    type="text"
                    name="locationDetails"
                    value={formData.locationDetails}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="showPrice"
                    checked={formData.showPrice}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="font-medium text-black dark:text-white">Show Price</label>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Required Equipment</label>
                  <input
                    type="text"
                    name="requiredEquipment"
                    value={formData.requiredEquipment}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Age Restriction</label>
                  <input
                    type="text"
                    name="ageRestriction"
                    value={formData.ageRestriction}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isMediaModalOpen && (
        <MediaSelectModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      )}
      
      <ToastContainer />
    </DefaultLayout>
  );
};

export default EventDetailPage;