import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutProps } from '../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Air Quality Monitor</h1>
            <p>Environmental Data Analysis Platform</p>
          </div>
          <nav className="navigation">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
            >
              Analytics
            </Link>
            <Link 
              to="/upload" 
              className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
            >
              Upload Data
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Air Quality Monitor. Built with React & NestJS.</p>
      </footer>
    </div>
  );
};

export default Layout;
