import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router'; // Added Link
import { loginUser } from "../store/authSlice";
import { useEffect } from 'react';

const loginSchema = z.object({
  emailID: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required")
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Glow Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-orange-900 rounded-3xl opacity-20 blur-sm"></div>
        
        <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-orange-500">{"<>"}</span>
              AlgoNest
            </Link>
            <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-mono">User Authentication</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-pulse">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-gray-400 font-medium">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-white/5 border ${errors.emailID ? 'border-red-500' : 'border-white/10'} focus:border-orange-500 text-white px-5 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600`}
                {...register('emailID')}
              />
              {errors.emailID && (
                <span className="text-red-500 text-xs mt-1.5 ml-1">{errors.emailID.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <div className="flex justify-between items-center mb-2">
                 <label className="label py-0">
                  <span className="label-text text-gray-400 font-medium">Password</span>
                </label>
                <a href="#" className="text-xs text-orange-500 hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} focus:border-orange-500 text-white px-5 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-2 group mt-8"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Login to Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;