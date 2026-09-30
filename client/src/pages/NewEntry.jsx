import React, { useState } from 'react';
import { createEntry } from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NewEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tradesTaken: '',
    numberOfWins: '',
    numberOfLosses: '',
    totalProfit: '',
    totalLoss: '',
    lessonLearned: '',
    psychology: 'Neutral'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tradesTaken: Number(formData.tradesTaken),
        numberOfWins: Number(formData.numberOfWins),
        numberOfLosses: Number(formData.numberOfLosses),
        totalProfit: Number(formData.totalProfit),
        totalLoss: Number(formData.totalLoss),
      };
      
      await createEntry(payload);
      toast.success('Journal entry added!');
      navigate('/entries');
    } catch (error) {
      const backendError =
        error.response?.data?.message || "Failed to create entry";

      console.error("Backend Error Details:", backendError);
      toast.error(`Database Error: ${backendError}`, { duration: 5000 });
      console.error(error);
      toast.error('Failed to create entry. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Log New Trade Day</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trades Taken</label>
            <input 
              type="number" 
              name="tradesTaken"
              value={formData.tradesTaken}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Winning Trades</label>
            <input 
              type="number" 
              name="numberOfWins"
              value={formData.numberOfWins}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Losing Trades</label>
            <input 
              type="number" 
              name="numberOfLosses"
              value={formData.numberOfLosses}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Profit ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="totalProfit"
              value={formData.totalProfit}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Loss ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="totalLoss"
              value={formData.totalLoss}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Psychology / Emotional State</label>
          <select 
            name="psychology"
            value={formData.psychology}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Excellent">Excellent - Followed plan perfectly</option>
            <option value="Good">Good - Minor mistakes but disciplined</option>
            <option value="Neutral">Neutral - Average trading day</option>
            <option value="Poor">Poor - Let emotions take over</option>
            <option value="Terrible">Terrible - Revenge trading, broke all rules</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lessons Learned</label>
          <textarea 
            name="lessonLearned"
            value={formData.lessonLearned}
            onChange={handleChange}
            rows="4"
            placeholder="What did you learn today? What could you improve?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEntry;
