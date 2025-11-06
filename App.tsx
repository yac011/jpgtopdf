import React, { useState, useCallback, useEffect } from 'react';
// FIX: Corrected import path casing to use lowercase 'toast.tsx' to resolve module resolution conflict.
import { Toast } from './components/toast';
import { ToastState, Page } from './types';
import { PdfIcon } from './components/Icons';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import AboutPage from './pages/AboutPage';

interface AppHeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentPage, onNavigate }) => {
  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'tools', label: 'Tools' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-slate-900/75 border-b border-slate-700/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center space-x-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 -ml-1">
            <PdfIcon className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white hidden sm:inline">JPG to PDF Pro</span>
          </button>
          <nav className="flex items-center space-x-4 sm:space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

const AppFooter: React.FC = () => (
  <footer className="w-full py-6 mt-auto border-t border-slate-800">
    <div className="text-center text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} JPG to PDF Converter Pro. All rights reserved.</p>
      <p className="mt-1">Made with ❤️ by a world-class AI engineer.</p>
    </div>
  </footer>
);

const getPageFromHash = (): Page => {
  const hash = window.location.hash.substring(2); // Remove '#/'
  if (hash === 'tools' || hash === 'about') {
    return hash;
  }
  return 'home';
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(getPageFromHash());
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash());
    };
    
    handleHashChange(); // Set initial page on load

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    switch (page) {
      case 'tools':
        document.title = 'Converter Tool | JPG to PDF Pro';
        break;
      case 'about':
        document.title = 'About Us | JPG to PDF Pro';
        break;
      case 'home':
      default:
        document.title = 'JPG to PDF Pro - Free & Secure Image to PDF Converter';
        break;
    }
    window.scrollTo(0, 0);
  }, [page]);

  const handleNavigate = (newPage: Page) => {
    window.location.hash = `/${newPage}`;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };
  
  const renderPage = () => {
    switch (page) {
      case 'tools':
        return <ToolsPage showToast={showToast} />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return <HomePage onNavigate={() => handleNavigate('tools')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AppHeader currentPage={page} onNavigate={handleNavigate} />

      <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
      
      <AppFooter />
    </div>
  );
};

export default App;