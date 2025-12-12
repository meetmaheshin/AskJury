import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import CaseCard from '../components/CaseCard';
import { HomePageSEO } from '../components/SEO';
import TrendingMarquee from '../components/TrendingMarquee';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hot');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [closedCases, setClosedCases] = useState([]); // For marquee
  const [trending, setTrending] = useState([]); // For sidebar
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const categories = [
    { value: '', label: 'All Drama', emoji: '🔥' },
    { value: 'POLITICS', label: 'Politics', emoji: '🏛️' },
    { value: 'ROOMMATE_DISPUTES', label: 'Roommate War', emoji: '🏠' },
    { value: 'RELATIONSHIP_ISSUES', label: 'Breakup Drama', emoji: '💔' },
    { value: 'WORKPLACE_CONFLICTS', label: 'Work Beef', emoji: '💼' },
    { value: 'FAMILY_DRAMA', label: 'Family Tea', emoji: '👨‍👩‍👧' },
    { value: 'FRIEND_DISAGREEMENTS', label: 'Friend Betrayal', emoji: '🔪' },
    { value: 'MONEY_PAYMENTS', label: 'Money Fight', emoji: '💸' },
    { value: 'OTHER', label: 'Red Flags', emoji: '🚩' },
  ];

  useEffect(() => {
    // Reset pagination when tab or filter changes
    setOffset(0);
    setHasMore(true);
    fetchCases(true);
  }, [activeTab, categoryFilter]);

  useEffect(() => {
    fetchLeaderboard();
    fetchClosedCases(); // For marquee
    fetchTrending(); // For sidebar
  }, []);

  const fetchCases = async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const params = {
        sort: activeTab,
        limit: LIMIT,
        offset: currentOffset
      };
      if (categoryFilter) {
        params.category = categoryFilter;
      }

      const response = await api.get('/cases', { params });
      const newCases = response.data.cases;

      if (reset) {
        setCases(newCases);
        setOffset(LIMIT);
      } else {
        setCases(prev => [...prev, ...newCases]);
        setOffset(prev => prev + LIMIT);
      }

      // If we got fewer cases than the limit, there are no more cases
      setHasMore(newCases.length === LIMIT);

    } catch (err) {
      setError('Failed to load cases');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreCases = () => {
    if (!loadingMore && hasMore) {
      fetchCases(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard/top?limit=10');
      setLeaderboard(response.data.leaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const fetchClosedCases = async () => {
    try {
      const response = await api.get('/cases/closed?limit=20');
      setClosedCases(response.data);
    } catch (err) {
      console.error('Error fetching closed cases:', err);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await api.get('/cases/trending/top?limit=5');
      setTrending(response.data.trending);
    } catch (err) {
      console.error('Error fetching trending:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <HomePageSEO />
      {/* Hero Section - Hidden on mobile PWA, visible on desktop */}
      <div className="hidden md:block relative overflow-hidden bg-black border-b border-gray-800/50">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-secondary/10 opacity-60"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Text content */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">
                <span className="text-white">The Internet's </span>
                <span className="bg-gradient-to-r from-primary via-pink-500 to-secondary bg-clip-text text-transparent">
                  Courtroom
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-400 mb-4 max-w-lg font-medium">
                Share your side. Let strangers judge. <span className="text-white">Get the verdict.</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isAuthenticated ? (
                  <Link
                    to="/submit"
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
                  >
                    ⚖️ Submit Case
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
                  >
                    ⚖️ Join the Jury
                  </Link>
                )}
                <button
                  onClick={() => document.getElementById('cases-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-sm"
                >
                  Browse Cases ↓
                </button>
              </div>
            </div>
            
            {/* Right: Stats */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-white">50K+</p>
                <p className="text-xs text-gray-500">Judges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-primary">1M+</p>
                <p className="text-xs text-gray-500">Verdicts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-secondary">24/7</p>
                <p className="text-xs text-gray-500">Drama</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Cases Marquee - Shows recent verdicts */}
      {closedCases.length > 0 && (
        <TrendingMarquee cases={closedCases} />
      )}

      <div id="cases-section" className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Trending Categories */}
          <aside className="hidden xl:block xl:col-span-2">
            <div className="sticky top-20">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm p-5 border border-gray-800/50 mb-6">
                <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.slice(1).map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategoryFilter(cat.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        categoryFilter === cat.value
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Cases */}
              <div className="bg-gradient-to-br from-warning/5 to-orange-900/10 rounded-2xl shadow-sm p-5 border border-warning/20 mb-6">
                <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4 mr-2 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Trending
                </h3>
                <div className="space-y-3">
                  {trending.length > 0 ? (
                    trending.map((item) => (
                      <Link
                        key={item.id}
                        to={`/case/${item.id}`}
                        className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700"
                      >
                        <p className="text-sm font-semibold text-white mb-1 line-clamp-2">
                          {item.title}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              {item.voteCount}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              </svg>
                              {item.commentCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-warning font-bold">{item.engagementScore}</span>
                            <span title="Controversy Score">
                              {Math.abs(item.sideAPercentage - 50) < 15 ? '🔥' : ''}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No trending cases yet</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl shadow-sm p-5 border border-gray-800/50">
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">How It Works</h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex items-start">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium mb-0.5">Share Your Case</p>
                      <p className="text-xs text-gray-500">Tell your side of the story</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium mb-0.5">Community Votes</p>
                      <p className="text-xs text-gray-500">Strangers decide who's right</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium mb-0.5">Get Your Verdict</p>
                      <p className="text-xs text-gray-500">Live results & opinions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="xl:col-span-8">
        {/* Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm p-1.5 mb-6 flex space-x-1 border border-gray-800/50">
          <button
            onClick={() => setActiveTab('hot')}
            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all duration-200 ${activeTab === 'hot'
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Hot
            </div>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all duration-200 ${activeTab === 'new'
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              New
            </div>
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all duration-200 ${activeTab === 'top'
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top
            </div>
          </button>
        </div>

        {/* Category filter - Mobile only */}
        <div className="mb-6 xl:hidden">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl font-medium text-gray-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cases */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-primary"></div>
            <p className="mt-4 text-gray-400 font-medium">Loading cases...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium text-lg">No cases found</p>
            <p className="text-gray-500 mt-2">Be the first to submit a case!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreCases}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading more...
                    </span>
                  ) : (
                    'Load More Cases'
                  )}
                </button>
              </div>
            )}

            {/* End of results message */}
            {!hasMore && cases.length > 0 && (
              <div className="mt-8 text-center py-8 border-t border-gray-800">
                <p className="text-gray-400 font-medium">You've seen all cases in this category</p>
                <p className="text-gray-500 text-sm mt-1">Try changing the filter or check back later for new drama!</p>
              </div>
            )}
          </>
        )}
          </main>

          {/* Right Sidebar - Community Stats */}
          <aside className="hidden xl:block xl:col-span-2">
            <div className="sticky top-20 space-y-6">
              {/* Top Jury Leaderboard */}
              <div className="bg-gradient-to-br from-success/5 to-green-900/10 rounded-2xl shadow-sm p-5 border border-success/20">
                <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4 mr-2 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Top Judges
                </h3>
                <div className="space-y-3">
                  {leaderboard.length > 0 ? (
                    leaderboard.slice(0, 5).map((user, index) => (
                      <Link
                        key={user.id}
                        to={`/profile/${user.id}`}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-green-500 text-white flex items-center justify-center font-bold">
                                {user.username[0].toUpperCase()}
                              </div>
                            )}
                            {index < 3 && (
                              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-warning text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                'bg-orange-600 text-white'
                              }`}>
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{user.username}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-success" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                {user.totalUpvotes}
                              </span>
                              <span className="text-warning font-bold">${user.earnings}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No jury members yet</p>
                  )}
                </div>
                <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-success/10">
                  <p className="text-xs text-gray-400 text-center">
                    <span className="font-bold text-white">Earn $1</span> for every <span className="font-bold text-success">1000 upvotes</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm p-5 border border-gray-800/50">
                <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active Cases</span>
                    <span className="text-lg font-bold text-primary">{cases.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Votes</span>
                    <span className="text-lg font-bold text-secondary">
                      {cases.reduce((sum, c) => sum + (c.voteCount || 0), 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Comments</span>
                    <span className="text-lg font-bold text-success">
                      {cases.reduce((sum, c) => sum + (c._count?.comments || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl shadow-sm p-5 border border-gray-800/50">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Guidelines</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Be respectful
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Vote honestly
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No harassment
                  </li>
                </ul>
              </div>

              {isAuthenticated && (
                <Link
                  to="/submit"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Submit Your Case
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
