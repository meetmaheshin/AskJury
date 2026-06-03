import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { CATEGORIES, CATEGORY_GROUPS } from '../utils/categories';

const SubmitCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [postType, setPostType] = useState('JUDGE');
  const [companyName, setCompanyName] = useState('');
  const [sideALabel, setSideALabel] = useState("You're valid");
  const [sideBLabel, setSideBLabel] = useState("You're overreacting");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

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

    if (title.length < 10 || title.length > 120) {
      setError('Title must be between 10 and 120 characters');
      return;
    }

    if (description.length < 20 || description.length > 2000) {
      setError('Description must be between 20 and 2000 characters');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('postType', postType);
      if (companyName.trim()) {
        formData.append('companyName', companyName.trim());
      }
      // Side labels matter for judge + challenge (the two stances).
      if (postType === 'JUDGE' || postType === 'CHALLENGE') {
        formData.append('sideALabel', sideALabel);
        formData.append('sideBLabel', sideBLabel);
      }

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

  const selectPostType = (type) => {
    setPostType(type);
    if (type === 'CHALLENGE') { setSideALabel(''); setSideBLabel(''); }
    else if (type === 'JUDGE') { setSideALabel("You're valid"); setSideBLabel("You're overreacting"); }
  };

  const isChallenge = postType === 'CHALLENGE';

  return (
    <div className="min-h-screen bg-black py-8 pb-28 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-2">{isChallenge ? 'Start an argument ⚔️' : 'Get it off your chest'}</h1>
          <p className="text-gray-400 mb-6">{isChallenge ? 'Stake a claim. Someone takes the other side. The crowd decides who wins.' : 'Rant about work. Vent for reactions, or put it to the jury for a verdict.'}</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post type toggle */}
            <div>
              <label className="label">Post type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => selectPostType('VENT')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    postType === 'VENT' ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/40' : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-white">😤 Vent</p>
                  <p className="text-xs text-gray-400 mt-1">Just rant. People react.</p>
                </button>
                <button
                  type="button"
                  onClick={() => selectPostType('JUDGE')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    postType === 'JUDGE' ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-white">⚖️ Judge</p>
                  <p className="text-xs text-gray-400 mt-1">Jury votes who's right.</p>
                </button>
                <button
                  type="button"
                  onClick={() => selectPostType('CHALLENGE')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    postType === 'CHALLENGE' ? 'border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400/40' : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-white">⚔️ Challenge</p>
                  <p className="text-xs text-gray-400 mt-1">1v1 debate. Crowd backs a side.</p>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="label">
                {isChallenge ? 'The claim' : 'Title'} <span className="text-gray-500 text-sm">({title.length}/120)</span>
              </label>
              <input
                type="text"
                id="title"
                className="input"
                placeholder={isChallenge ? 'Pineapple belongs on pizza' : 'My manager just...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{isChallenge ? 'The debate topic — keep it punchy.' : 'Be clear and concise'}</p>
            </div>

            <div>
              <label htmlFor="description" className="label">
                {isChallenge ? 'Your opening argument' : 'Description'} <span className="text-gray-500 text-sm">({description.length}/2000)</span>
              </label>
              <textarea
                id="description"
                className="input min-h-[200px]"
                placeholder={isChallenge ? 'Make your case. Your rival will counter — bring your best points.' : 'Tell the story in detail...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows="8"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{isChallenge ? "Your side of the argument. Someone will accept the other side." : 'Include all relevant details'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                    <optgroup key={group} label={group}>
                      {cats.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="companyName" className="label">
                  Company (optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="input"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">Tag the company this is about</p>
              </div>
            </div>

            {(postType === 'JUDGE' || isChallenge) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sideALabel" className="label">
                    {isChallenge ? 'Your stance' : 'Side A Label'}
                  </label>
                  <input
                    type="text"
                    id="sideALabel"
                    className="input"
                    placeholder={isChallenge ? 'Pineapple: yes' : "You're valid"}
                    value={sideALabel}
                    onChange={(e) => setSideALabel(e.target.value)}
                    maxLength={50}
                    required={isChallenge}
                  />
                </div>
                <div>
                  <label htmlFor="sideBLabel" className="label">
                    {isChallenge ? "Rival's stance" : 'Side B Label'}
                  </label>
                  <input
                    type="text"
                    id="sideBLabel"
                    className="input"
                    placeholder={isChallenge ? 'Pineapple: no' : "You're overreacting"}
                    value={sideBLabel}
                    onChange={(e) => setSideBLabel(e.target.value)}
                    maxLength={50}
                    required={isChallenge}
                  />
                </div>
              </div>
            )}

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
                {loading ? 'Posting...' : isChallenge ? 'Start the Challenge ⚔️' : postType === 'VENT' ? 'Post Rant' : 'Submit to Jury'}
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
