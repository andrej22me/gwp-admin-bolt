"use client";
import { useState } from "react";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { Event, EventCategory, EventStatus, RegistrationStatus } from "@/interfaces/Event";
import { apiJson } from "@/lib/apiJson";
import LexicalEditor from "@/components/editors/LexicalEditor";
import { toast, ToastContainer } from "react-toastify";
import MediaSelectModal from "@/components/modals/MediaSelectModal";
import Image from "next/image";
import { createEventSchema, validateEventDates } from "@/schemas/event.schema";
import { ZodError } from "zod";

interface EventFormData extends Event {
  content: string;
  eventImageId?: number;
}

const NewEventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    category: EventCategory.MENS,
    status: EventStatus.UPCOMING,
    registrationStatus: RegistrationStatus.CLOSED,
    capacityLimit: 0,
    locationDetails: '',
    price: 0,
    showPrice: false,
    requiredEquipment: '',
    ageRestriction: '',
  });
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);
      const { content, ...submitData } = {
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

      const response = await apiJson.post('/events', submitData);
      toast.success('Event created successfully');
      router.push(`/events/${response.id}`);
    } catch (err: any) {
      console.error("Error creating event:", err.message);
      toast.error(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
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

  const handleMediaSelect = async (mediaId: number) => {
    try {
      const response = await apiJson.get(`/media/${mediaId}`);
      setSelectedImageUrl(response.url);
      setFormData(prev => ({ ...prev, eventImageId: mediaId }));
    } catch (err: any) {
      console.error('Error fetching media details:', err);
      toast.error(err.message || 'Failed to load image details');
    }
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

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Create New Event" />
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
                    value={formData.title}
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

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full rounded border-[1.5px] ${
                      errors.description ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.description && (
                    <p className="text-meta-1 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Content</label>
                  <LexicalEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Enter event content..."
                  />
                  {errors.content && (
                    <p className="text-meta-1 text-sm mt-1">{errors.content}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.startDate ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.startDate && (
                    <p className="text-meta-1 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.endDate ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.endDate && (
                    <p className="text-meta-1 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Event Image</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      Select Image
                    </button>
                    {formData.eventImageId && (
                      <span className="text-sm text-gray-500">
                        Image ID: {formData.eventImageId}
                      </span>
                    )}
                  </div>
                  {selectedImageUrl && (
                    <div className="mt-4 relative w-full aspect-video">
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
                          setFormData(prev => ({ ...prev, eventImageId: undefined }));
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
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.category ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  >
                    {Object.values(EventCategory).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-meta-1 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.status ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  >
                    {Object.values(EventStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-meta-1 text-sm mt-1">{errors.status}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Registration Status</label>
                  <select
                    name="registrationStatus"
                    value={formData.registrationStatus}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.registrationStatus ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  >
                    {Object.values(RegistrationStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {errors.registrationStatus && (
                    <p className="text-meta-1 text-sm mt-1">{errors.registrationStatus}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Location</label>
                  <input
                    type="text"
                    name="locationDetails"
                    value={formData.locationDetails}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.locationDetails ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.locationDetails && (
                    <p className="text-meta-1 text-sm mt-1">{errors.locationDetails}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.price ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.price && (
                    <p className="text-meta-1 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Capacity Limit</label>
                  <input
                    type="number"
                    name="capacityLimit"
                    value={formData.capacityLimit}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.capacityLimit ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.capacityLimit && (
                    <p className="text-meta-1 text-sm mt-1">{errors.capacityLimit}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Required Equipment</label>
                  <textarea
                    name="requiredEquipment"
                    value={formData.requiredEquipment}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full rounded border-[1.5px] ${
                      errors.requiredEquipment ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.requiredEquipment && (
                    <p className="text-meta-1 text-sm mt-1">{errors.requiredEquipment}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Age Restriction</label>
                  <input
                    type="text"
                    name="ageRestriction"
                    value={formData.ageRestriction}
                    onChange={handleInputChange}
                    className={`w-full rounded border-[1.5px] ${
                      errors.ageRestriction ? 'border-meta-1' : 'border-stroke'
                    } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.ageRestriction && (
                    <p className="text-meta-1 text-sm mt-1">{errors.ageRestriction}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showPrice"
                    checked={formData.showPrice}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="font-medium text-black dark:text-white">Show Price</label>
                  {errors.showPrice && (
                    <p className="text-meta-1 text-sm mt-1">{errors.showPrice}</p>
                  )}
                </div>

              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Create Event
                </button>
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
    </DefaultLayout>
  );
};

export default NewEventPage;