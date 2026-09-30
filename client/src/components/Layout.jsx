import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">MyJournal</h1>
          <p className="text-blue-300 text-sm mt-1">Forex Trading Journal</p>
        </div>
        
        <nav className="flex-1 mt-6">
          <Link to="/" className={`flex items-center px-6 py-3 transition-colors ${isActive('/')}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/entries" className={`flex items-center px-6 py-3 transition-colors ${isActive('/entries')}`}>
            <BookOpen className="w-5 h-5 mr-3" />
            Journal Entries
          </Link>
          <Link to="/new" className={`flex items-center px-6 py-3 transition-colors ${isActive('/new')}`}>
            <PlusCircle className="w-5 h-5 mr-3" />
            New Entry
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/entries' && 'Journal Entries'}
            {location.pathname === '/new' && 'Add New Entry'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              T
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
