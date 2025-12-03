import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from '../components/CommentSection';
import VerdictBadge from '../components/VerdictBadge';
import CloseCaseButton from '../components/CloseCaseButton';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/cases/${id}`);
      setCaseData(response.data.case);
    } catch (err) {
      setError('Failed to load case');
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (side) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if case is closed
    if (caseData?.status === 'CLOSED') {
      alert('This case is closed. No more voting allowed.');
      return;
    }

    setVoting(true);
    try {
      const response = await api.post(`/cases/${id}/vote`, { side });

      // Check if case was auto-closed
      if (response.data.caseClosed) {
        alert(`Vote recorded! Case automatically closed.\nVerdict: ${response.data.verdict}`);
      }

      await fetchCase(); // Refresh case data
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.response?.data?.error || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      POLITICS: 'Politics',
      ROOMMATE_DISPUTES: 'Roommate Disputes',
      RELATIONSHIP_ISSUES: 'Relationship Issues',
      WORKPLACE_CONFLICTS: 'Workplace Conflicts',
      FAMILY_DRAMA: 'Family Drama',
      FRIEND_DISAGREEMENTS: 'Friend Disagreements',
      MONEY_PAYMENTS: 'Money & Payments',
      OTHER: 'Other',
    };
    return labels[category] || category;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
          {error || 'Case not found'}
        </div>
      </div>
    );
  }

  const mediaUrls = Array.isArray(caseData.mediaUrls)
    ? caseData.mediaUrls
    : typeof caseData.mediaUrls === 'string'
      ? JSON.parse(caseData.mediaUrls)
      : [];

  // Check if vote is controversial (close to 50/50)
  const isControversial = Math.abs((caseData.sideAPercentage || 50) - 50) <= 15;
  const isClosed = caseData.status === 'CLOSED';
  const isOwner = user?.id === caseData.userId;

  return (
    <div className="min-h-screen bg-black py-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-400 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Verdict Badge */}
        {isClosed && caseData.verdict && (
          <div className="mb-6 flex justify-center">
            <VerdictBadge verdict={caseData.verdict} margin={caseData.verdictMargin} isOwner={isOwner} />
          </div>
        )}

        {/* Case Closed Banner */}
        {isClosed && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-400">
              🔒 This case was closed on {new Date(caseData.closedAt).toLocaleDateString()}
            </p>
            {caseData.ownerReward > 0 && isOwner && (
              <p className="text-green-400 font-bold mt-2">
                You earned ${caseData.ownerReward} from this case!
              </p>
            )}
          </div>
        )}

        {/* Close Case Button (for owners on active cases) */}
        {!isClosed && isOwner && (
          <div className="mb-6 flex justify-center">
            <CloseCaseButton caseId={id} onClose={() => window.location.reload()} />
          </div>
        )}

        {/* Two Column Layout: Case on Left, Comments on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Case Details & Voting */}
          <div className="lg:col-span-5 space-y-4">
            {/* Case Card */}
            <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden sticky top-6 border border-gray-800">
              {/* Header with Category & Time */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold px-3 py-1.5 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full border border-primary/30">
                    {getCategoryLabel(caseData.category)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {isControversial && (
                      <span className="text-lg" title="Controversial! Close vote">🔥</span>
                    )}
                    <span className="text-sm text-gray-500">{formatTimeAgo(caseData.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{caseData.title}</h1>

                {/* Media - Full image with blur background */}
                {mediaUrls.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="rounded-xl overflow-hidden border border-gray-700 relative bg-gray-950">
                        {/* Blurred background */}
                        <div 
                          className="absolute inset-0 scale-150 blur-2xl opacity-40"
                          style={{ 
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top'
                          }}
                        />
                        {url.includes('video') || url.includes('.mp4') ? (
                          <video 
                            src={url} 
                            controls 
                            className="relative w-full max-h-[600px] object-contain"
                          />
                        ) : (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={url} 
                              alt={`Case media ${index + 1}`} 
                              className="relative w-full max-h-[600px] object-contain hover:opacity-95 transition-opacity cursor-zoom-in"
                            />
                          </a>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 text-center">Click image to view full size</p>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-300 text-base leading-relaxed mb-4 whitespace-pre-wrap">{caseData.description}</p>

                {/* Posted by */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Posted by</span>
                    <button
                      onClick={() => navigate(`/profile/${caseData.user.id}`)}
                      className="font-bold text-primary hover:underline"
                    >
                      @{caseData.user.username}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const shareData = {
                        title: caseData.title,
                        text: `Who's right? Vote on this: ${caseData.title}`,
                        url: window.location.href
                      };
                      if (navigator.share) {
                        navigator.share(shareData);
                      } else {
                        navigator.clipboard.writeText(shareData.url);
                        alert('Link copied! Send to friend 👀');
                      }
                    }}
                    className="text-gray-400 hover:text-primary transition-colors p-2"
                    title="Share case"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Voting Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-6 border-t border-gray-700">
                <h2 className="text-xl font-black mb-4 text-center flex items-center justify-center text-white">
                  Correct Them
                  <span className="ml-2 text-2xl">⚖️</span>
                </h2>

                {caseData.userVote && (
                  <div className="mb-4 text-center p-3 bg-gray-700/60 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-300">
                      You voted: <span className="font-bold text-primary">{caseData.userVote === 'SIDE_A' ? caseData.sideALabel : caseData.sideBLabel}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Change your vote within 24 hours</p>
                  </div>
                )}

                {/* Vote Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => handleVote('SIDE_A')}
                    disabled={voting || isClosed}
                    className={`flex-1 py-4 px-4 rounded-xl font-black text-base transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                      caseData.userVote === 'SIDE_A'
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white ring-4 ring-green-300'
                        : 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    ✓ {caseData.sideALabel}
                  </button>
                  <button
                    onClick={() => handleVote('SIDE_B')}
                    disabled={voting || isClosed}
                    className={`flex-1 py-4 px-4 rounded-xl font-black text-base transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                      caseData.userVote === 'SIDE_B'
                        ? 'bg-gradient-to-br from-red-600 to-red-700 text-white ring-4 ring-red-300'
                        : 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    ✗ {caseData.sideBLabel}
                  </button>
                </div>

                {/* Vote Progress Bar */}
                <div className="bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                    <span>{caseData.sideALabel}</span>
                    <span>{caseData.sideBLabel}</span>
                  </div>
                  <div className="flex h-6 bg-gray-600 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                      style={{ width: `${caseData.sideAPercentage || 50}%` }}
                    >
                      {(caseData.sideAPercentage || 50) > 15 && `${caseData.sideAPercentage || 50}%`}
                    </div>
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                      style={{ width: `${caseData.sideBPercentage || 50}%` }}
                    >
                      {(caseData.sideBPercentage || 50) > 15 && `${caseData.sideBPercentage || 50}%`}
                    </div>
                  </div>
                  <div className="flex justify-between text-2xl font-black mt-3">
                    <span className="text-green-600">{caseData.sideAPercentage || 50}%</span>
                    <span className="text-red-600">{caseData.sideBPercentage || 50}%</span>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-3 font-semibold">
                    🗳️ {caseData.voteCount || 0} {(caseData.voteCount || 0) === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Comments */}
          <div className="lg:col-span-7">
            <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discussion ({caseData._count?.comments || 0})
              </h2>
              <CommentSection caseId={id} isOP={user?.id === caseData.userId} disabled={isClosed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
