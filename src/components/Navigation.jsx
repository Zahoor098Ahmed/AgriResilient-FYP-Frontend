import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, User, LayoutDashboard, Home, Info, Phone, BookOpen, Leaf, Award, Recycle, Cloud, LogIn, LogOut, Shield, Bell, CloudSun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const Navigation = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch live weather alert for navigation ticker
    const fetchQuickWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.3753&longitude=69.3451&current=temperature_2m,weather_code');
        const data = await res.json();
        if (data.current.temperature_2m > 35) {
          setWeatherAlert(`${t('Heat Warning', 'گرمی کا الرٹ')}: ${data.current.temperature_2m}°C`);
        } else if (data.current.weather_code >= 51) {
          setWeatherAlert(t('Rain Forecasted Today', 'آج بارش متوقع ہے'));
        }
      } catch (err) {
        console.error('Quick weather fetch error:', err);
      }
    };
    fetchQuickWeather();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);

  const navLinks = [
    { id: 'home', label: t('Home', 'ہوم', 'گھر'), icon: Home },
    { id: 'dashboard', label: t('Dashboard', 'ڈیش بورڈ', 'ڊيش بورڊ'), icon: LayoutDashboard },
    { id: 'crop-advisory', label: t('Advisory', 'مشورہ', 'صلاح'), icon: Leaf },
    { id: 'waste-recycling', label: t('Recycling', 'ری سائیکلنگ', 'ري سائيڪلنگ'), icon: Recycle },
    { id: 'carbon-rewards', label: t('Rewards', 'انعامات', 'انعام'), icon: Award },
    { id: 'weather', label: t('Weather', 'موسم', 'موسم'), icon: Cloud },
    { id: 'blog', label: t('Resources', 'وسائل', 'وسيلا'), icon: BookOpen },
    { id: 'about', label: t('About', 'ہمارے بارے میں', 'اسان بابت'), icon: Info },
    { id: 'contact', label: t('Contact', 'رابطہ', 'رابطو'), icon: Phone },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: t('Admin', 'ایڈمن', 'ايڊمن'), icon: Shield });
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'sd', name: 'سنڌي', flag: '🇵🇰' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100"
    >
      <div className="max-w-full px-2">
        <div className="flex justify-start items-center ml-22 h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="bg-green-600 p-2 rounded-xl shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent hidden sm:block">
                AgriResilient
              </span>
            </motion.div>

            {/* Live Weather Ticker */}
            {weatherAlert && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-bold shadow-sm cursor-pointer"
                onClick={() => onNavigate('weather')}
              >
                <CloudSun className="w-4 h-4 animate-pulse" />
                <span>{weatherAlert}</span>
              </motion.div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-between flex-1">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    currentPage === link.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-[1px] bg-gray-200 mx-2" />

              {/* Profile / Login Button */}
              {user ? (
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={() => onNavigate('profile')}
                    className="cursor-pointer relative group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${user.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                          {user.gender === 'female' ? '👩' : '👨'}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout();
                      onNavigate('login');
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  {t('Login', 'لاگ ان')}
                </motion.button>
              )}

              <div className="h-6 w-[1px] bg-gray-200" />

              {/* Language Toggle */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{language}</span>
                </motion.button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-green-50 transition-colors ${
                          language === lang.code ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left ${
                    currentPage === link.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-4">
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        language === lang.code ? 'bg-green-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
                {user ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-full bg-green-50 text-green-700"
                    >
                      <User className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        onNavigate('home');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-full bg-red-50 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold shadow-md"
                  >
                    <LogIn className="w-4 h-4" />
                    {t('Login', 'لاگ ان')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};


