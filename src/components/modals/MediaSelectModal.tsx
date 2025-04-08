"use client";
import { useState, useEffect } from 'react';
import { apiJson } from '@/lib/apiJson';
import Image from 'next/image';

interface Media {
  id: number;
  url: string;
  filename: string;
  filesize: number;
  fileType: string;
  thumbnailUrl?: string;
  created_at: string;
  event?: {
    id: number;
  };
}

interface MediaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaId: number, url: string) => void;
}

const MediaSelectModal = ({ isOpen, onClose, onSelect }: MediaSelectModalProps) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await apiJson.get('/media');
      const filteredMedia = response.filter((item: Media) => !item.event);
      setMedia(filteredMedia);
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedId && selectedUrl) {
      onSelect(selectedId, selectedUrl);
      onClose();
    }
  };

  const renderMediaItem = (item: Media) => {
    if (item.fileType === 'video/mp4') {
      return (
        <div className="aspect-square relative bg-gray-100">
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt={item.filename}
              fill
              className="object-cover rounded-sm"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
            Video
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-square relative">
        <Image
          src={item.url}
          alt={item.filename}
          fill
          className="object-cover rounded-sm"
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[80vh] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Select Media
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] p-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSelectedUrl(item.url);
                  }}
                  className={`relative cursor-pointer rounded-sm border-2 ${
                    selectedId === item.id
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {renderMediaItem(item)}
                  <div className="text-xs mt-1 truncate px-2 pb-2">
                    {item.filename}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="rounded border border-stroke py-2 px-6 text-base font-medium text-black hover:border-primary hover:bg-primary/5 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSelect}
                disabled={!selectedId || !selectedUrl}
                className="rounded bg-primary py-2 px-6 text-base font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                Select
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaSelectModal;
