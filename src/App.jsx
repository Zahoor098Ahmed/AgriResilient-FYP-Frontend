import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Lazy load pages for better performance
const Enhanced3DHomePage = lazy(() => import('./components/Enhanced3DHomePage').then(module => ({ default: module.Enhanced3DHomePage })));
const LoginPage = lazy(() => import('./components/LoginPage').then(module => ({ default: module.LoginPage })));
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const CropAdvisory = lazy(() => import('./components/CropAdvisory').then(module => ({ default: module.CropAdvisory })));
const WasteRecycling = lazy(() => import('./components/WasteRecycling').then(module => ({ default: module.WasteRecycling })));
const CarbonRewards = lazy(() => import('./components/CarbonRewards').then(module => ({ default: module.CarbonRewards })));
const WeatherAlerts = lazy(() => import('./components/WeatherAlerts').then(module => ({ default: module.WeatherAlerts })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(module => ({ default: module.BlogPage })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

function LoadingScreen() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
      <p className="text-green-800 font-medium animate-pulse text-lg">
        {t('Loading RecycleVision...', 'RecycleVision لوڈ ہو رہا ہے...', 'RecycleVision لوڊ ٿي رهيو آهي...')}
      </p>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [backendMessage, setBackendMessage] = useState('');
  const { user, loading } = useAuth();

  useEffect(() => {
    // Keep URL clean as we are using state-based navigation
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
    
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/health`)
      .then(res => res.json())
      .then(data => setBackendMessage(`Connected (Worker ${data.worker})`))
      .catch(err => console.error('Backend connection error:', err));
  }, []);

  const handleNavigate = (page) => {
    // Keep URL clean as we are using state-based navigation
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }

    // Only Dashboard remains strictly protected for viewing
    const strictlyProtected = ['dashboard', 'admin'];
    if (!user && strictlyProtected.includes(page)) {
      setCurrentPage('login');
      toast.error('Please login to access the Dashboard');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderPage = () => {
    // Strictly protected routes (Login required to even view)
    const strictlyProtected = ['dashboard', 'admin', 'profile', 'carbon-rewards'];
    if (!user && strictlyProtected.includes(currentPage)) {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Enhanced3DHomePage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'crop-advisory':
        return <CropAdvisory onNavigate={handleNavigate} />;
      case 'waste-recycling':
        return <WasteRecycling onNavigate={handleNavigate} />;
      case 'carbon-rewards':
        return <CarbonRewards onNavigate={handleNavigate} />;
      case 'weather':
        return <WeatherAlerts onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel onNavigate={handleNavigate} /> : <NotFoundPage onNavigate={handleNavigate} />;
      default:
        return <Enhanced3DHomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className="pt-20">
        <Suspense fallback={<LoadingScreen />}>
          {renderPage()}
        </Suspense>
      </div>
      <Footer onNavigate={handleNavigate} />
      <ChatBot onNavigate={handleNavigate} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}



