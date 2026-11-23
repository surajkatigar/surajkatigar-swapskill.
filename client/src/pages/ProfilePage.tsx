import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  Coins,
  Calendar,
  Globe,
  Check,
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
    return <div className="py-20 text-center text-slate-400">Please sign in to view your profile.</div>;
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Top Banner */}
      <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/15 shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{user.headline || 'SwapSkill Member'}</p>
            <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Globe size={13} className="text-indigo-400" />
                <span>{user.languages || 'English'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Calendar size={13} className="text-indigo-400" />
                <span>{user.availability || 'Flexible'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Credit Balance</p>
            <p className="text-xl font-extrabold text-amber-200 font-mono">{user.credits} Credits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Edit Profile Info</h3>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <Check size={16} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Frontend Dev & French Learner"
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers about your background and what you are passionate about learning..."
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Schedule</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Skills & Portfolio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Section */}
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Skills Exchange Matrix</h3>
                <p className="text-xs text-slate-400">Specify skills you can teach and skills you want to learn.</p>
              </div>
              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="px-3 py-1.5 bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Add Skill Form Drawer */}
            {showAddSkill && (
              <form onSubmit={handleAddSkill} className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white">Add New Skill to Matrix</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exchange Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white"
                    >
                      <option value="TEACH">Can Teach (Earn Credits)</option>
                      <option value="LEARN">Want to Learn (Spend Credits)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white"
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
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. React & TypeScript"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Proficiency Level</label>
                    <select
                      value={proficiencyLevel}
                      onChange={(e) => setProficiencyLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white"
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
                    className="px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            )}

            {/* "Can Teach" Skills List */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Skills You Can Teach ({teachSkills.length})
                </h4>
              </div>

              {teachSkills.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No teaching skills added yet. Add skills to earn credits!</p>
              ) : (
                <div className="space-y-2">
                  {teachSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-bold text-white">{s.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                          {s.proficiencyLevel}
                        </span>
                        <span className="text-[11px] text-slate-400">• {s.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
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
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Skills You Want to Learn ({learnSkills.length})
                </h4>
              </div>

              {learnSkills.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No learning goals added yet.</p>
              ) : (
                <div className="space-y-2">
                  {learnSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-bold text-white">{s.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                          Goal: {s.proficiencyLevel}
                        </span>
                        <span className="text-[11px] text-slate-400">• {s.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
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

          {/* Skill Portfolio Evidence */}
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Skill Portfolio Evidence</h3>
                <p className="text-xs text-slate-400">
                  Attach sample projects, code repositories, or links to prove teaching capability.
                </p>
              </div>
              <button
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add Portfolio Form */}
            {showAddPortfolio && (
              <form onSubmit={handleAddPortfolio} className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Project / Asset Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interactive Audio Podcast Samples"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what this asset showcases..."
                    value={portfolioDesc}
                    onChange={(e) => setPortfolioDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Public Project URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username/project"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-xl bg-[#14141c] text-white placeholder-slate-500"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Save Portfolio Item
                  </button>
                </div>
              </form>
            )}

            {/* Portfolio List */}
            {user.portfolio && user.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.portfolio.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.04] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <button
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>View Project</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No portfolio items added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
