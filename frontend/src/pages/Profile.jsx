import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { 
  Trophy, Target, Flame, Globe, CheckCircle2, 
  BarChart3, Activity, Code2, Calendar, LayoutDashboard 
} from 'lucide-react';

const getTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags.split(',').map(t => t.trim()).filter(t => t);
    }
  }
  return [];
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated first
      try {
        await axiosClient.get('/user/check');
      } catch (authError) {
        // User is not authenticated, redirect to login
        navigate('/login');
        return;
      }
      
      // Fetch profile data
      const response = await axiosClient.get('/profile/profile');
      setProfile(response.data);
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        // Authentication error - redirect to login
        navigate('/login');
      } else {
        setError('Failed to load profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center gap-4">
      <span className="loading loading-ring loading-lg text-orange-500"></span>
      <p className="text-gray-500 font-mono text-xs uppercase tracking-widest animate-pulse">Loading profile...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-6">
      <div className="max-w-md w-full">
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="font-bold">Session Expired</h3>
            <div className="text-xs">Please login again to continue</div>
          </div>
        </div>
        <button 
          className="btn btn-primary w-full mt-4"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  // No profile data
  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-6">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-xl font-bold mb-2">Profile Not Found</h3>
        <p className="text-gray-500 mb-4">Unable to load your profile data</p>
        <button 
          className="btn btn-outline"
          onClick={fetchProfile}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070707] text-gray-200 pb-20">
      {/* Simplified background */}
      <div className="fixed top-0 left-1/4 w-full max-w-2xl h-[400px] bg-orange-600/10 blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        
        {/* Profile Header - Simplified */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center text-4xl font-bold text-white">
                {profile.user.firstName[0]}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {profile.user.firstName}'s Dashboard
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {profile.user.role}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> 
                  Joined {new Date(profile.user.joined).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<CheckCircle2 />} label="Solved" value={profile.stats.solvedProblems} sub={`/ ${profile.stats.totalProblems}`} color="emerald" />
          <StatCard icon={<Target />} label="Accuracy" value={`${profile.stats.accuracy}%`} sub="Success Rate" color="orange" />
          <StatCard icon={<Flame />} label="Streak" value={profile.stats.streak} sub="Days" color="red" />
          <StatCard icon={<Trophy />} label="Rank" value={`#${profile.rank.global || '—'}`} sub="Global" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Difficulty Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-orange-500"/> Difficulty Progress
              </h2>
              <div className="space-y-6">
                <DifficultyBar label="Easy" solved={profile.difficultyStats.easy.solved} total={profile.difficultyStats.easy.total} color="bg-emerald-500" />
                <DifficultyBar label="Medium" solved={profile.difficultyStats.medium.solved} total={profile.difficultyStats.medium.total} color="bg-orange-500" />
                <DifficultyBar label="Hard" solved={profile.difficultyStats.hard.solved} total={profile.difficultyStats.hard.total} color="bg-red-500" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex bg-white/[0.02] border-b border-white/5">
                <TabBtn active={activeTab === 'overview'} label="Recent Activity" icon={<Activity size={16}/>} onClick={() => setActiveTab('overview')} />
                <TabBtn active={activeTab === 'solved'} label="Solved Problems" icon={<Code2 size={16}/>} onClick={() => setActiveTab('solved')} />
              </div>

              <div className="p-6">
                {activeTab === 'overview' && <RecentActivity submissions={profile.recentSubmissions} />}
                {activeTab === 'solved' && <SolvedGrid solved={profile.solvedProblems} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const StatCard = ({ icon, label, value, sub, color }) => {
  const themes = {
    emerald: "text-emerald-500 bg-emerald-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    red: "text-red-500 bg-red-500/10",
    blue: "text-blue-500 bg-blue-500/10"
  };
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${themes[color]}`}>{icon}</div>
        <span className="text-gray-500 text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-gray-500 text-xs">{sub}</span>
      </div>
    </div>
  );
};

const DifficultyBar = ({ label, solved, total, color }) => {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="text-white">{solved} / {total}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {Math.round(pct)}% solved
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 ${active ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
  >
    {icon} {label}
  </button>
);

const RecentActivity = ({ submissions }) => (
  <div className="overflow-x-auto">
    {submissions.length > 0 ? (
      <table className="table w-full">
        <thead>
          <tr className="text-gray-500 text-xs">
            <th className="pb-3">Problem</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Time</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <a href={`/problem/${sub.problem?._id}`} className="text-gray-200 hover:text-orange-500 transition-colors">
                    {sub.problem?.title}
                  </a>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    sub.problem?.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                    sub.problem?.difficulty === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {sub.problem?.difficulty}
                  </span>
                </div>
              </td>
              <td>
                <span className={`text-xs font-medium ${sub.status === 'accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {sub.status}
                </span>
              </td>
              <td className="text-sm text-gray-500">{sub.runtime ? `${sub.runtime}s` : '--'}</td>
              <td className="text-sm text-gray-500">
                {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-500">No recent activity</p>
      </div>
    )}
  </div>
);

const SolvedGrid = ({ solved }) => (
  <div>
    {solved.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {solved.map((problem) => (
          <div key={problem._id} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition-colors">
            <a href={`/problem/${problem._id}`} className="text-gray-200 hover:text-orange-500 transition-colors font-medium">
              {problem.title}
            </a>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                problem.difficulty === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {problem.difficulty}
              </span>
              <div className="flex gap-1">
                {getTagsArray(problem.tags).slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-500">No problems solved yet</p>
        <a href="/problems" className="text-orange-500 hover:underline text-sm mt-2 inline-block">
          Browse problems →
        </a>
      </div>
    )}
  </div>
);

export default ProfilePage;