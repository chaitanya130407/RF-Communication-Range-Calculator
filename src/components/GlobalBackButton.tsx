import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface GlobalBackButtonProps {
  label?: string;
  fallbackText?: string;
  className?: string;
}

export const GlobalBackButton: React.FC<GlobalBackButtonProps> = ({
  label = 'Back',
  className = '',
}) => {
  const { goBack, canGoBack } = useNavigation();

  if (!canGoBack) return null;

  return (
    <button
      onClick={goBack}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
