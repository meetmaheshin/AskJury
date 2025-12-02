import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const SubmitCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [sideALabel, setSideALabel] = useState("You're Right");
  const [sideBLabel, setSideBLabel] = useState("You're Wrong");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'POLITICS', label: 'Politics' },
    { value: 'ROOMMATE_DISPUTES', label: 'Roommate Disputes' },
    { value: 'RELATIONSHIP_ISSUES', label: 'Relationship Issues' },
    { value: 'WORKPLACE_CONFLICTS', label: 'Workplace Conflicts' },
    { value: 'FAMILY_DRAMA', label: 'Family Drama' },
    { value: 'FRIEND_DISAGREEMENTS', label: 'Friend Disagreements' },
    { value: 'MONEY_PAYMENTS', label: 'Money & Payments' },
    { value: 'OTHER', label: 'Other' },
  ];

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setError('Maximum 3 files allowed');
      return;
    }

    setFiles(selectedFiles);

    const newPreviews = selectedFiles.map((file) => {
      if (file.type.startsWith('image/')) {
        return { type: 'image', url: URL.createObjectURL(file) };
      } else if (file.type.startsWith('video/')) {
        return { type: 'video', url: URL.createObjectURL(file) };
      }
      return null;
    });

    setPreviews(newPreviews.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.length < 10 || title.length > 100) {
      setError('Title must be between 10 and 100 characters');
      return;
    }

    if (description.length < 20 || description.length > 1000) {
      setError('Description must be between 20 and 1000 characters');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('sideALabel', sideALabel);
      formData.append('sideBLabel', sideBLabel);

      files.forEach((file) => {
        formData.append('media', file);
      });

      const response = await api.post('/cases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/case/${response.data.case.id}`);
    } catch (err) {
      console.error('Error submitting case:', err);
      setError(err.response?.data?.error || 'Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Case</h1>
          <p className="text-gray-400 mb-6">Share your dispute and let the community decide who's right</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="label">
                Title <span className="text-gray-500 text-sm">({title.length}/100)</span>
              </label>
              <input
                type="text"
                id="title"
                className="input"
                placeholder="Am I wrong for..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Be clear and concise</p>
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description <span className="text-gray-500 text-sm">({description.length}/1000)</span>
              </label>
              <textarea
                id="description"
                className="input min-h-[200px]"
                placeholder="Tell your story in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows="8"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Include all relevant details</p>
            </div>

            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sideALabel" className="label">
                  Side A Label (Optional)
                </label>
                <input
                  type="text"
                  id="sideALabel"
                  className="input"
                  placeholder="You're Right"
                  value={sideALabel}
                  onChange={(e) => setSideALabel(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div>
                <label htmlFor="sideBLabel" className="label">
                  Side B Label (Optional)
                </label>
                <input
                  type="text"
                  id="sideBLabel"
                  className="input"
                  placeholder="You're Wrong"
                  value={sideBLabel}
                  onChange={(e) => setSideBLabel(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label htmlFor="media" className="label">
                Media (Optional)
              </label>
              <input
                type="file"
                id="media"
                className="input"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">Up to 3 images or videos (max 50MB each)</p>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {preview.type === 'image' ? (
                        <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                      ) : (
                        <video src={preview.url} className="w-full h-32 object-cover" controls />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Case'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitCase;
