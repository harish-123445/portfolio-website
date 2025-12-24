
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import Admin from './components/Admin';
import Login from './components/Login';
import { PortfolioData } from './types';
import { Settings, Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('portfolio_auth_token')
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const cached = localStorage.getItem('portfolio_data_cache');
      if (cached) {
        setData(JSON.parse(cached));
      } else {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Failed to load local data.json");
        const json = await response.json();
        setData(json);
        localStorage.setItem('portfolio_data_cache', JSON.stringify(json));
      }
    } catch (err) {
      console.error('Data initialization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('portfolio_data_cache', JSON.stringify(newData));
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_auth_token');
    setIsAuthenticated(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
        <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} profile={data.profile} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Portfolio data={data} />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route 
              path="/admin" 
              element={isAuthenticated ? <Admin data={data} onUpdate={handleUpdate} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer profile={data.profile} />
      </div>
    </HashRouter>
  );
};

const Navigation: React.FC<{ isAuthenticated: boolean; onLogout: () => void; profile: any }> = ({ isAuthenticated, onLogout, profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminView = location.pathname.includes('/admin') || location.pathname.includes('/login');

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleScroll = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div 
            onClick={() => handleScroll('hero')}
            className="text-xl font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors tracking-tight"
          >
            {isAdminView ? 'Admin Console' : profile.name}
          </div>

          <div className="hidden md:flex space-x-1 items-center">
            {isAdminView ? (
              <>
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-full hover:bg-slate-50">
                  View Website
                </Link>
                {isAuthenticated && (
                  <button onClick={onLogout} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-4 py-2 rounded-full hover:bg-red-50">
                    Log Out
                  </button>
                )}
              </>
            ) : (
              <>
                {navItems.map(item => (
                  <button 
                    key={item.label}
                    onClick={() => handleScroll(item.id)}
                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-full hover:bg-slate-50"
                  >
                    {item.label}
                  </button>
                ))}
                <Link 
                  to={isAuthenticated ? "/admin" : "/login"} 
                  className="ml-2 text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
                  aria-label="Admin"
                >
                  <Settings size={20} />
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 hover:bg-slate-50 rounded-lg">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2 absolute w-full shadow-xl">
          {!isAdminView ? (
            <>
              {navItems.map(item => (
                <button 
                  key={item.label}
                  onClick={() => handleScroll(item.id)}
                  className="block w-full text-left font-semibold text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-100 my-2 pt-2">
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)} 
                  className="block text-sm font-bold text-slate-400 py-3 px-4 hover:text-slate-900"
                >
                  Admin Login
                </Link>
              </div>
            </>
          ) : (
            <Link to="/" onClick={() => setIsOpen(false)} className="block font-semibold text-slate-700 py-3 px-4">Back to Site</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ profile: any }> = ({ profile }) => {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <div className="mb-8">
           <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{profile.name}</h3>
        </div>
        
        <div className="flex space-x-8 mb-8">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors hover:-translate-y-1 transform duration-300"><Github size={24} /></a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors hover:-translate-y-1 transform duration-300"><Linkedin size={24} /></a>
          )}
          <a href={`mailto:${profile.email}`} className="text-slate-400 hover:text-red-500 transition-colors hover:-translate-y-1 transform duration-300"><Mail size={24} /></a>
        </div>
        
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default App;
