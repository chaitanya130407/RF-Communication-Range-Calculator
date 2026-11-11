import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageId =
  | 'home'
  | 'dashboard'
  | 'calculator'
  | 'history'
  | 'formulas'
  | 'about';

interface NavigationContextType {
  currentPage: PageId;
  navigate: (page: PageId | 'login' | 'signup') => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const VALID_PAGES: PageId[] = ['home', 'dashboard', 'calculator', 'history', 'formulas', 'about'];

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize page from window hash if present and valid, else default to 'home'
  const getInitialPage = (): PageId => {
    const hash = window.location.hash.replace('#', '') as PageId;
    if (VALID_PAGES.includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [historyStack, setHistoryStack] = useState<PageId[]>([getInitialPage()]);

  // Sync with browser history and hash
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update hash when currentPage changes
  const navigate = (page: PageId | 'login' | 'signup') => {
    // If login/signup is requested, redirect to dashboard
    let targetPage: PageId = 'home';
    if (page === 'login' || page === 'signup') {
      targetPage = 'dashboard';
    } else if (VALID_PAGES.includes(page as PageId)) {
      targetPage = page as PageId;
    }

    if (targetPage === currentPage) return;

    setHistoryStack((prev) => [...prev, targetPage]);
    setCurrentPage(targetPage);
    window.location.hash = targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop(); // Remove current page
      const previousPage = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      setCurrentPage(previousPage);
      window.location.hash = previousPage;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Smart Fallback to home
      const fallback: PageId = 'home';
      setHistoryStack([fallback]);
      setCurrentPage(fallback);
      window.location.hash = fallback;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = currentPage !== 'home' && historyStack.length > 1;

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigate,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
