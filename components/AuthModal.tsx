'use client';

interface AuthModalProps {
  open: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({ open, mode, onClose }: AuthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-mr-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-mr-gold text-2xl">🔐</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-mr-navy mb-2">
            {mode === 'login' ? 'Sign In to MindReply' : 'Create Your Account'}
          </h3>
          <p className="text-gray-600 text-sm">
            {mode === 'login'
              ? 'Access your communication intelligence dashboard.'
              : 'Begin your journey to subconscious communication excellence.'}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mr-gold outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mr-gold outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-mr-navy hover:bg-mr-accent text-white py-3 rounded-xl font-medium"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button className="text-mr-gold font-medium hover:underline ml-1">Sign Up</button>
        </p>
      </div>
    </div>
  );
}
