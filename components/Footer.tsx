'use client';

interface FooterProps {
  onAuthClick?: () => void;
  onConciergeClick?: () => void;
}

export default function Footer({ onAuthClick, onConciergeClick }: FooterProps) {
  return (
    <footer className="bg-mr-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-mr-gold rounded-lg flex items-center justify-center">
                <span className="text-mr-navy font-serif font-bold">M</span>
              </div>
              <span className="font-serif font-bold">MindReply</span>
            </div>
            <p className="text-gray-400 text-sm">Executive communication intelligence for professionals.</p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#agent" className="hover:text-white">MRagent</a></li>
              <li><a href="#tools" className="hover:text-white">Micro-Tools</a></li>
              <li><a href="#memberships" className="hover:text-white">Memberships</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Professionals</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Psychologists</a></li>
              <li><a href="#" className="hover:text-white">Legal</a></li>
              <li><a href="#" className="hover:text-white">Finance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Access</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={onAuthClick} className="hover:text-white">Login</button></li>
              <li><button onClick={onConciergeClick} className="hover:text-white">Premium Access</button></li>
              <li><a href="mailto:info@mind-reply.com" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2026 MindReply. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-300">Ethics</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
