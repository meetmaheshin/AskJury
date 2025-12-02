import { Link } from 'react-router-dom';
import { useState } from 'react';

const CaseCard = ({ caseItem }) => {
  const [imageError, setImageError] = useState(false);
  
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

  const mediaUrls = Array.isArray(caseItem.mediaUrls)
    ? caseItem.mediaUrls
    : typeof caseItem.mediaUrls === 'string'
      ? JSON.parse(caseItem.mediaUrls)
      : [];

  const hasValidImage = mediaUrls.length > 0 && !imageError;

  return (
    <Link to={`/case/${caseItem.id}`} className="block group h-full">
      <div className="relative rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-800/50 hover:border-primary/30 h-full min-h-[280px]">
        
        {/* Background Image (if exists) */}
        {hasValidImage && (
          <>
            {/* Full background image */}
            <img 
              src={mediaUrls[0]} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={() => setImageError(true)}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </>
        )}
        
        {/* Fallback background for cards without images */}
        {!hasValidImage && (
          <div className="absolute inset-0 bg-gray-900" />
        )}

        {/* Glass content overlay */}
        <div className="relative z-10 h-full flex flex-col min-h-[280px]">
          
          {/* Header with user info */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 backdrop-blur-sm bg-black/20">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/20">
                {caseItem.user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white text-sm drop-shadow-lg">{caseItem.user.username}</p>
                <p className="text-xs text-gray-300">{formatTimeAgo(caseItem.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Image indicator */}
              {hasValidImage && (
                <div className="flex items-center bg-white/10 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full border border-white/20">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  {mediaUrls.length}
                </div>
              )}
              <span className="text-xs font-medium px-2.5 py-1 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20">
                {getCategoryLabel(caseItem.category)}
              </span>
            </div>
          </div>

          {/* Content - Glass effect */}
          <div className="px-4 py-4 flex-grow backdrop-blur-[2px]">
            <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug drop-shadow-lg">
              {caseItem.title}
            </h3>

            <p className="text-gray-200 text-sm line-clamp-2 leading-relaxed drop-shadow">
              {caseItem.description}
            </p>
          </div>

          {/* Voting bar - Glass effect */}
          <div className="px-4 py-3 backdrop-blur-md bg-black/40 border-t border-white/10">
            <div className="flex justify-between items-center text-xs font-medium mb-2">
              <span className="text-green-400 flex items-center truncate max-w-[45%] drop-shadow">
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="truncate">{caseItem.sideALabel}</span>
              </span>
              <span className="text-red-400 flex items-center truncate max-w-[45%] drop-shadow">
                <span className="truncate">{caseItem.sideBLabel}</span>
                <svg className="w-3.5 h-3.5 ml-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
              </span>
            </div>
            <div className="relative flex h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${caseItem.sideAPercentage || 50}%` }}
              />
              <div
                className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${caseItem.sideBPercentage || 50}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold mt-1.5">
              <span className="text-green-400 drop-shadow">{caseItem.sideAPercentage || 50}%</span>
              <span className="text-red-400 drop-shadow">{caseItem.sideBPercentage || 50}%</span>
            </div>
          </div>

          {/* Footer with stats - Glass effect */}
          <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between backdrop-blur-md bg-black/40">
            <div className="flex items-center space-x-4 text-gray-300 text-sm">
              <span className="flex items-center font-medium">
                <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {caseItem.voteCount || caseItem._count?.votes || 0}
              </span>
              <span className="flex items-center font-medium">
                <svg className="w-4 h-4 mr-1 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {caseItem._count?.comments || 0}
              </span>
            </div>
            <span className="text-primary font-semibold text-sm group-hover:text-white transition-colors">
              Correct Them →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;
