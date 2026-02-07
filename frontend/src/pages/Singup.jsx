import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink, Link } from 'react-router';
import { registerUser } from '../store/authSlice';
import { Eye, EyeOff } from 'lucide-react'; // Optional: Use lucide-react for cleaner icons

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailID: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Subtle Outer Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-orange-900 rounded-3xl opacity-20 blur-sm"></div>
        
        <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold mb-4 transition-transform hover:scale-105">
              <span className="text-orange-500">{"<>"}</span>
              AlgoNest
            </Link>
            <h2 className="text-3xl font-extrabold">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-mono">Join the Community</p>
          </div>

          {/* Backend Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name Field */}
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-gray-400 font-medium">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} focus:border-orange-500 text-white px-5 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1.5 ml-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-gray-400 font-medium">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full bg-white/5 border ${errors.emailID ? 'border-red-500' : 'border-white/10'} focus:border-orange-500 text-white px-5 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600`}
                {...register('emailID')}
              />
              {errors.emailID && (
                <span className="text-red-500 text-xs mt-1.5 ml-1">{errors.emailID.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-gray-400 font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} focus:border-orange-500 text-white px-5 py-3.5 rounded-2xl outline-none transition-all placeholder:text-gray-600 pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                  Create Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-8">
            <span className="text-sm text-gray-500">
              Already have an account?{' '}
              <NavLink to="/login" className="text-orange-500 font-bold hover:underline">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;