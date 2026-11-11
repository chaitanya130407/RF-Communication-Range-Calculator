import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CalculationProvider } from './context/CalculationContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { FormulasPage } from './pages/FormulasPage';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';

const AppContent: React.FC = () => {
  const { currentPage, navigate } = useNavigation();

  // Route Rendering
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'calculator':
        return <CalculatorPage onNavigate={navigate} />;
      case 'history':
        return <HistoryPage onNavigate={navigate} />;
      case 'formulas':
        return <FormulasPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onNavigate={navigate} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CalculationProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </CalculationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
