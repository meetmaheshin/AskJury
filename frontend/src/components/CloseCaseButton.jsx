/**
 * Close Case Button Component
 * Allows case owner to manually close their case
 */

import { useState } from 'react';
import api from '../utils/api';

export default function CloseCaseButton({ caseId, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = async () => {
    try {
      setIsClosing(true);
      const response = await api.post(`/cases/${caseId}/close`);

      // Show success message
      const verdictText = response.data.verdict === 'SIDE_A_WINS' ? 'You Won!' :
                         response.data.verdict === 'SIDE_B_WINS' ? 'You Lost' : 'Tied';

      alert(`Case closed!\nVerdict: ${verdictText}\nYou earned: $${response.data.ownerReward}`);

      if (onClose) onClose(response.data);

    } catch (error) {
      console.error('Error closing case:', error);
      alert(error.response?.data?.error || 'Failed to close case');
    } finally {
      setIsClosing(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        disabled={isClosing}
      >
        Close Case & Get Verdict
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Close This Case?</h3>
            <p className="text-gray-300 mb-6">
              Once closed, no more votes or comments can be added. The verdict will be final based on current votes.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 transition-all"
                disabled={isClosing}
              >
                {isClosing ? 'Closing...' : 'Yes, Close It'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
