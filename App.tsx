
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import Admin from './components/Admin';
import Login from './components/Login';
import { PortfolioData } from './types';
import { Settings, Home, Menu, X, LogOut, Github, Linkedin, Mail } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('portfolio_auth_token')
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Check LocalStorage (User Edits)
      const cached = localStorage.getItem('portfolio_data_cache');
      if (cached) {
        setData(JSON.parse(cached));
      } else {
        // 2. Load Default Data
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Failed to load local data.json");
        const json = await response.json();
        setData(json);
        // Initialize Cache
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
    // Commit to State (Updates UI immediately)
    setData(newData);
    // Commit to Storage (Persists across reloads)
    localStorage.setItem('portfolio_data_cache', JSON.stringify(newData));
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_auth_token');
    setIsAuthenticated(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="text-slate-500 font-bold text-lg animate-pulse">Loading Application...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
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
    { label: 'Work', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleScroll = (id: string) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/50 backdrop-blur-xl bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <button 
            onClick={() => handleScroll('hero')}
            className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-80 transition-opacity tracking-tight"
          >
            {isAdminView ? 'Admin Console' : profile.name}
          </button>

          <div className="hidden md:flex space-x-1 items-center">
            {isAdminView ? (
              <>
                <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-slate-100">
                  <Home size={18} /> <span>View Website</span>
                </Link>
                {isAuthenticated && (
                  <button onClick={onLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-red-50">
                    <LogOut size={18} /> <span>Sign Out</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {navItems.map(item => (
                  <button 
                    key={item.label}
                    onClick={() => handleScroll(item.id)}
                    className="text-slate-600 hover:text-indigo-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-slate-100"
                  >
                    {item.label}
                  </button>
                ))}
                <Link 
                  to={isAuthenticated ? "/admin" : "/login"} 
                  className="ml-2 p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group"
                  aria-label="Admin Settings"
                >
                  <Settings size={20} className="group-hover:rotate-90 transition-transform" />
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-card border-t border-slate-100 py-6 px-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300 absolute w-full bg-white/95">
          {!isAdminView ? (
            <>
              {navItems.map(item => (
                <button 
                  key={item.label}
                  onClick={() => handleScroll(item.id)}
                  className="block w-full text-left font-bold text-slate-700 hover:text-indigo-600 py-3 text-lg border-b border-slate-50 last:border-0"
                >
                  {item.label}
                </button>
              ))}
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="block font-black text-indigo-600 pt-4 mt-2"
              >
                Go to Admin
              </Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className="block font-bold text-slate-700 py-3 text-lg">View Public Site</Link>
              {isAuthenticated && (
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block font-bold text-red-500 w-full text-left py-3 text-lg">Logout</button>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ profile: any }> = ({ profile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-800 pb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight">{profile.name}</h3>
            <p className="text-slate-400 max-w-sm leading-relaxed font-medium">{profile.bio}</p>
          </div>
          <div>
            <h4 className="text-sm font-black mb-6 text-slate-500 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-slate-400 font-bold">
              <li><button onClick={() => handleScroll('hero')} className="hover:text-indigo-400 transition-colors">Top of Page</button></li>
              <li><button onClick={() => handleScroll('experience')} className="hover:text-indigo-400 transition-colors">Experience</button></li>
              <li><button onClick={() => handleScroll('projects')} className="hover:text-indigo-400 transition-colors">Projects</button></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Admin Console</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black mb-6 text-slate-500 uppercase tracking-widest">Connect</h4>
            <div className="flex space-x-4">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-xl hover:bg-indigo-600 transition-all hover:-translate-y-1 shadow-lg shadow-black/20" aria-label="GitHub">
                  <Github size={20} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-xl hover:bg-indigo-600 transition-all hover:-translate-y-1 shadow-lg shadow-black/20" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="p-3 bg-slate-800 rounded-xl hover:bg-indigo-600 transition-all hover:-translate-y-1 shadow-lg shadow-black/20" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 text-center text-slate-500 text-sm font-bold">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default App;
