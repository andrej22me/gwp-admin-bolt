"use client";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/apiJson";
import { useRouter } from "next/navigation";

interface Event {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  registrationStatus: string;
  status: string;
}

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiJson.get('/events');
      setEvents(data);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (event: Event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEventToDelete(null);
    setDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      await apiJson.delete(`/events/${eventToDelete.id}`, {});
      await fetchEvents();
      closeDeleteModal();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEvents(events.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: number) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleBulkAction = async () => {
    if (!selectedEvents.length || !bulkAction) return;

    try {
      setIsBulkProcessing(true);
      if (bulkAction === 'delete') {
        await apiJson.delete('/events/bulk-delete', { ids: selectedEvents });
        setSelectedEvents([]);
      }
      await fetchEvents();
    } catch (err: any) {
      console.error('Error processing bulk action:', err);
      alert(err.message || 'Failed to process bulk action');
    } finally {
      setIsBulkProcessing(false);
      setBulkAction("");
    }
  };

  const handleDuplicate = async (eventId: number, callback?: () => void) => {
    try {
      setLoading(true);
      await apiJson.post(`/events/${eventId}/duplicate`);
      await fetchEvents();
      if (callback) callback();
    } catch (err: any) {
      console.error('Error duplicating event:', err);
      alert(err.message || 'Failed to duplicate event');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.registrationStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (error) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="rounded-sm border border-[#F87171] bg-[#F87171] py-3 px-4 text-white">
            {error}
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Events" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-4 sm:p-6 xl:p-9">
            <div className="flex flex-col gap-5 md:flex-row md:justify-between">
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.push('/events/new')}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90">
                  Add New Event
                </button>
                <div className="relative flex">
                  <select 
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                  >
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete</option>
                  </select>
                  <button 
                    className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium hover:bg-opacity-90 disabled:opacity-50"
                    onClick={handleBulkAction}
                    disabled={!selectedEvents.length || !bulkAction || isBulkProcessing}
                  >
                    {isBulkProcessing ? 'Processing...' : 'Apply'}
                  </button>
                </div>
              </div>

              <div className="search relative">
                <input
                  type="text"
                  placeholder="Search events..."
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
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[40px] py-4 px-4 font-medium text-black dark:text-white">
                      <input
                        type="checkbox"
                        checked={selectedEvents.length === events.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                      Title
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Category
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Start Date
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      End Date
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Registration
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, key) => (
                    <tr key={event.id} className="group">
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleSelectEvent(event.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                            <Link
                              href={`/events/${event.id}`}
                              className="block font-medium text-black hover:text-primary dark:text-white"
                            >
                              {event.title}
                            </Link>
                            <div className="flex gap-4">
                              <button
                                onClick={() => openDeleteModal(event)}
                                className="text-xs text-red hidden group-hover:block cursor-pointer absolute bottom-1"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleDuplicate(event.id)}
                                className="text-xs text-blue-600 hidden group-hover:block cursor-pointer absolute bottom-1 left-16"
                              >
                                Duplicate
                              </button>
                            </div>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className="text-black dark:text-white">{event.category}</span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className="text-black dark:text-white">
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className="text-black dark:text-white">
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          event.registrationStatus === 'Open' ? 'bg-success text-success' :
                          event.registrationStatus === 'Closed' ? 'bg-danger text-danger' :
                          'bg-warning text-warning'
                        }`}>
                          {event.registrationStatus}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          event.status === 'Active' ? 'bg-success text-success' :
                          event.status === 'Cancelled' ? 'bg-danger text-danger' :
                          event.status === 'Draft' ? 'bg-warning text-warning' :
                          'bg-gray-500 text-gray-500'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div 
            className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40"
            onClick={closeDeleteModal}
          >
            <div 
              className="w-full max-w-lg rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-black dark:text-white">
                  Delete Event
                </h3>
                <p className="text-base text-body-color dark:text-body-color-dark">
                  Are you sure you want to delete event "{eventToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded border border-stroke py-2 px-6 text-base font-medium text-black hover:border-primary hover:bg-primary/5 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded bg-red-600 py-2 px-6 text-base font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EventsPage;