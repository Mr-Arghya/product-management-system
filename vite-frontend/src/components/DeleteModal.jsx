import React, { useEffect, useRef, useState } from 'react';

const DeleteModal = ({
  isOpen,
  itemName = 'this item',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const overlayRef = useRef(null);
  const cancelRef = useRef(null);
  const lastActiveRef = useRef(null);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // remember last focused element and focus the cancel button
      lastActiveRef.current = document.activeElement;
      setTimeout(() => cancelRef.current?.focus(), 50);

      const onKey = (e) => {
        if (e.key === 'Escape') {
          onCancel && onCancel();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
        lastActiveRef.current?.focus?.();
      };
    }
  }, [isOpen, onCancel]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onCancel && onCancel();
    }
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    try {
      setInternalLoading(true);
      await onConfirm?.();
    } finally {
      setInternalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 ease-out scale-100 animate-enter"
        style={{ animation: 'enter 180ms ease-out' }}
      >
        {/* Content */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            {/* danger icon */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 00-2 2v1H6a1 1 0 000 2h12a1 1 0 000-2h-4V4a2 2 0 00-2-2zM7 9v9a3 3 0 003 3h4a3 3 0 003-3V9H7z" />
                </svg>
              </div>
            </div>

            <div className="min-w-0">
              <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <p id="delete-modal-desc" className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-medium text-gray-800">"{itemName}"</span>? This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              ref={cancelRef}
              onClick={onCancel}
              type="button"
              className="cursor-pointer px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition"
              disabled={isLoading || internalLoading}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              type="button"
              className={`cursor-pointer px-4 py-2 rounded-lg inline-flex items-center gap-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition
                ${isLoading || internalLoading ? 'bg-red-400 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-md'}`}
              disabled={isLoading || internalLoading}
            >
              {/* spinner when loading */}
              {(isLoading || internalLoading) ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 2a1 1 0 00-.894.553L4 4H2a1 1 0 100 2h1l1 10a2 2 0 002 2h8a2 2 0 002-2l1-10h1a1 1 0 100-2h-2l-1.106-1.447A1 1 0 0014 2H6zM8 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" />
                </svg>
              )}

              <span>{(isLoading || internalLoading) ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>

        {/* footer note */}
        <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
          This operation is permanent — consider archiving if you might need it later.
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
