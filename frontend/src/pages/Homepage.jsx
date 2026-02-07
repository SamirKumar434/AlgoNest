import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../store/authSlice';
import Navbar from '../components/navBar';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    // Adding optional chaining ?. to prevent filtering crashes
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                        (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      <Navbar />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-orange-600/5 blur-[120px] pointer-events-none -z-0" />

      <main className="relative z-10 container mx-auto pt-28 px-6 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Problem <span className="text-orange-500">Dashboard</span></h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Master patterns through deliberate practice</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <select 
            className="select bg-black border-white/10 focus:border-orange-500 text-gray-300 rounded-xl"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="solved">Solved Only</option>
          </select>

          <select 
            className="select bg-black border-white/10 focus:border-orange-500 text-gray-300 rounded-xl"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select bg-black border-white/10 focus:border-orange-500 text-gray-300 rounded-xl"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Patterns</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">Dynamic Programming</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <div 
                key={problem._id} 
                className="group relative bg-[#0d0d0d] border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 transition-all duration-300 shadow-xl"
              >
                <div className="absolute -inset-1 bg-orange-600/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity rounded-3xl pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                        <NavLink to={`/problem/${problem._id}`}>
                          {problem.title}
                        </NavLink>
                      </h2>
                      {solvedProblems.some(sp => sp._id === problem._id) && (
                        <div className="badge badge-success bg-green-500/10 border-green-500/20 text-green-500 gap-1 px-3 py-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Solved</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getDifficultyStyles(problem.difficulty)}`}>
                        {problem.difficulty || "Unknown"}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400">
                        {problem.tags}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                     <NavLink 
                        to={`/problem/${problem._id}`}
                        className="btn btn-ghost bg-white/5 hover:bg-orange-600 hover:text-white border-white/10 rounded-xl transition-all"
                      >
                        Solve Challenge
                      </NavLink>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#0d0d0d] rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-500">No problems found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// FIXED: Added a check for difficulty to prevent the crash
const getDifficultyStyles = (difficulty) => {
  if (!difficulty) return 'bg-white/5 border-white/10 text-gray-400';
  
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'bg-green-500/10 border-green-500/20 text-green-500';
    case 'medium': return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
    case 'hard': return 'bg-red-500/10 border-red-500/20 text-red-500';
    default: return 'bg-white/5 border-white/10 text-gray-400';
  }
};

export default Homepage;