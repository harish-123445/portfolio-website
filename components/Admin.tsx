
import React, { useState } from 'react';
import { PortfolioData, Profile } from '../types';
import { Save, Plus, Trash2, User, Briefcase, Code, Layers, GraduationCap, AlertTriangle } from 'lucide-react';
import Logger from '../utils/Logger';

interface AdminProps {
  data: PortfolioData;
  onUpdate: (newData: PortfolioData) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({ data, onUpdate }) => {
  const [editedData, setEditedData] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'projects' | 'education'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    Logger.info('Initiating save operation from Admin console...');

    try {
        // Attempt to save to localStorage first to catch quota errors immediately
        try {
            const jsonString = JSON.stringify(editedData);
            localStorage.setItem('portfolio_data_cache', jsonString);
        } catch (storageErr: any) {
            if (storageErr.name === 'QuotaExceededError') {
                throw new Error("Storage Limit Exceeded: Images or content are too large to save locally. Please optimize images.");
            }
            throw storageErr;
        }

        // Propagate update to parent (App.tsx)
        await onUpdate(editedData);
        
        Logger.info('Content saved successfully');
        setMessage({ type: 'success', text: 'Changes saved successfully!' });
        
        setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
        Logger.error('Failed to save content', err);
        setMessage({ 
            type: 'error', 
            text: err.message || 'Failed to save changes. Check console for details.' 
        });
    } finally {
        setIsSaving(false);
    }
  };

  const updateProfile = (field: keyof Profile, value: string) => {
    setEditedData({ ...editedData, profile: { ...editedData.profile, [field]: value } });
  };

  // Helper to add items
  const addItem = (type: 'experience' | 'projects' | 'education') => {
    Logger.info(`Adding new item to ${type}`);
    const newItems = [...editedData[type]];
    const id = Math.random().toString(36).substr(2, 9);
    
    if (type === 'experience') {
      (newItems as any[]).push({ id, company: 'New Company', role: 'Role', period: '2024', description: '' });
    } else if (type === 'projects') {
      (newItems as any[]).push({ id, title: 'New Project', description: '', link: '', image: 'https://via.placeholder.com/600x400' });
    } else if (type === 'education') {
      (newItems as any[]).push({ id, institution: 'School', degree: 'Degree', year: '2024' });
    }
    
    setEditedData({ ...editedData, [type]: newItems });
  };

  const deleteItem = (type: 'experience' | 'projects' | 'education', id: string) => {
    Logger.info(`Deleting item ${id} from ${type}`);
    const newItems = editedData[type].filter(item => (item as any).id !== id);
    setEditedData({ ...editedData, [type]: newItems });
  };

  const updateItem = (type: 'experience' | 'projects' | 'education', id: string, field: string, value: string) => {
    const newItems = editedData[type].map(item => 
      (item as any).id === id ? { ...item, [field]: value } : item
    );
    setEditedData({ ...editedData, [type]: newItems });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
        <div className="flex items-center gap-4">
            {message && (
                <span className={`text-sm font-medium flex items-center gap-1 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.type === 'error' && <AlertTriangle size={14}/>}
                    {message.text}
                </span>
            )}
            <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${
                isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
            }`}
            >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'experience', icon: Briefcase, label: 'Experience' },
                { id: 'skills', icon: Code, label: 'Skills' },
                { id: 'projects', icon: Layers, label: 'Projects' },
                { id: 'education', icon: GraduationCap, label: 'Education' }
            ].map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
                    activeTab === tab.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
                >
                <tab.icon size={16} /> {tab.label}
                </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[500px]">
            
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.name} onChange={e => updateProfile('name', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.title} onChange={e => updateProfile('title', e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bio</label>
                    <textarea rows={4} className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.bio} onChange={e => updateProfile('bio', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Admin Notification Email</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.email} onChange={e => updateProfile('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Photo URL</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.photo_url} onChange={e => updateProfile('photo_url', e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">GitHub URL</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.github} onChange={e => updateProfile('github', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">LinkedIn URL</label>
                        <input className="w-full p-2 border border-gray-300 rounded" value={editedData.profile.linkedin} onChange={e => updateProfile('linkedin', e.target.value)} />
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Edit Experience</h2>
                    <button onClick={() => addItem('experience')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={14}/> Add Job</button>
                </div>
                <div className="space-y-6">
                    {editedData.experience.map(exp => (
                        <div key={exp.id} className="p-4 border border-gray-200 rounded relative bg-gray-50 hover:border-blue-200 transition-colors">
                            <button onClick={() => deleteItem('experience', exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pr-8">
                                <input className="p-2 border border-gray-300 rounded" placeholder="Role" value={exp.role} onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} />
                                <input className="p-2 border border-gray-300 rounded" placeholder="Company" value={exp.company} onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} />
                                <input className="p-2 border border-gray-300 rounded md:col-span-2" placeholder="Period (e.g. 2020 - 2022)" value={exp.period} onChange={e => updateItem('experience', exp.id, 'period', e.target.value)} />
                            </div>
                            <textarea className="w-full p-2 border border-gray-300 rounded" placeholder="Description" rows={2} value={exp.description} onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} />
                        </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Skills</h2>
                <p className="text-sm text-gray-500 mb-2">Separate skills with commas</p>
                <textarea 
                    className="w-full p-4 border border-gray-300 rounded h-48 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editedData.skills.join(', ')}
                    onChange={e => setEditedData({ ...editedData, skills: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Edit Projects</h2>
                    <button onClick={() => addItem('projects')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={14}/> Add Project</button>
                </div>
                <div className="space-y-6">
                    {editedData.projects.map(proj => (
                        <div key={proj.id} className="p-4 border border-gray-200 rounded relative bg-gray-50 hover:border-blue-200 transition-colors">
                            <button onClick={() => deleteItem('projects', proj.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            <div className="space-y-3 pr-8">
                                <input className="w-full p-2 border border-gray-300 rounded font-medium" placeholder="Project Title" value={proj.title} onChange={e => updateItem('projects', proj.id, 'title', e.target.value)} />
                                <textarea className="w-full p-2 border border-gray-300 rounded" placeholder="Description" rows={2} value={proj.description} onChange={e => updateItem('projects', proj.id, 'description', e.target.value)} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input className="p-2 border border-gray-300 rounded" placeholder="Project Link" value={proj.link} onChange={e => updateItem('projects', proj.id, 'link', e.target.value)} />
                                    <input className="p-2 border border-gray-300 rounded" placeholder="Image URL" value={proj.image} onChange={e => updateItem('projects', proj.id, 'image', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Edit Education</h2>
                    <button onClick={() => addItem('education')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={14}/> Add School</button>
                </div>
                <div className="space-y-4">
                    {editedData.education.map(edu => (
                        <div key={edu.id} className="p-4 border border-gray-200 rounded relative bg-gray-50 hover:border-blue-200 transition-colors">
                            <button onClick={() => deleteItem('education', edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                                <input className="md:col-span-2 p-2 border border-gray-300 rounded" placeholder="Institution" value={edu.institution} onChange={e => updateItem('education', edu.id, 'institution', e.target.value)} />
                                <input className="p-2 border border-gray-300 rounded" placeholder="Year" value={edu.year} onChange={e => updateItem('education', edu.id, 'year', e.target.value)} />
                                <input className="md:col-span-3 p-2 border border-gray-300 rounded" placeholder="Degree" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
