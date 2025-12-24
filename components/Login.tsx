
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2, Info, ShieldCheck } from 'lucide-react';

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

    // Simulate a brief security check delay for UX
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        // Set secure token in local storage
        localStorage.setItem('portfolio_auth_token', 'secure_session_token_client');
        onLogin();
        navigate('/admin');
      } else {
        setError('Incorrect username or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 transform rotate-3">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">Secure access to portfolio management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center justify-center font-bold text-sm animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="bg-indigo-50 p-5 rounded-2xl flex items-start gap-4 border border-indigo-100">
            <Info className="text-indigo-600 shrink-0 mt-1" size={20} />
            <div className="text-sm text-indigo-800">
              <span className="font-black block mb-1">Access Credentials</span>
              <div className="flex flex-col gap-1 font-mono text-xs">
                <span className="bg-white/50 px-2 py-1 rounded w-fit">User: admin</span>
                <span className="bg-white/50 px-2 py-1 rounded w-fit">Pass: password123</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <span>Authenticate</span>
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
