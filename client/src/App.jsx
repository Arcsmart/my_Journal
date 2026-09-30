import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JournalEntries from './pages/JournalEntries';
import NewEntry from './pages/NewEntry';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entries" element={<JournalEntries />} />
          <Route path="new" element={<NewEntry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
