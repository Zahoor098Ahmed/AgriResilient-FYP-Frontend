import React from 'react';
import { motion } from 'motion/react';
import { Sprout, Recycle, Award, Cloud, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';



export const HomePage = ({ onNavigate }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Sprout,
      title: t('AI Crop Advisory', 'AI فصل مشورہ'),
      description: t(
        'Get personalized recommendations for irrigation, fertilization, and pest control',
        'آبپاشی، کھاد اور کیڑے مار کے لیے ذاتی نوعیت کی سفارشات حاصل کریں'
      ),
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Recycle,
      title: t('Waste Recycling', 'فضلہ ری سائیکل'),
      description: t(
        'Transform damaged crops into biofuel and compost with AI detection',
        'تباہ شدہ فصلوں کو AI کے ساتھ بائیو فیول اور کھاد میں تبدیل کریں'
      ),
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Award,
      title: t('Carbon Rewards', 'کاربن انعامات'),
      description: t(
        'Earn rewards for sustainable practices and connect with farmer network',
        'پائیدار طریقوں کے لیے انعامات حاصل کریں اور کسان نیٹ ورک سے جڑیں'
      ),
      color: 'from-amber-400 to-amber-600',
    },
  ];

  const testimonials = [
    {
      name: 'Ali Akber',
      location: 'NawabShah',
      text: t(
        'AgriResilient helped me increase my wheat yield by 30%!',
        'AgriResilient نے میری گندم کی پیداوار میں 30٪ اضافہ کیا!'
      ),
      image: 'https://c8.alamy.com/comp/KF2N6Y/a-portrait-of-a-sindhi-villager-pakistan-KF2N6Y.jpg',
    },
    {
      name: 'Muhammad Ali',
      location: 'Lahore',
      text: t(
        'The waste recycling feature saved my damaged rice crop!',
        'فضلہ ری سائیکل نے میری تباہ شدہ چاول کی فصل کو بچایا!'
      ),
      image: 'https://images.unsplash.com/photo-1654526645468-9ae1cde48fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxMzA0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'G. Husain',
      location: 'Sakrand',
      text: t(
        'Real-time weather alerts helped me protect my crops from floods',
        'حقیقی وقت کے موسم کے الرٹس نے میری فصلوں کو سیلاب سے بچایا'
      ),
      image: 'https://ozoutback.com.au/Pakistan/sindh/slides/19791221009.jpg',
    },
  ];

  const stats = [
    { value: '10,000+', label: t('Farmers', 'کسان'), icon: Users },
    { value: '50,000+', label: t('Hectares Managed', 'ہیکٹر منظم'), icon: Sprout },
    { value: '30%', label: t('Avg Yield Increase', 'اوسط پیداوار میں اضافہ'), icon: TrendingUp },
    { value: '24/7', label: t('Weather Monitoring', 'موسم کی نگرانی'), icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden ">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761812789688-ebcdb114ce73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbiUyMGZhcm0lMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjIxNDkwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Pakistan Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/60" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ y: 100, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.h1
              className="text-white mb-6"
              animate={{
                textShadow: [
                  '0 0 20px rgba(34, 197, 94, 0.5)',
                  '0 0 40px rgba(34, 197, 94, 0.8)',
                  '0 0 20px rgba(34, 197, 94, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('Empower Farmers with AI Resilience', 'کسانوں کو AI لچک سے بااختیار بنائیں')}
            </motion.h1>
            <motion.p
              className="text-green-100 text-xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t(
                'Climate-smart crop advisory, waste recycling, and carbon rewards for Pakistani farmers',
                'پاکستانی کسانوں کے لیے موسمیاتی سمارٹ فصل مشورہ، فضلہ ری سائیکل، اور کاربن انعامات'
              )}
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-8 py-6 rounded-xl shadow-2xl transform hover:scale-110 transition-all"
              >
                {t('Get Started', 'شروع کریں')} 🌱
              </Button>
              <Button
                onClick={() => onNavigate('about')}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-6 rounded-xl backdrop-blur-md shadow-2xl transform hover:scale-110 transition-all"
              >
                {t('Learn More', 'مزید جانیں')}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.h2
          className="text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('Our Features', 'ہماری خصوصیات')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, rotateY: -90 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card className="p-8 h-full bg-white shadow-xl hover:shadow-2xl transition-all">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        {/* <div className="container mx-auto px-4"> */}
          <motion.h2
            className="text-center text-gray-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('Success Stories', 'کامیابی کی کہانیاں')}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                  y: -10
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Card className="p-6 bg-gradient-to-br from-white to-green-50 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ImageWithFallback
                        src={test.image}
                        alt={test.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                    </motion.div>
                    <div>
                      <h4 className="text-gray-800">{test.name}</h4>
                      <p className="text-gray-600 text-sm">{test.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{test.text}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-white mb-6">
            {t('Ready to Transform Your Farm?', 'اپنے فارم کو تبدیل کرنے کے لیے تیار ہیں؟')}
          </h2>
          <p className="text-xl mb-8">
            {t(
              'Join thousands of Pakistani farmers using AI for climate resilience',
              'موسمیاتی لچک کے لیے AI استعمال کرنے والے ہزاروں پاکستانی کسانوں میں شامل ہوں'
            )}
          </p>
          <Button
            onClick={() => onNavigate('login')}
            className="bg-white text-green-700 hover:bg-green-50 px-12 py-6 rounded-xl shadow-2xl transform hover:scale-110 transition-all"
          >
            {t('Sign Up Now', 'ابھی سائن اپ کریں')} 
          </Button>
        </motion.div>
      </section>
    </div>
  );
};



