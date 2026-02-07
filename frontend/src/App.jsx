import {Routes, Route ,Navigate,useLocation} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./store/authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload"
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/navBar";
import Profile from "./pages/Profile";
function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // To track where the user is
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  // Define paths where the Navbar SHOULD NOT appear (e.g., inside the Admin panel or Login)
  // Or keep it everywhere if you want the AlgoNest brand present.
  const showNavbar = !["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/problems" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        {/* Auth Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Dashboard/Homepage */}
        <Route path="/dashboard" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        
        {/* Features */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </>
  );
}

export default App;