
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Home, User, PlusCircle, LogOut, Zap, Menu, X, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { logout, auth } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex w-full md:w-auto justify-between items-center">
        <Link to={auth.user?.isAdmin ? "/admin" : "/home"} className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-xl flex items-center justify-center group-hover:bg-lime-custom transition-colors">
            <Zap className="text-white  w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </div>
          <span className="font-bold text-xl sm:text-2xl tracking-tighter">Hackoie</span>
        </Link>
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-grow items-center justify-center gap-4 sm:gap-8 w-full`}>
        {!auth.user?.isAdmin ? (
          <>
            <Link 
              to="/home" 
              className={`flex items-center gap-2 font-bold transition-colors text-sm ${isActive('/home') ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 font-bold transition-colors text-sm ${isActive('/profile') ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link 
                to="/create-team" 
                className={`flex items-center gap-2 font-bold transition-colors text-sm ${isActive('/create-team') ? 'text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <PlusCircle size={18} />
                <span>Create Team</span>
              </Link>
            </div>
          </>
        ) : (
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 font-bold transition-colors text-sm ${isActive('/admin') ? 'text-black' : 'text-gray-400 hover:text-black'}`}
          >
            <LayoutDashboard size={18} />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex items-center gap-4 shrink-0`}>
        <div className="text-right hidden lg:block">
          <p className="text-sm font-bold text-black leading-none">{auth.user?.name}</p>
          <p className="text-[10px] text-lime-custom font-bold uppercase tracking-widest mt-1">
            {auth.user?.isAdmin ? 'Administrator' : 'Hacker'}
          </p>
        </div>
        <button 
          onClick={logout}
          className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
