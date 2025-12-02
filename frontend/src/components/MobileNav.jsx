import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
            isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>

        {/* Hot/Trending */}
        <Link
          to="/?tab=hot"
          className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
            location.search.includes('hot') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Hot</span>
        </Link>

        {/* Submit - Center prominent button */}
        {isAuthenticated ? (
          <Link
            to="/submit"
            className="flex flex-col items-center justify-center flex-1 py-1"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 -mt-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-400 mt-1">Submit</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center justify-center flex-1 py-1"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 -mt-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-400 mt-1">Submit</span>
          </Link>
        )}

        {/* Search/Explore */}
        <Link
          to="/?tab=new"
          className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
            location.search.includes('new') ? 'text-secondary' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">New</span>
        </Link>

        {/* Profile */}
        {isAuthenticated ? (
          <Link
            to={`/profile/${user?.id}`}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              isActive('/profile') ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" className="w-6 h-6 rounded-full mb-1" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-1">
                <span className="text-xs text-white font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <span className="text-xs font-medium">Profile</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              isActive('/login') ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileNav;
