import React, { useEffect, useState } from 'react';
import { getEntries, deleteEntry } from '../api';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(id);
        toast.success('Entry deleted');
        fetchEntries();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading entries...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Date</th>
              <th scope="col" className="px-6 py-4 font-semibold">Trades</th>
              <th scope="col" className="px-6 py-4 font-semibold">Win/Loss</th>
              <th scope="col" className="px-6 py-4 font-semibold">Profit</th>
              <th scope="col" className="px-6 py-4 font-semibold">Loss</th>
              <th scope="col" className="px-6 py-4 font-semibold">Net PnL</th>
              <th scope="col" className="px-6 py-4 font-semibold">Psychology</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No journal entries found. Add your first trade!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {format(parseISO(entry.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">{entry.tradesTaken}</td>
                  <td className="px-6 py-4">{entry.numberOfWins} / {entry.numberOfLosses}</td>
                  <td className="px-6 py-4 text-green-600">${entry.totalProfit.toFixed(2)}</td>
                  <td className="px-6 py-4 text-red-600">${entry.totalLoss.toFixed(2)}</td>
                  <td className={`px-6 py-4 font-semibold ${entry.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${entry.netPnl.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.psychology === 'Excellent' ? 'bg-green-100 text-green-700' : 
                      entry.psychology === 'Good' ? 'bg-blue-100 text-blue-700' :
                      entry.psychology === 'Poor' || entry.psychology === 'Terrible' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.psychology}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalEntries;
