import React, { useState } from 'react';
import {
  User as UserIcon,
  Plus,
  Trash2,
  ExternalLink,
  Coins,
  Calendar,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [languages, setLanguages] = useState(user?.languages || 'English');
  const [availability, setAvailability] = useState(user?.availability || 'Weekdays after 6pm');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Skill Modal / Form State
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [type, setType] = useState<'TEACH' | 'LEARN'>('TEACH');
  const [proficiencyLevel, setProficiencyLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [yearsExperience, setYearsExperience] = useState('2');

  // New Portfolio Item Form State
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  if (!user) {
    return <div className="py-20 text-center text-slate-500">Please sign in to view your profile.</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.put('/users/profile', {
        name,
        headline,
        bio,
        languages,
        availability,
      });
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    try {
      await api.post('/users/skills', {
        skillName,
        category,
        type,
        proficiencyLevel,
        yearsExperience: parseInt(yearsExperience),
      });
      await refreshUser();
      setSkillName('');
      setShowAddSkill(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.delete(`/users/skills/${skillId}`);
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle.trim()) return;

    try {
      await api.post('/users/portfolio', {
        title: portfolioTitle,
        description: portfolioDesc,
        projectUrl: portfolioUrl,
      });
      await refreshUser();
      setPortfolioTitle('');
      setPortfolioDesc('');
      setPortfolioUrl('');
      setShowAddPortfolio(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePortfolio = async (itemId: string) => {
    try {
      await api.delete(`/users/portfolio/${itemId}`);
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const teachSkills = user.skills?.filter((s) => s.type === 'TEACH') || [];
  const learnSkills = user.skills?.filter((s) => s.type === 'LEARN') || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500">{user.headline || 'SwapSkill Member'}</p>
            <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Globe size={13} />
                <span>{user.languages || 'English'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar size={13} />
                <span>{user.availability || 'Flexible'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center font-bold">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Credit Balance</p>
            <p className="text-xl font-extrabold text-amber-900 font-mono">{user.credits} Credits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Profile Info</h3>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <Check size={16} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Frontend Dev & French Learner"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers about your background and what you are passionate about learning..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Schedule</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Skills & Portfolio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Skills Exchange Matrix</h3>
                <p className="text-xs text-slate-500">Specify skills you can teach and skills you want to learn.</p>
              </div>
              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Add Skill Form Drawer */}
            {showAddSkill && (
              <form onSubmit={handleAddSkill} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Add New Skill to Matrix</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Exchange Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="TEACH">Can Teach (Earn Credits)</option>
                      <option value="LEARN">Want to Learn (Spend Credits)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Languages">Languages</option>
                      <option value="Design">Design</option>
                      <option value="Music">Music</option>
                      <option value="Business & Career">Business & Career</option>
                      <option value="Academics">Academics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. React & TypeScript"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proficiency Level</label>
                    <select
                      value={proficiencyLevel}
                      onChange={(e) => setProficiencyLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSkill(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            )}

            {/* "Can Teach" Skills List */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Skills You Can Teach ({teachSkills.length})
                </h4>
              </div>

              {teachSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No teaching skills added yet. Add skills to earn credits!</p>
              ) : (
                <div className="space-y-2">
                  {teachSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-bold text-slate-900">{s.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700">
                          {s.proficiencyLevel}
                        </span>
                        <span className="text-[11px] text-slate-500">• {s.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* "Want to Learn" Skills List */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Skills You Want to Learn ({learnSkills.length})
                </h4>
              </div>

              {learnSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No learning goals added yet.</p>
              ) : (
                <div className="space-y-2">
                  {learnSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-bold text-slate-900">{s.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-700">
                          Goal: {s.proficiencyLevel}
                        </span>
                        <span className="text-[11px] text-slate-500">• {s.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Portfolio Evidence (Blueprint Extra Feature) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Skill Portfolio Evidence</h3>
                <p className="text-xs text-slate-500">
                  Attach sample projects, code repositories, or links to prove teaching capability.
                </p>
              </div>
              <button
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add Portfolio Form */}
            {showAddPortfolio && (
              <form onSubmit={handleAddPortfolio} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project / Asset Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interactive Audio Podcast Samples"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="What does this demonstrate?"
                    value={portfolioDesc}
                    onChange={(e) => setPortfolioDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">URL (GitHub, Figma, Website)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    Save Portfolio Item
                  </button>
                </div>
              </form>
            )}

            {user.portfolio && user.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.portfolio.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-[11px] font-semibold text-indigo-600 hover:underline flex items-center space-x-1"
                      >
                        <span>View Artifact</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No portfolio evidence attached yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
