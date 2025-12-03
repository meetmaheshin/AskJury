import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-white font-black text-xl mb-4 flex items-center">
              <span className="text-2xl mr-2">⚖️</span>
              AskJury
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Internet's Courtroom. Share your side, let strangers judge, and get the verdict you need.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Where disputes meet democracy.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/submit" className="text-gray-400 hover:text-primary transition-colors text-sm">
                    Submit Case
                  </Link>
                </li>
              )}
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Browse Cases
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <Link to={`/profile/${localStorage.getItem('userId')}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    My Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Legal & Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-3">Get in Touch</h4>
              <a
                href="mailto:support@askjury.com"
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                support@askjury.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} AskJury. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-xs">Made with ⚡ for justice seekers everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
