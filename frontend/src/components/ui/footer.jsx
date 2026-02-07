import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4 sm:px-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Product Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Guides
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                API Docs
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-sm md:text-base">
          &copy; 2025 XBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
