
import React, { useState } from 'react';
import { PortfolioData } from '../types';
import { ExternalLink, ArrowRight, Send, AlertCircle, CheckCircle2, Terminal, Sparkles } from 'lucide-react';

interface PortfolioProps {
  data: PortfolioData;
}

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    let isValid = true;

    if (!contactForm.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (!contactForm.message.trim()) {
      newErrors.message = 'Message cannot be empty';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSending(true);
    
    try {
      // In a real backend, this would send an email to data.profile.email
      console.log(`[System] Sending contact form details to admin email: ${data.profile.email}`);
      console.log(`[System] Payload:`, contactForm);

      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      existingMessages.push({ ...contactForm, date: new Date().toISOString() });
      localStorage.setItem('contact_messages', JSON.stringify(existingMessages));
      
      // Simulate network request duration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSending(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section id="hero" className="min-h-[85vh] flex items-center relative bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-6xl mx-auto px-6 w-full py-12 md:py-0">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wide uppercase mx-auto md:mx-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Open to work
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                  {data.profile.name}
                </h1>
                <p className="text-2xl md:text-3xl font-light text-slate-500">
                  {data.profile.title}
                </p>
              </div>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed mx-auto md:mx-0">
                {data.profile.bio}
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-black hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-200"
                >
                  View My Work
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
                >
                  Contact Me
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2.5rem] transform rotate-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-white">
                <img 
                  src={data.profile.photo_url} 
                  alt={data.profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
        
        {/* Experience Section */}
        <section id="experience" className="scroll-mt-24">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 sticky top-24">Experience</h2>
            </div>
            <div className="md:col-span-8 space-y-12">
              {data.experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{exp.role}</h3>
                    <span className="text-sm font-medium text-slate-400 mt-1 md:mt-0 font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-slate-500 font-medium mb-4">{exp.company}</div>
                  <p className="text-slate-600 leading-relaxed text-lg font-light">{exp.description}</p>
                  <div className="h-px bg-slate-100 w-full mt-12 group-last:hidden"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section - Redesigned */}
        <section id="skills" className="scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Technical Proficiency</h2>
            <p className="text-slate-500 text-lg">A curated list of technologies I use to build performant applications.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.skills.map((skill) => (
              <div 
                key={skill} 
                className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Terminal size={20} />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-slate-900">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Selected Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.projects.map((project) => (
              <div key={project.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
                <div className="h-64 overflow-hidden bg-slate-100 relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-8 leading-relaxed font-light flex-grow">{project.description}</p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm font-bold text-slate-900 border-b-2 border-slate-200 pb-1 hover:border-blue-600 transition-colors w-fit"
                  >
                    View Project <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        {data.education.length > 0 && (
          <section id="education" className="scroll-mt-24 border-t border-slate-200 pt-24">
              <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                  <h2 className="text-3xl font-bold text-slate-900">Education</h2>
                </div>
                <div className="md:col-span-8 grid gap-8 md:grid-cols-2">
                  {data.education.map(edu => (
                      <div key={edu.id} className="bg-slate-50 p-6 rounded-xl">
                          <h3 className="font-bold text-lg text-slate-900">{edu.institution}</h3>
                          <div className="text-slate-600 mt-1">{edu.degree}</div>
                          <div className="text-sm text-slate-400 mt-3 font-mono">{edu.year}</div>
                      </div>
                  ))}
                </div>
              </div>
          </section>
        )}

        {/* Contact Section - Redesigned */}
        <section id="contact" className="scroll-mt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6">
                <Sparkles size={24} />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Let's start a conversation</h2>
              <p className="text-xl text-slate-500 font-light">
                Interested in working together? I'd love to hear from you.
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              {status === 'success' ? (
                <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Received!</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">Thank you for getting in touch. I will get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="text-slate-900 font-bold border-b-2 border-slate-200 hover:border-slate-900 transition-colors pb-1"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-8" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group relative">
                      <input 
                        id="name"
                        type="text" 
                        value={contactForm.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        className={`peer w-full bg-transparent border-b-2 py-3 outline-none transition-all font-medium text-slate-900 placeholder-transparent ${
                          errors.name ? 'border-red-300' : 'border-slate-200 focus:border-slate-900'
                        }`}
                        placeholder="Name"
                      />
                      <label 
                        htmlFor="name" 
                        className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm ${
                          errors.name ? 'text-red-400' : 'text-slate-400 peer-focus:text-slate-900'
                        }`}
                      >
                        Name
                      </label>
                      {errors.name && (
                        <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-red-500 text-xs font-medium">
                          <AlertCircle size={12} /> {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="group relative">
                      <input 
                        id="email"
                        type="email" 
                        value={contactForm.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className={`peer w-full bg-transparent border-b-2 py-3 outline-none transition-all font-medium text-slate-900 placeholder-transparent ${
                          errors.email ? 'border-red-300' : 'border-slate-200 focus:border-slate-900'
                        }`}
                        placeholder="Email"
                      />
                      <label 
                        htmlFor="email" 
                        className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm ${
                          errors.email ? 'text-red-400' : 'text-slate-400 peer-focus:text-slate-900'
                        }`}
                      >
                        Email
                      </label>
                      {errors.email && (
                        <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-red-500 text-xs font-medium">
                          <AlertCircle size={12} /> {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="group relative">
                    <textarea 
                      id="message"
                      rows={4} 
                      value={contactForm.message}
                      onChange={e => handleInputChange('message', e.target.value)}
                      className={`peer w-full bg-transparent border-b-2 py-3 outline-none transition-all font-medium text-slate-900 placeholder-transparent resize-none ${
                        errors.message ? 'border-red-300' : 'border-slate-200 focus:border-slate-900'
                      }`}
                      placeholder="Message"
                    />
                    <label 
                      htmlFor="message" 
                      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm ${
                        errors.message ? 'text-red-400' : 'text-slate-400 peer-focus:text-slate-900'
                      }`}
                    >
                      Message
                    </label>
                    {errors.message && (
                      <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-red-500 text-xs font-medium">
                        <AlertCircle size={12} /> {errors.message}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-end">
                     <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isSending ? 'Sending...' : <>Send Message <Send size={18} /></>}
                    </button>
                  </div>
                  
                  {status === 'error' && (
                    <div className="text-center text-red-500 text-sm font-bold bg-red-50 py-3 rounded-lg">
                      Unable to send message. Please try again later.
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
