import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';

const VALUE_ICONS = [Target, Users, Zap, Sparkles];

export const AboutPage = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [apiContent, setApiContent] = useState(null);

  useEffect(() => {
    const fetchContent = () => {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/content/about`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) setApiContent(data.data);
        })
        .catch((err) => console.error('About content fetch error:', err));
    };
    fetchContent();
    const interval = setInterval(fetchContent, 8000);
    return () => clearInterval(interval);
  }, []);

  const hardcodedTeam = [
    { name: 'Dr. Ali Hassan', role: t('AI Researcher', 'AI محقق', 'AI محقق'), emoji: '👨‍💻' },
    { name: 'Fatima Khan', role: t('Agricultural Expert', 'زرعی ماہر', 'زرعي ماهر'), emoji: '👩‍🌾' },
    { name: 'Ahmed Raza', role: t('Software Engineer', 'سافٹ ویئر انجینئر', 'سافٽ ويئر انجنيئر'), emoji: '👨‍💼' },
    { name: 'Sara Malik', role: t('UX Designer', 'UX ڈیزائنر', 'UX ڊيزائنر'), emoji: '👩‍🎨' },
  ];

  const hardcodedValues = [
    { icon: Target, title: t('Mission', 'مشن', 'مشن'), desc: t('Empower farmers with AI technology', 'کسانوں کو AI ٹیکنالوجی سے بااختیار بنانا', 'هارين کي AI ٽيڪنالاجي سان بااختيار بڻائڻ') },
    { icon: Users, title: t('Community', 'کمیونٹی', 'ڪميونٽي'), desc: t('Building sustainable farming networks', 'پائیدار کھیتی کے نیٹ ورک بنانا', 'پائيدار زراعت جا نيٽ ورڪ بڻائڻ') },
    { icon: Zap, title: t('Innovation', 'اختراع', 'جدت'), desc: t('Climate-smart solutions', 'موسمیاتی سمارٹ حل', 'موسمياتي سمارٽ حل') },
  ];

  const localize = (field) => field?.[language] || field?.en || '';

  const intro = apiContent?.intro ? localize(apiContent.intro) : t(
    'AgriResilient is an AI-powered platform designed to help Pakistani farmers adapt to climate change through smart crop advisory, waste recycling, and carbon rewards.',
    'AgriResilient ایک AI سے چلنے والا پلیٹ فارم ہے جو پاکستانی کسانوں کو موسمیاتی تبدیلی کے مطابق ڈھالنے میں مدد کرتا ہے۔',
    'AgriResilient هڪ AI سان هلندڙ پليٽ فارم آهي جيڪو پاڪستاني هارين کي موسمياتي تبديليءَ موجب ڍلڻ ۾ مدد ڪري ٿو.'
  );

  const values = apiContent?.values?.length > 0
    ? apiContent.values.map((v, i) => ({
        icon: VALUE_ICONS[i % VALUE_ICONS.length],
        title: localize(v.title),
        desc: localize(v.desc),
      }))
    : hardcodedValues;

  const team = apiContent?.team?.length > 0
    ? apiContent.team.map((m) => ({ name: m.name, role: localize(m.role), emoji: m.emoji, image: m.image }))
    : hardcodedTeam;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-12 text-center"
        >
          {t('About AgriResilient', 'AgriResilient کے بارے میں', 'AgriResilient بابت')}
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-white shadow-2xl text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {intro}
            </p>
          </Card>
        </motion.div>

        <h2 className="text-gray-800 mb-8 text-center">{t('Our Values', 'ہماری اقدار', 'اسان جون قدرون')}</h2>
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

        <h2 className="text-gray-800 mb-8 text-center">{t('Our Team', 'ہماری ٹیم', 'اسان جي ٽيم')}</h2>
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
                {member.image ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 shadow-lg border-4 border-white ring-2 ring-green-100">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="text-6xl mb-4">{member.emoji}</div>
                )}
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


