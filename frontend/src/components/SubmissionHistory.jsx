import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import axiosClient from '../utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Using your specific route for submitted problems
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Submission History</h2>
      
      {submissions.length === 0 ? (
        <div className="alert alert-info">No submissions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-200">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={`badge ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>{sub.runtime}s</td>
                  <td className="text-xs">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-xs btn-outline" onClick={() => setSelectedSubmission(sub)}>
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL SECTION */}
      {selectedSubmission && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col relative">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold">Submission Details</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setSelectedSubmission(null)}>✕</button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex gap-4 mb-4">
                 <span className={`badge badge-lg ${getStatusColor(selectedSubmission.status)}`}>{selectedSubmission.status}</span>
                 <span className="text-gray-400 font-mono text-sm">Runtime: {selectedSubmission.runtime}s</span>
              </div>

              <div className="rounded-lg overflow-hidden border border-white/5 bg-[#0d1117]">
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-right">
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SubmissionHistory;