// Responsive Navigation Bar Component
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, PlusCircle, Info, Menu, X, LogIn, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout, onOpenAddTask }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
        <CheckSquare size={24} />
        <span>Smart To-Do</span>
      </Link>

      <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          onClick={closeMobileMenu}
        >
          Home
        </NavLink>

        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                closeMobileMenu();
                if (onOpenAddTask) onOpenAddTask();
              }}
            >
              <PlusCircle size={17} />
              Add Task
            </button>
          </>
        ) : null}

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          onClick={closeMobileMenu}
        >
          <Info size={17} />
          About
        </NavLink>

        {user ? (
          <button type="button" className="nav-link" onClick={onLogout}>
            <LogOut size={17} />
            Sign out
          </button>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
              <LogIn size={17} />
              Sign in
            </NavLink>
            <NavLink to="/register" className="nav-cta-btn" onClick={closeMobileMenu}>
              Create account
            </NavLink>
          </>
        )}
      </nav>

      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default Navbar;
