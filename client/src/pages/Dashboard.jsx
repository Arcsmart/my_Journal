import React, { useEffect, useState } from 'react';
import { getEntries } from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { TrendingUp, TrendingDown, Target, Activity, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard...</div>;
  }

  // Calculate totals
  const totalTrades = entries.reduce((sum, entry) => sum + entry.tradesTaken, 0);
  const totalWins = entries.reduce((sum, entry) => sum + entry.numberOfWins, 0);
  const totalLosses = entries.reduce((sum, entry) => sum + entry.numberOfLosses, 0);
  const winRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;
  
  const totalProfit = entries.reduce((sum, entry) => sum + entry.totalProfit, 0);
  const totalLoss = entries.reduce((sum, entry) => sum + entry.totalLoss, 0);
  const netPnl = totalProfit - totalLoss;

  // Prepare chart data
  const chartData = [...entries].reverse().map(entry => ({
    date: format(parseISO(entry.date), 'MMM dd'),
    profit: entry.totalProfit,
    loss: entry.totalLoss,
    net: entry.netPnl,
    trades: entry.tradesTaken
  }));

  // Create custom tile class for calendar dates with trades
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      const entryForDate = entries.find(e => {
        const entryDate = parseISO(e.date);
        return format(entryDate, 'yyyy-MM-dd') === dateString;
      });

      if (entryForDate) {
        return entryForDate.netPnl >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Net PnL</p>
              <h3 className={`text-2xl font-bold ${netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${netPnl >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {netPnl >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Win Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">{winRate}%</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Trades</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalTrades}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">W / L Ratio</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalWins} / {totalLosses}</h3>
            </div>
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">PnL Over Time</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Net PnL" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit vs Loss per Day</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loss" fill="#ef4444" name="Loss" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Calendar & Recent */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trading Calendar</h3>
            <div className="calendar-container">
              <Calendar 
                className="w-full border-none rounded-lg font-sans"
                tileClassName={tileClassName}
              />
            </div>
            <style jsx>{`
              .calendar-container .react-calendar {
                width: 100%;
                border: none;
                font-family: inherit;
              }
              .react-calendar__tile {
                padding: 0.75em 0.5em;
                border-radius: 0.375rem;
              }
              .react-calendar__tile--now {
                background: #f3f4f6;
              }
              .react-calendar__tile--active {
                background: #3b82f6 !important;
                color: white !important;
              }
            `}</style>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Lessons</h3>
            <div className="space-y-4">
              {entries.slice(0, 3).map(entry => (
                <div key={entry._id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM dd, yyyy')}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.psychology === 'Excellent' ? 'bg-green-100 text-green-700' : 
                      entry.psychology === 'Good' ? 'bg-blue-100 text-blue-700' :
                      entry.psychology === 'Poor' || entry.psychology === 'Terrible' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.psychology}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 italic">"{entry.lessonLearned || 'No lesson recorded.'}"</p>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-gray-500">No entries yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
