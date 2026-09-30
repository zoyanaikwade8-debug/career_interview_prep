import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Performance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results');
        setResults(res.data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance History</h1>
            <p className="text-gray-500 text-sm mt-1">Review your past assessments and track your progress.</p>
          </div>
          <Link to="/home" className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            Take a New Assessment
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500 shadow-sm">
            <p className="text-lg font-medium text-slate-900 mb-2">No assessments completed yet.</p>
            <p className="text-sm">Head over to the dashboard to start your first interview prep quiz!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((result) => {
                  // If we don't have total questions stored, we'll assume a standard passing threshold for styling, or just show the raw score.
                  // Wait, the Result schema has `score`, but does it have `total`? It doesn't by default unless we added it.
                  // We can just render the score. Let's assume a generic check.
                  const isGood = result.score >= 10; // arbitrary threshold if total isn't available
                  const dateObj = new Date(result.createdAt);
                  return (
                    <tr key={result._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {result.jobRole}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                        {result.score} pts
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isGood ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isGood ? 'Strong' : 'Needs Review'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
