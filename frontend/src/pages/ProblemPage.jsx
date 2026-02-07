import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import { 
  FileText, History, Lightbulb, MessageSquare, 
  Code2, Play, Send, ChevronUp 
} from 'lucide-react';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import Navbar from '../components/navBar';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [showConsole, setShowConsole] = useState(true); 
  const [consoleTab, setConsoleTab] = useState('testcase');
  
  const editorRef = useRef(null);
  let { problemId } = useParams();

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        // Normalize language search to handle "Javascript" vs "javascript"
        const initialCode = response.data.startCode.find((sc) => 
          sc.language.toLowerCase() === selectedLanguage.toLowerCase()
        )?.initialCode || '// Start coding here...';

        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Update code editor when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => 
        sc.language.toLowerCase() === selectedLanguage.toLowerCase()
      )?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null); // Clear previous
    setSubmitResult(null);
    setConsoleTab('testcase');
    setShowConsole(true);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
    } catch (error) {
      setRunResult({ success: false, error: 'Execution error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null); // Clear previous
    setRunResult(null);
    setConsoleTab('result');
    setShowConsole(true);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
    } catch (error) {
      console.error('Submit error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f] text-white overflow-hidden pt-16 font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        
        {/* LEFT PANE */}
        <div className="w-[45%] flex flex-col bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
          <div className="flex-none flex bg-[#252525] border-b border-white/5 h-10 px-2 shrink-0">
            {[
              { id: 'description', label: 'Description', icon: FileText },
              { id: 'editorial', label: 'Editorial', icon: Lightbulb },
              { id: 'submissions', label: 'Submissions', icon: History },
              { id: 'chatAI', label: 'AskAI', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                className={`flex items-center gap-2 px-4 h-full text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeLeftTab === tab.id ? 'border-orange-500 text-orange-500 bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {problem && (
              <div className="animate-fadeIn">
                {activeLeftTab === 'description' && (
                  <>
                    <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20 uppercase">
                        {problem.difficulty || 'Easy'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-10 whitespace-pre-wrap">
                      {problem.description}
                    </p>
                    
                    <div className="space-y-8">
                      <h3 className="text-gray-100 font-bold text-sm tracking-tight uppercase">Examples</h3>
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-black/20 border border-white/5 rounded-lg p-5">
                          <h4 className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2 mb-4">
                             <div className="w-1 h-1 bg-orange-500 rounded-full" /> Example {index + 1}
                          </h4>
                          <div className="space-y-4 font-mono text-xs">
                             <div className="bg-black/40 p-3 rounded-md">
                                <span className="text-gray-500 block mb-1 uppercase text-[9px]">Input</span>
                                <span className="text-gray-200">{example.input}</span>
                             </div>
                             <div className="bg-black/40 p-3 rounded-md">
                                <span className="text-gray-500 block mb-1 uppercase text-[9px]">Output</span>
                                <span className="text-gray-200">{example.output}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} />}
                {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
                {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          
          {/* EDITOR SECTION */}
          <div className="flex-[3] flex flex-col bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <div className="flex-none h-10 bg-[#252525] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <Code2 size={14} className="text-orange-500" /> Code Editor
              </div>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-black/40 border border-white/10 text-[10px] font-bold uppercase rounded px-2 py-1 outline-none"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            
            <div className="flex-1 bg-black/20 overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                value={code}
                onChange={(v) => setCode(v || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  fontFamily: 'Fira Code, monospace',
                  padding: { top: 16 }
                }}
              />
            </div>

            <div className="flex-none h-12 bg-[#252525] border-t border-white/5 flex items-center justify-end px-4 gap-3 shrink-0">
               <button onClick={handleRun} disabled={loading} className="flex items-center gap-2 px-6 h-8 bg-[#333] hover:bg-[#444] text-[10px] font-bold uppercase rounded-md transition-all">
                  <Play size={12} /> {loading && consoleTab === 'testcase' ? 'Running...' : 'Run Code'}
               </button>
               <button onClick={handleSubmitCode} disabled={loading} className="flex items-center gap-2 px-6 h-8 bg-orange-600 hover:bg-orange-700 text-[10px] font-bold uppercase rounded-md transition-all shadow-lg shadow-orange-900/20">
                  <Send size={12} /> {loading && consoleTab === 'result' ? 'Submitting...' : 'Submit'}
               </button>
            </div>
          </div>

          {/* CONSOLE SECTION */}
          <div className={`flex flex-col bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 ${showConsole ? 'flex-1' : 'h-10'}`}>
            <div className="flex-none h-10 bg-[#252525] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
               <div className="flex gap-4 h-full items-center">
                  <button onClick={() => {setConsoleTab('testcase'); setShowConsole(true)}} className={`text-[10px] font-bold uppercase h-full border-b-2 ${consoleTab === 'testcase' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500'}`}>Test Cases</button>
                  <button onClick={() => {setConsoleTab('result'); setShowConsole(true)}} className={`text-[10px] font-bold uppercase h-full border-b-2 ${consoleTab === 'result' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500'}`}>Results</button>
               </div>
               <button onClick={() => setShowConsole(!showConsole)} className="text-gray-500 hover:text-white">
                  <ChevronUp size={16} className={showConsole ? 'rotate-180' : ''} />
               </button>
            </div>

            {showConsole && (
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-black/20">
                 {consoleTab === 'testcase' ? (
                   <div className="space-y-4">
                      {problem?.visibleTestCases?.map((tc, i) => (
                        <div key={i} className="text-xs space-y-2">
                           <div className="text-gray-500 uppercase text-[9px] font-bold">Case {i + 1}</div>
                           <div className="bg-white/5 border border-white/5 p-3 rounded font-mono text-gray-300">{tc.input}</div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="animate-fadeIn">
                      {runResult || submitResult ? (
                        <div className="text-center py-4">
                           <h4 className={`text-2xl font-black mb-2 uppercase italic ${(runResult?.every && runResult.every(r => r.status_id === 3)) || submitResult?.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                             {submitResult?.status === 'accepted' ? 'ACCEPTED' : (runResult?.[0]?.status_id === 3 ? 'SUCCESS' : 'WRONG ANSWER')}
                           </h4>
                           <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex justify-center gap-6">
                              <span>Passed: {submitResult?.testCasesPassed || 0} / {problem?.hiddenTestCases?.length || 0}</span>
                              <span>Time: {submitResult?.runtime || runResult?.[0]?.time || '0'}s</span>
                           </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm text-center italic mt-10">Run your code to see results.</p>
                      )}
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;