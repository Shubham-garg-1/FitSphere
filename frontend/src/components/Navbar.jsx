import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, getRole, logout } from '../utils/auth';
import { Menu, X, LogOut, LayoutDashboard, Home, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const role = getRole();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'TRAINER') return '/trainer';
    return '/client';
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 py-4 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link className="text-2xl font-extrabold tracking-tight text-gradient" to="/">
          FitSphere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!loggedIn ? (
            <>
              <Link 
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5" 
                to="/"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5" 
                to="/login"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link 
                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5" 
                to="/register"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5" 
                to={getDashboardLink()}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-xs font-bold tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase">
                {role || 'User'}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200/60 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {!loggedIn ? (
            <>
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2" 
                to="/"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2" 
                to="/login"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-sm text-center transition-all flex items-center justify-center gap-2" 
                to="/register"
              >
                <UserPlus className="w-5 h-5" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2" 
                to={getDashboardLink()}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold text-slate-500">Active Role</span>
                <span className="text-xs font-bold tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase">
                  {role || 'User'}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full text-base font-semibold text-red-600 hover:bg-red-50 py-3 rounded-xl border border-red-200/60 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
