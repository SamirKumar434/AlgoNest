import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Code2, Beaker, FileText, Layout } from 'lucide-react';
import Navbar from '../components/navBar';

// Zod schema remains exactly as per your logic
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control, name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control, name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-orange-500 text-white px-4 py-3 rounded-xl outline-none transition-all placeholder:text-gray-600 font-sans";
  const labelClass = "label-text text-gray-400 font-medium mb-2 block text-sm uppercase tracking-wider";
  const cardClass = "relative bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 shadow-2xl mb-10 overflow-hidden";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 pb-20">
      <Navbar />
      
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-orange-600/[0.05] blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto pt-32 px-6 relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Create New <span className="text-orange-500">Problem</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
            Module: Admin Control Center // Asset Deployment
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8 text-orange-500">
              <FileText size={22} />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Basic Information</h2>
            </div>
            
            <div className="grid gap-8">
              <div className="form-control">
                <label className={labelClass}>Problem Title</label>
                <input {...register('title')} placeholder="e.g. Invert Binary Tree" className={`${inputClass} ${errors.title && 'border-red-500/50'}`} />
                {errors.title && <span className="text-red-500 text-xs mt-2 ml-1">{errors.title.message}</span>}
              </div>

              <div className="form-control">
                <label className={labelClass}>Description</label>
                <textarea {...register('description')} placeholder="Describe the problem logic and constraints..." rows={6} className={`${inputClass} resize-none ${errors.description && 'border-red-500/50'}`} />
                {errors.description && <span className="text-red-500 text-xs mt-2 ml-1">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-control">
                  <label className={labelClass}>Difficulty Level</label>
                  <select {...register('difficulty')} className={inputClass}>
                    <option value="easy" className="bg-black">Easy</option>
                    <option value="medium" className="bg-black">Medium</option>
                    <option value="hard" className="bg-black">Hard</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className={labelClass}>Algorithmic Pattern (Tag)</label>
                  <select {...register('tags')} className={inputClass}>
                    <option value="array" className="bg-black">Array</option>
                    <option value="linkedList" className="bg-black">Linked List</option>
                    <option value="graph" className="bg-black">Graph</option>
                    <option value="dp" className="bg-black">Dynamic Programming</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Test Cases */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8 text-orange-500">
              <Beaker size={22} />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Validation Test Cases</h2>
            </div>

            {/* Visible Test Cases */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-300 font-bold flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Visible Cases
                </h3>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors">
                  <Plus size={16} /> Add Case
                </button>
              </div>
              
              <div className="space-y-6">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl relative group">
                    <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid gap-4 mt-2">
                      <input {...register(`visibleTestCases.${index}.input`)} placeholder="Standard Input" className={inputClass} />
                      <input {...register(`visibleTestCases.${index}.output`)} placeholder="Expected Output" className={inputClass} />
                      <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explain the logic for this test case..." rows={2} className={inputClass} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-300 font-bold flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Hidden Evaluation Cases
                </h3>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors">
                  <Plus size={16} /> Add Hidden
                </button>
              </div>
              
              <div className="space-y-6">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl relative">
                    <button type="button" onClick={() => removeHidden(index)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Secret Input" className={inputClass} />
                      <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Secret Output" className={inputClass} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Templates */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-8 text-orange-500">
              <Code2 size={22} />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Code Templates & Solutions</h2>
            </div>

            <div className="space-y-12">
              {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                <div key={lang} className="border-l-2 border-orange-500/20 pl-8 transition-all hover:border-orange-500/50 group">
                  <h3 className="text-lg font-extrabold text-white mb-8 tracking-wider group-hover:text-orange-500 transition-colors">{lang} Environment</h3>
                  <div className="grid gap-10">
                    <div className="form-control">
                      <label className={labelClass}>Initial Boilerplate Code</label>
                      <div className="relative bg-black rounded-2xl border border-white/10 p-4 shadow-inner">
                        <textarea {...register(`startCode.${index}.initialCode`)} rows={8} className="w-full bg-transparent font-mono text-sm text-gray-300 outline-none resize-none" />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className={labelClass}>Reference Solution</label>
                      <div className="relative bg-black rounded-2xl border border-white/10 p-4 shadow-inner">
                        <textarea {...register(`referenceSolution.${index}.completeCode`)} rows={8} className="w-full bg-transparent font-mono text-sm text-orange-100/80 outline-none resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-3 text-lg">
            Deploy Problem to AlgoNest
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;