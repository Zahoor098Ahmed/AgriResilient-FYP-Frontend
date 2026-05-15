import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';

export const AboutPage = ({ onNavigate }) => {
  const { t } = useLanguage();

  const team = [
    { name: 'Dr. Ali Hassan', role: t('AI Researcher', 'AI محقق'), emoji: '👨‍💻' },
    { name: 'Fatima Khan', role: t('Agricultural Expert', 'زرعی ماہر'), emoji: '👩‍🌾' },
    { name: 'Ahmed Raza', role: t('Software Engineer', 'سافٹ ویئر انجینئر'), emoji: '👨‍💼' },
    { name: 'Sara Malik', role: t('UX Designer', 'UX ڈیزائنر'), emoji: '👩‍🎨' },
  ];

  const values = [
    { icon: Target, title: t('Mission', 'مشن'), desc: t('Empower farmers with AI technology', 'کسانوں کو AI ٹیکنالوجی سے بااختیار بنانا') },
    { icon: Users, title: t('Community', 'کمیونٹی'), desc: t('Building sustainable farming networks', 'پائیدار کھیتی کے نیٹ ورک بنانا') },
    { icon: Zap, title: t('Innovation', 'اختراع'), desc: t('Climate-smart solutions', 'موسمیاتی سمارٹ حل') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-12 text-center"
        >
          {t('About AgriResilient', 'AgriResilient کے بارے میں')}
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-white shadow-2xl text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {t(
                'AgriResilient is an AI-powered platform designed to help Pakistani farmers adapt to climate change through smart crop advisory, waste recycling, and carbon rewards.',
                'AgriResilient ایک AI سے چلنے والا پلیٹ فارم ہے جو پاکستانی کسانوں کو موسمیاتی تبدیلی کے مطابق ڈھالنے میں مدد کرتا ہے۔'
              )}
            </p>
          </Card>
        </motion.div>

        <h2 className="text-gray-800 mb-8 text-center">{t('Our Values', 'ہماری اقدار')}</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <Card className="p-6 bg-white shadow-xl text-center h-full">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-green-500 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <h2 className="text-gray-800 mb-8 text-center">{t('Our Team', 'ہماری ٹیم')}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1, rotateY: 10 }}
            >
              <Card className="p-6 bg-white shadow-xl text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-gray-800">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


