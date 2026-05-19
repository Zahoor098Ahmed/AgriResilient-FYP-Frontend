import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const BlogPage = ({ onNavigate }) => {
  const { t } = useLanguage();

  const articles = [
    {
      title: t('Climate-Smart Farming in Pakistan', 'پاکستان میں موسمیاتی سمارٹ کھیتی', 'پاڪستان ۾ موسمياتي سمارٽ فارمنگ'),
      excerpt: t('Learn how to adapt your farming practices to climate change', 'موسمیاتی تبدیلی کے لیے اپنی کھیتی کو کیسے ڈھالیں', 'سکو ته ڪيئن پنهنجي فارمنگ جي طريقن کي موسمياتي تبديلي سان مطابقت ڏجي'),
      author: 'Dr. Ali Hassan',
      date: 'Nov 1, 2025',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMTExMDEzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: t('Maximizing Wheat Yield in 2025', '2025 میں گندم کی پیداوار کو زیادہ سے زیادہ کرنا', '2025 ۾ ڪڻڪ جي پيداوار کي وڌ کان وڌ ڪرڻ'),
      excerpt: t('Best practices for wheat cultivation this season', 'اس موسم میں گندم کی کاشت کے بہترین طریقے', 'هن موسم ۾ ڪڻڪ جي پوک جا بهترين طريقا'),
      author: 'Fatima Khan',
      date: 'Oct 28, 2025',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1664729570424-069f0c0d5ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzYyMTQ5MDYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: t('Turning Waste into Profit', 'فضلہ کو منافع میں تبدیل کرنا', 'فضول کي فائدي ۾ تبديل ڪرڻ'),
      excerpt: t('How recycling damaged crops can earn you money', 'تباہ شدہ فصلوں کی ری سائیکلنگ سے پیسے کیسے کمائیں', 'تباھ ٿيل فصلن جي ري سائيڪلنگ مان پئسا ڪيئن ڪمائجن'),
      author: 'Ahmed Raza',
      date: 'Oct 25, 2025',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1752741177226-d4d595d8c517?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBjb21wb3N0fGVufDF8fHx8MTc2MjE0OTA2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-12 text-center"
        >
          {t('Resources & Blog', 'وسائل اور بلاگ', 'وسيلا ۽ بلاگ')}
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
              }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <Card className="bg-white shadow-xl hover:shadow-2xl overflow-hidden h-full cursor-pointer transition-all duration-300 transform-gpu">
                <div className="h-48 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-gray-800 mb-3 font-bold">{article.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-green-600 font-medium"
                    whileHover={{ x: 10 }}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{t('Read More', 'مزید پڑھیں', 'وڌيڪ پڙهو')}</span>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


