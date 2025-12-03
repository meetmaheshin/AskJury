import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import CaseCard from '../components/CaseCard';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfile();
    fetchUserCases();
    fetchUserStats();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setProfile(response.data.user);
      setEditForm({
        username: response.data.user.username,
        bio: response.data.user.bio || '',
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCases = async () => {
    try {
      const response = await api.get(`/users/${id}/cases`);
      setCases(response.data.cases);
    } catch (err) {
      console.error('Error fetching user cases:', err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/users/${id}/stats`);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${id}`, editForm);
      setProfile(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
          {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-8 border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-2">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                      className="input"
                      placeholder="Username"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="input"
                      placeholder="Bio"
                      rows="2"
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="btn btn-primary text-sm">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            username: profile.username,
                            bio: profile.bio || '',
                          });
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                      {profile.username}
                    </h1>
                    {profile.bio && (
                      <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2">{profile.bio}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Joined {formatDate(profile.createdAt)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary w-full sm:w-auto flex-shrink-0"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {profile._count.cases}
              </div>
              <div className="text-sm text-gray-400">Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {profile._count.votes}
              </div>
              <div className="text-sm text-gray-400">Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {profile._count.comments}
              </div>
              <div className="text-sm text-gray-400">Comments</div>
            </div>
          </div>
        </div>

        {/* Earnings & Stats Card */}
        {stats && (
          <div className="bg-gradient-to-br from-warning/10 to-yellow-900/20 rounded-xl shadow-md p-6 mb-8 border border-warning/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center mb-4">
                <svg className="w-6 h-6 mr-2 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Earnings Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Comment Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${stats.commentEarnings || stats.earnings || '0.00'}</p>
                  <p className="text-xs text-gray-500 mt-1">From upvoted comments</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Case Earnings</p>
                  <p className="text-2xl font-bold text-blue-400">${stats.caseEarnings || '0.00'}</p>
                  <p className="text-xs text-gray-500 mt-1">From winning cases</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-warning/30">
                  <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-warning">${stats.totalEarnings || stats.earnings || '0.00'}</p>
                  <p className="text-xs text-gray-500 mt-1">All-time total</p>
                </div>
              </div>

              {/* Verdict Stats */}
              {(stats.casesWon !== undefined || stats.casesLost !== undefined) && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <p className="text-3xl font-bold text-green-400">{stats.casesWon || 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Cases Won</p>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <p className="text-3xl font-bold text-red-400">{stats.casesLost || 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Cases Lost</p>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <p className="text-3xl font-bold text-yellow-400">{stats.casesTied || 0}</p>
                    <p className="text-sm text-gray-400 mt-1">Cases Tied</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Upvotes</span>
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mt-1">{stats.totalUpvotes}</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Downvotes</span>
                  <svg className="w-4 h-4 text-danger" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mt-1">{stats.totalDownvotes}</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Comments</span>
                  <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mt-1">{stats.commentCount}</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Votes Cast</span>
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-white mt-1">{stats.voteCount}</div>
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-lg p-3 border border-warning/20">
              <p className="text-sm text-gray-300 text-center">
                Keep contributing helpful comments to earn more! <span className="font-bold text-warning">$1 per 1000 upvotes</span>
              </p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isOwnProfile ? 'Your Cases' : `${profile.username}'s Cases`}
          </h2>

          {cases.length === 0 ? (
            <div className="bg-gray-900 rounded-lg shadow-md p-8 text-center border border-gray-800">
              <p className="text-gray-500">No cases submitted yet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
