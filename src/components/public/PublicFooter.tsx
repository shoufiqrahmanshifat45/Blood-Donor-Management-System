import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Heart,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner: Emergency Hotline */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 py-3.5 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="font-semibold text-sm sm:text-base">
              Urgent Medical Emergency? Need blood immediately?
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
              <Phone className="w-3.5 h-3.5" /> Hotline: +880 1711-000000 / 999
            </span>
            <Link
              to="/blood-requests"
              className="underline font-bold hover:text-red-100 transition-colors"
            >
              Post Urgent Request &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BloodLine BDMS</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering voluntary blood donors and hospitals across Bangladesh with secure, real-time matching, verified donation tracking, and emergency coordination.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & Privacy Compliant
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                PostgreSQL Cloud DB
              </span>
            </div>
          </div>

          {/* Public Portal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Public Portal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/find-donors" className="hover:text-white transition-colors">
                  Search Donors
                </Link>
              </li>
              <li>
                <Link to="/blood-requests" className="hover:text-white transition-colors">
                  Blood Requests
                </Link>
              </li>
              <li>
                <Link to="/register-donor" className="hover:text-white transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Health Tools & Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Member & Auth */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Member Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Member Sign Up
                </Link>
              </li>
              <li>
                <Link to="/member/dashboard" className="hover:text-white transition-colors">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/member/profile" className="hover:text-white transition-colors">
                  My Donor Profile
                </Link>
              </li>
              <li>
                <Link to="/member/donation-history" className="hover:text-white transition-colors">
                  Donation History
                </Link>
              </li>
            </ul>
          </div>

          {/* Organization & Administration */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Organization
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/organization/sign-in"
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Staff 2FA Sign In
                </Link>
              </li>
              <li>
                <Link to="/management" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/management/blood-stock" className="hover:text-white transition-colors">
                  Blood Stock Monitor
                </Link>
              </li>
              <li>
                <Link to="/management/reports" className="hover:text-white transition-colors">
                  Reports & PDF Exports
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-xs text-slate-500 block">
                  Staff access requires organization authorization & 2FA challenge code.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} BloodLine Donor Management System. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for voluntary community blood donation in Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
};
