import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Palette, Check } from 'lucide-react';
import { useTheme, ThemeMode, CustomAccent } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, resolvedTheme, customAccent, setMode, setCustomAccent } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const modes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      desc: 'Crisp bright workspace',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: <Moon className="w-4 h-4 text-blue-400" />,
      desc: 'Deep dark contrast for eyes',
    },
    {
      id: 'system',
      label: 'System Default',
      icon: <Laptop className="w-4 h-4 text-slate-400" />,
      desc: 'Matches OS settings automatically',
    },
    {
      id: 'custom',
      label: 'Custom Mode',
      icon: <Palette className="w-4 h-4 text-rose-500" />,
      desc: 'Crimson Midnight luxury theme',
    },
  ];

  const accents: { id: CustomAccent; name: string; bg: string }[] = [
    { id: 'crimson', name: 'Crimson', bg: '#ef4444' },
    { id: 'sapphire', name: 'Sapphire', bg: '#2563eb' },
    { id: 'emerald', name: 'Emerald', bg: '#10b981' },
    { id: 'amethyst', name: 'Amethyst', bg: '#8b5cf6' },
  ];

  const currentIcon =
    mode === 'light' ? (
      <Sun className="w-4 h-4 text-amber-500" />
    ) : mode === 'dark' ? (
      <Moon className="w-4 h-4 text-blue-400" />
    ) : mode === 'system' ? (
      <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
    ) : (
      <Palette className="w-4 h-4 text-rose-500" />
    );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
        title={`Theme: ${mode} mode (click to change)`}
        aria-label="Toggle theme appearance"
      >
        {currentIcon}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Appearance & Theme
            </p>
          </div>

          <div className="space-y-0.5">
            {modes.map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    if (m.id !== 'custom') setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-[12.5px] transition-colors ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{m.icon}</span>
                    <div className="min-w-0">
                      <p className="leading-tight truncate">{m.label}</p>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-400 font-normal truncate">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Custom Accent Palette (when Custom Mode is active) */}
          {mode === 'custom' && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 px-2 pb-1">
              <p className="text-[10.5px] font-medium text-slate-400 dark:text-slate-400 mb-1.5">
                Custom Accent Color
              </p>
              <div className="flex items-center gap-2">
                {accents.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setCustomAccent(acc.id);
                    }}
                    style={{ backgroundColor: acc.bg }}
                    className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center shadow-xs ${
                      customAccent === acc.id
                        ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    title={acc.name}
                  >
                    {customAccent === acc.id && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
