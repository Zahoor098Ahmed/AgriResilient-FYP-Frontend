import React from 'react';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';



export const NotFoundPage = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="text-9xl mb-4"
          >
            🌾
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-800 mb-4"
            style={{ fontSize: '72px' }}
          >
            404
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-gray-800 mb-4">
            {t('Page Not Found', 'صفحہ نہیں ملا')}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {t(
              'Looks like this crop field is empty! Let\'s get you back to the farm.',
              'لگتا ہے یہ فصل کا کھیت خالی ہے! آئیے آپ کو واپس فارم پر لے چلتے ہیں۔'
            )}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={() => onNavigate('home')}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-6"
              >
                <Home className="w-5 h-5 mr-2" />
                {t('Go Home', 'گھر جائیں')}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={() => onNavigate('dashboard')}
                className="bg-white border-2 border-green-500 text-green-700 hover:bg-green-50 px-8 py-6"
              >
                <Search className="w-5 h-5 mr-2" />
                {t('Dashboard', 'ڈیش بورڈ')}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
            >
              {['🌱', '🌾', '🌿', '💧'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};



