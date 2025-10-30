import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">MARKETPLACE</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/ads" className="hover:text-white">Ad Choices</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">CONNECT</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 Marketplace, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
