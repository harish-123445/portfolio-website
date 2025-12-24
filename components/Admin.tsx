
import React, { useState } from 'react';
import { PortfolioData, Profile } from '../types';
import { Save, Plus, Trash2, Image as ImageIcon, Briefcase, User, Layers, GraduationCap, Link as LinkIcon, Loader2, Check, Github, Linkedin, Mail, Code } from 'lucide-react';

interface AdminProps {
  data: PortfolioData;
  onUpdate: (newData: PortfolioData) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({ data, onUpdate }) => {
  const [editedData, setEditedData] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'projects' | 'education'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate processing time for better UX
    setTimeout(async () => {
      await onUpdate(editedData);
      setSaveStatus('success');
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 600);
  };

  const updateProfile = (field: keyof Profile, value: string) => {
    setEditedData({
      ...editedData,
      profile: { ...editedData.profile, [field]: value }
    });
  };

  const addItem = (type: 'experience' | 'projects' | 'education') => {
    const newItems = [...editedData[type]];
    const id = Math.random().toString(36).substr(2, 9);
    
    if (type === 'experience') {
      (newItems as any[]).push({ id, company: 'New Company', role: 'Role Title', period: '2024 - Present', description: 'Describe your role...' });
    } else if (type === 'projects') {
      (newItems as any[]).push({ id, title: 'New Project', description: 'Project description...', link: 'https://', image: `https://picsum.photos/seed/${id}/600/400` });
    } else if (type === 'education') {
      (newItems as any[]).push({ id, institution: 'University Name', degree: 'Degree', year: '2024' });
    }
    
    setEditedData({ ...editedData, [type]: newItems });
  };

  const deleteItem = (type: 'experience' | 'projects' | 'education', id: string) => {
    const newItems = editedData[type].filter(item => (item as any).id !== id);
    setEditedData({ ...editedData, [type]: newItems });
  };

  const updateItem = (type: 'experience' | 'projects' | 'education', id: string, field: string, value: string) => {
    const newItems = editedData[type].map(item => 
      (item as any).id === id ? { ...item, [field]: value } : item
    );
    setEditedData({ ...editedData, [type]: newItems });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setEditedData({ ...editedData, skills });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 font-medium text-lg">Manage your portfolio content locally.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all shadow-xl font-black text-lg ${
            saveStatus === 'success' 
            ? 'bg-green-600 text-white shadow-green-200' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-indigo-200'
          } disabled:opacity-70`}
        >
          {isSaving ? <Loader2 className="animate-spin" size={24} /> : (
            saveStatus === 'success' ? <Check size={24} /> : <Save size={24} />
          )}
          <span>{saveStatus === 'success' ? 'Changes Saved!' : (isSaving ? 'Saving...' : 'Save Changes')}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 space-y-3">
          {[
            { id: 'profile', icon: User, label: 'Core Identity' },
            { id: 'experience', icon: Briefcase, label: 'Experience' },
            { id: 'skills', icon: Code, label: 'Skills & Tech' },
            { id: 'projects', icon: Layers, label: 'Projects' },
            { id: 'education', icon: GraduationCap, label: 'Education' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all group border ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600' 
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:border-indigo-200 border-transparent'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
              <span className="font-bold">{tab.label}</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 glass-card p-10 rounded-[2.5rem] shadow-sm min-h-[500px] border border-slate-200 bg-white/50">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><User size={24} /></div>
                Identity & Socials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Public Name</label>
                  <input type="text" value={editedData.profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Headline Title</label>
                  <input type="text" value={editedData.profile.title} onChange={(e) => updateProfile('title', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Github size={14} /> GitHub Link
                  </label>
                  <input type="text" value={editedData.profile.github} onChange={(e) => updateProfile('github', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Linkedin size={14} /> LinkedIn Link
                  </label>
                  <input type="text" value={editedData.profile.linkedin} onChange={(e) => updateProfile('linkedin', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">About Me (Bio)</label>
                <textarea rows={4} value={editedData.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold resize-none transition-all leading-relaxed" />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Profile Photo URL</label>
                <div className="flex items-center gap-6">
                  <input type="text" value={editedData.profile.photo_url} onChange={(e) => updateProfile('photo_url', e.target.value)} className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold transition-all" />
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg shrink-0">
                    <img src={editedData.profile.photo_url} className="w-full h-full object-cover" alt="avatar preview" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Briefcase size={24} /></div>
                  Career History
                </h2>
                <button onClick={() => addItem('experience')} className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white active:scale-95 transition-all font-black">
                  <Plus size={20} /> <span>Add New</span>
                </button>
              </div>
              <div className="space-y-6">
                {editedData.experience.map((exp) => (
                  <div key={exp.id} className="p-8 border border-slate-100 rounded-3xl relative bg-white hover:border-indigo-200 hover:shadow-lg transition-all group">
                    <button onClick={() => deleteItem('experience', exp.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pr-12">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Employer</label>
                        <input placeholder="Company" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Role Title</label>
                        <input placeholder="Role" value={exp.role} onChange={(e) => updateItem('experience', exp.id, 'role', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Timeframe</label>
                        <input placeholder="Period" value={exp.period} onChange={(e) => updateItem('experience', exp.id, 'period', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Summary of Achievement</label>
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none transition-all" rows={3} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Code size={24} /></div>
                Technical Arsenal
              </h2>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <label className="block text-sm font-black text-slate-500 mb-4 uppercase tracking-widest">Skill Tags (Comma-Separated)</label>
                <textarea 
                  value={editedData.skills.join(', ')} 
                  onChange={handleSkillsChange}
                  className="w-full p-6 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none min-h-[350px] text-xl font-black bg-white leading-relaxed text-slate-700"
                  placeholder="React, AWS, Node.js..."
                />
                <p className="mt-4 text-sm text-slate-400 font-bold flex items-center gap-2">
                  <Check size={16} /> The list will be automatically parsed and reflected as tags on your public site.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Layers size={24} /></div>
                  Work Repository
                </h2>
                <button onClick={() => addItem('projects')} className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white active:scale-95 transition-all font-black">
                  <Plus size={20} /> <span>New Project</span>
                </button>
              </div>
              <div className="space-y-8">
                {editedData.projects.map((proj) => (
                  <div key={proj.id} className="p-8 border border-slate-100 rounded-[2rem] bg-white hover:shadow-2xl transition-all flex flex-col lg:flex-row gap-8 group relative overflow-hidden">
                    <button onClick={() => deleteItem('projects', proj.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors z-10">
                      <Trash2 size={20} />
                    </button>
                    <div className="w-full lg:w-72 aspect-[16/10] rounded-2xl bg-slate-200 overflow-hidden shadow-inner border border-slate-200 shrink-0">
                      <img src={proj.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="project-thumb" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Project Name</label>
                        <input placeholder="Title" value={proj.title} onChange={(e) => updateItem('projects', proj.id, 'title', e.target.value)} className="w-full text-2xl font-black bg-transparent border-b-2 border-slate-100 outline-none focus:border-indigo-500 pb-2 transition-all text-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Project Pitch</label>
                        <textarea placeholder="Summary" value={proj.description} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none transition-all" rows={2} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Live/Source URL</label>
                          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
                            <LinkIcon size={16} className="text-slate-400" />
                            <input placeholder="https://..." value={proj.link} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} className="w-full outline-none font-bold text-sm bg-transparent" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Thumbnail Link</label>
                          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-indigo-500 transition-all">
                            <ImageIcon size={16} className="text-slate-400" />
                            <input placeholder="https://..." value={proj.image} onChange={(e) => updateItem('projects', proj.id, 'image', e.target.value)} className="w-full outline-none font-bold text-sm bg-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><GraduationCap size={24} /></div>
                  Academic Background
                </h2>
                <button onClick={() => addItem('education')} className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white active:scale-95 transition-all font-black">
                  <Plus size={20} /> <span>Add Degree</span>
                </button>
              </div>
              <div className="space-y-6">
                {editedData.education.map((edu) => (
                  <div key={edu.id} className="p-8 border border-slate-100 rounded-3xl bg-white hover:shadow-xl hover:border-indigo-200 transition-all relative group">
                    <button onClick={() => deleteItem('education', edu.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-12">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Institution</label>
                        <input placeholder="University" value={edu.institution} onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Graduation Year</label>
                        <input placeholder="Year" value={edu.year} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Degree/Major</label>
                        <input placeholder="Title" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
