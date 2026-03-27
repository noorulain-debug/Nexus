import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import  {Joyride, Step}  from 'react-joyride';
import { useState, useEffect } from 'react';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [run, setRun] = useState(false);
  const steps: Step[] = [
  {
    target: ".dashboard-home",
    content: "This is your dashboard overview",
  },
  {
    target: ".sidebar-calendar",
    content: "Schedule meetings here 📅",
  },
  {
    target: ".sidebar-wallet",
    content: "Manage your payments 💳",
  },
  {
    target: ".sidebar-documents",
    content: "Upload and sign documents 📄",
  },
];
 //  Auto-start tour only first time
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("nexus-tour-seen");

    if (!hasSeenTour) {
      setRun(true);
      localStorage.setItem("nexus-tour-seen", "true");
    }
  }, []);
  if (isLoading) {
    return (
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        
      />
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <button
        onClick={() => setRun(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Take Tour
      </button>
    </div>
  );
};