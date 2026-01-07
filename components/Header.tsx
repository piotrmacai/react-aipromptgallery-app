import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/images/ainsiderlogo.png" alt="Ainsider Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight text-white hover:text-primary transition-colors duration-300">
            Ainsider Gallery
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-slate-400"
              )
            }
          >
            <Activity className="h-4 w-4" />
            Gallery
          </NavLink>
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-slate-400"
              )
            }
          >
            <Sparkles className="h-4 w-4" />
            Assistant
          </NavLink>
        </nav>
      </div>
    </header>
  );
};