
import React, { useState } from 'react';
import { PortfolioData } from '../types';
import { ExternalLink, User, Briefcase, Code, GraduationCap, Layers, Send, CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';

interface PortfolioProps {
  data: PortfolioData;
}

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('idle');
    
    try {
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      existingMessages.push({ ...contactForm, date: new Date().toISOString() });
      localStorage.setItem('contact_messages', JSON.stringify(existingMessages));

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setStatus('success');
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Submission error:", err);
      setStatus('error');
    } finally {
      setIsSending(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      
      {/* Hero Section */}
      <section id="hero" className="flex flex-col md:flex-row items-center justify-between gap-12 py-16 scroll-mt-32">
        <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black tracking-wide border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Available for Collaboration
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
            Architect.<br />
            Engineer.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Creator.</span>
          </h1>
          <p className="text-2xl text-slate-600 font-medium max-w-lg leading-relaxed">
            I'm <span className="text-slate-900 font-bold">{data.profile.name}</span>, a {data.profile.title} transforming complex ideas into elegant digital solutions.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transform hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 group"
            >
              View My Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black hover:border-indigo-400 hover:text-indigo-600 active:scale-95 transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>
        <div className="relative group animate-in zoom-in duration-700 delay-200">
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-[2rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-100">
            <img 
              src={data.profile.photo_url} 
              alt={data.profile.name} 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-10">
          <Briefcase className="text-indigo-600" size={32} />
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Experience</h2>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {data.experience.map((exp) => (
            <div key={exp.id} className="group relative glass-card p-10 rounded-[2rem] hover:border-indigo-300 transition-all hover:shadow-2xl hover:shadow-indigo-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{exp.role}</h3>
                  <p className="text-indigo-600 text-lg font-black">{exp.company}</p>
                </div>
                <div className="px-6 py-2 bg-slate-100 rounded-full text-sm font-black text-slate-500 whitespace-nowrap border border-slate-200">
                  {exp.period}
                </div>
              </div>
              <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-4xl">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Bar */}
      <section id="skills" className="py-12 scroll-mt-24">
        <div className="flex items-center space-x-3 mb-10 justify-center">
          <Code className="text-indigo-600" size={32} />
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Technical Stack</h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
          {data.skills.map((skill) => (
            <span key={skill} className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all cursor-default select-none transform hover:-translate-y-1">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-10">
          <Layers className="text-indigo-600" size={32} />
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Portfolio</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.projects.map((project) => (
            <div key={project.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-indigo-400 hover:shadow-2xl transition-all flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-slate-50 relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-8 py-4 bg-white/90 backdrop-blur rounded-2xl text-indigo-600 font-black shadow-xl scale-90 group-hover:scale-100 transition-transform">Explore More</span>
                </div>
              </div>
              <div className="p-10 space-y-6 flex-grow flex flex-col">
                <h3 className="text-3xl font-black group-hover:text-indigo-600 transition-colors leading-tight">{project.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed flex-grow font-medium">{project.description}</p>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-3 text-indigo-600 font-black group/link text-lg p-1 w-fit rounded hover:bg-indigo-50 transition-colors"
                >
                  <span>Case Study</span>
                  <ExternalLink size={20} className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-24 pb-20">
        <div className="flex items-center space-x-3 mb-10">
          <Send className="text-indigo-600" size={32} />
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Let's Connect</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
            <h3 className="text-5xl font-black text-slate-900 leading-[1.1]">
              Have a project in mind? <br />
              <span className="text-indigo-600 italic underline decoration-indigo-200 underline-offset-8">Let's talk!</span>
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-bold">
              I'm open to discussing new software architectures, creative designs, and full-stack solutions.
            </p>
            <div className="space-y-6">
              <a 
                href={`mailto:${data.profile.email}`} 
                className="flex items-center space-x-5 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group w-fit"
              >
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Send an Email</p>
                  <span className="text-xl font-black text-slate-900">{data.profile.email}</span>
                </div>
              </a>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={48} />
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-black mb-2 tracking-tight">Message Received!</h3>
                  <p className="text-slate-500 text-lg font-medium">I appreciate you reaching out. <br />Expect a response within 24 hours.</p>
                </div>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95"
                >
                  Start Over
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Your Name</label>
                    <input 
                      required 
                      type="text" 
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold" 
                      placeholder="e.g. John Smith" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Email</label>
                    <input 
                      required 
                      type="email" 
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Message Details</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold resize-none" 
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>
                {status === 'error' && (
                  <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-black">
                    <AlertCircle size={18} />
                    <span>Communication error. Please try again.</span>
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.25rem] font-black text-xl hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-xl shadow-indigo-100"
                >
                  {isSending ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={24} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
