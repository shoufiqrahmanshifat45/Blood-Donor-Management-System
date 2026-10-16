import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d19] font-sans text-slate-800 dark:text-slate-100 transition-colors">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
