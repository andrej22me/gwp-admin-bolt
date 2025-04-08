import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
                <div className="mb-6">
                    <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-body dark:text-bodydark">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        className="rounded border border-stroke py-2 px-6 text-body hover:border-primary hover:text-primary dark:border-strokedark dark:text-bodydark"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="rounded bg-primary py-2 px-6 text-white hover:bg-opacity-90"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
