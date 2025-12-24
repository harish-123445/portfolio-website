
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, ArrowRight } from 'lucide-react';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        localStorage.setItem('portfolio_auth_token', 'session_token');
        onLogin();
        navigate('/admin');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
             <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your content</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm font-semibold text-center">{error}</div>}

          <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 items-center">
             <span className="uppercase tracking-wider font-bold text-[10px] text-slate-400 mb-1">Demo Credentials</span>
             <div className="font-mono bg-white px-2 py-1 rounded border border-slate-200">admin / password123</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
