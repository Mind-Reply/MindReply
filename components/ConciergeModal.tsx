'use client';

interface ConciergeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConciergeModal({ open, onClose }: ConciergeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-mr-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-mr-gold text-2xl">🎩</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-mr-navy mb-2">Premium Access Request</h3>
          <p className="text-gray-600 text-sm">
            Our membership team will contact you within 24 business hours.
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Professional Title"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Organisation"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="email"
            placeholder="Business Email"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="w-full bg-mr-navy hover:bg-mr-accent text-white py-3 rounded-xl font-medium"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
