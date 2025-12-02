import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-black/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Jury
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-2">
              <Link to="/" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                Home
              </Link>
              <Link to="/submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                Submit Case
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-9 h-9 rounded-full border-2 border-primary/30" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-semibold text-gray-200">{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
