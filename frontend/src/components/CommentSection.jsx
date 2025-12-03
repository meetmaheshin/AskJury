import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const CommentSection = ({ caseId, isOP, disabled = false }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [caseId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/case/${caseId}`);
      setComments(response.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments', {
        caseId,
        content: newComment,
      });
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments', {
        caseId,
        content: replyText,
        parentId,
      });
      setReplyText('');
      setReplyingTo(null);
      await fetchComments();
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/comments/${commentId}/upvote`);
      await fetchComments();
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleDownvote = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/comments/${commentId}/downvote`);
      await fetchComments();
    } catch (err) {
      console.error('Error downvoting:', err);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + 'y';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    return Math.floor(seconds) + 's';
  };

  const Comment = ({ comment, isReply = false }) => {
    const isCommentOP = comment.user.id === comment.userId;

    return (
      <div className={`${isReply ? 'ml-12 mt-2' : 'mb-4'}`}>
        <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/profile/${comment.user.id}`)}
                className="font-medium text-white hover:text-primary"
              >
                {comment.user.username}
              </button>
              {isOP && comment.user.id === user?.id && (
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">OP</span>
              )}
              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>

          <p className="text-gray-300 mb-3 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleUpvote(comment.id)}
              disabled={disabled}
              className={`flex items-center space-x-1 text-gray-400 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-green-500'}`}
            >
              <span>↑</span>
              <span>{comment.upvotes}</span>
            </button>
            <button
              onClick={() => handleDownvote(comment.id)}
              disabled={disabled}
              className={`flex items-center space-x-1 text-gray-400 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-red-500'}`}
            >
              <span>↓</span>
              <span>{comment.downvotes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                disabled={disabled}
                className={`text-gray-400 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-primary'}`}
              >
                Reply
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="input min-h-[80px]"
                rows="3"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  type="submit"
                  disabled={submitting || !replyText.trim()}
                  className="btn btn-primary text-sm disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="btn btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Comments ({comments.length})</h2>

      {disabled ? (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg text-center border border-gray-700">
          <p className="text-gray-400">
            🔒 This case is closed. Comments and voting are disabled.
          </p>
        </div>
      ) : isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="input min-h-[100px]"
            rows="4"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="btn btn-primary mt-2 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg text-center border border-gray-700">
          <p className="text-gray-400">
            <button onClick={() => navigate('/login')} className="text-primary font-medium hover:underline">
              Sign in
            </button>{' '}
            to leave a comment
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
      ) : (
        <div>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
