import React from 'react';
import { motion } from 'motion/react';
import { Sprout, Recycle, Award, Cloud, TrendingUp, Users, Droplets, Sun, Zap, Shield, ArrowRight, Play, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export const Enhanced3DHomePage = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const features = [
    {
      id: 'crop-advisory',
      icon: Sprout,
      title: t('AI Crop Advisory', 'AI فصل مشورہ', 'AI فصل صلاح'),
      description: t(
        'Get personalized recommendations for irrigation, fertilization, and pest control',
        'آبپاشی، کھاد اور کیڑے مار کے لیے ذاتی نوعیت کی سفارشات حاصل کریں',
        'آبپاشي، ڀاڻ ۽ حشرات مار لاءِ ذاتي صلاحون حاصل ڪريو'
      ),
      color: 'from-green-400 via-green-500 to-green-600',
      emoji: '🌱',
    },
    {
      id: 'waste-recycling',
      icon: Recycle,
      title: t('Waste Recycling', 'فضلہ ری سائیکل', 'فضول ري سائيڪل'),
      description: t(
        'Transform damaged crops into biofuel and compost with AI detection',
        'تباہ شدہ فصلوں کو AI کے ساتھ بائیو فیول اور کھاد میں تبدیل کریں',
        'تباھ ٿيل فصلن کي AI سان بائيو فيول ۽ ڀاڻ ۾ تبديل ڪريو'
      ),
      color: 'from-blue-400 via-blue-500 to-blue-600',
      emoji: '♻️',
    },
    {
      id: 'carbon-rewards',
      icon: Award,
      title: t('Carbon Rewards', 'کاربن انعامات', 'ڪاربن انعام'),
      description: t(
        'Earn rewards for sustainable practices and connect with farmer network',
        'پائیدار طریقوں کے لیے انعامات حاصل کریں اور کسان نیٹ ورک سے جڑیں',
        'پائيدار طريقن لاءِ انعام حاصل ڪريو ۽ هارين جي نيٽورڪ سان ڳنڍيو'
      ),
      color: 'from-amber-400 via-amber-500 to-amber-600',
      emoji: '🏆',
    },
    {
      id: 'weather',
      icon: Cloud,
      title: t('Weather Alerts', 'موسم کے الرٹس', 'موسم جون خبردارين'),
      description: t(
        'Real-time weather monitoring and flood/drought predictions',
        'حقیقی وقت کی موسم کی نگرانی اور سیلاب/خشک سالی کی پیشین گوئیاں',
        'حقيقي وقت جي موسم جي نگراني ۽ ٻوڏ/خشڪ سالي جون اڳڪٿيون'
      ),
      color: 'from-cyan-400 via-cyan-500 to-cyan-600',
      emoji: '⛈️',
    },
    {
      id: 'dashboard',
      icon: Droplets,
      title: t('Water Management', 'پانی کا انتظام', 'پاڻي جو انتظام'),
      description: t(
        'Smart irrigation scheduling to save water and increase yields',
        'پانی بچانے اور پیداوار بڑھانے کے لیے سمارٹ آبپاشی شیڈولنگ',
        'پاڻي بچائڻ ۽ پيداوار وڌائڻ لاءِ سمارٹ آبپاشي شيڈولنگ'
      ),
      color: 'from-teal-400 via-teal-500 to-teal-600',
      emoji: '💧',
    },
    {
      id: 'dashboard',
      icon: Shield,
      title: t('Crop Protection', 'فصل کی حفاظت', 'فصل جي حفاظت'),
      description: t(
        'AI-powered pest and disease detection for early prevention',
        'جلد روک تھام کے لیے AI سے چلنے والی کیڑے اور بیماریوں کی شناخت',
        'جلد روڪٿام لاءِ AI سان هلندڙ حشرات ۽ بيمارين جي سڃاڻپ'
      ),
      color: 'from-green-400 via-green-500 to-green-600',
      emoji: '🛡️',
    },
  ];

  const testimonials = [
    {
      name: t('Ali Akber', 'علی اکبر', 'علي اڪبر'),
      location: t('NawabShah', 'نواب شاہ', 'نواب شاهه'),
      text: t(
        'AgriResilient helped me increase my wheat yield by 30%!',
        'AgriResilient نے میری گندم کی پیداوار میں 30٪ اضافہ کیا!',
        'AgriResilient منهنجي ڪڻڪ جي پيداوار ۾ 30٪ اضافو ڪيو!'
      ),
      image: 'https://c8.alamy.com/comp/KF2N6Y/a-portrait-of-a-sindhi-villager-pakistan-KF2N6Y.jpg',
      rating: 5,
    },
    {
      name: t('Muhammad Ali', 'محمد علی', 'محمد علي'),
      location: t('Faisalabad', 'فیصل آباد', 'فيصل آباد'),
      text: t(
        'The AI advisory is spot on. Saved my cotton crop from pests.',
        'AI مشورہ بالکل درست ہے۔ میری کپاس کی فصل کو کیڑوں سے بچایا۔',
        'AI صلاح بلڪل درست آهي. منهنجي ڪپاس جي فصل کي حشرن کان بچايو.'
      ),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
      rating: 5,
    },
    {
      name: t('Ghulam Hasain', 'غلام حسین', 'غلام حسين'),
      location: t('Sakrand', 'سکرنڈ', 'سڪرنڊ'),
      text: t(
        'A revolutionary platform for Pakistani agriculture.',
        'پاکستانی زراعت کے لیے ایک انقلابی پلیٹ فارم۔',
        'پاڪستاني زراعت لاءِ هڪ انقلابي پليٽ فارم۔'
      ),
      image: 'https://ozoutback.com.au/Pakistan/sindh/slides/19791221009.jpg',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              🌾
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-4 border border-green-200"
              >
                <Zap className="w-4 h-4 mr-2 inline" />
                {t('Climate-Smart Agriculture for Pakistan', 'پاکستان کے لیے کلائمیٹ سمارٹ زراعت', 'پاڪستان لاءِ ڪلائميٽ سمارٽ زراعت')}
              </motion.div>
              <h1 className={`${language === 'sd' ? 'text-5xl lg:text-6xl' : 'text-5xl lg:text-6xl'} font-black text-gray-900 leading-tight mb-6`}>
                {t('Resilient Farming', 'مستحکم زراعت', 'مستحڪم زراعت')} <br />
                <span className="text-green-600 italic">{t('Powered by AI', 'AI کے ذریعے', 'AI جي ذريعي')}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                {t(
                  'Join thousands of farmers using AI to adapt to climate change, increase yields, and earn carbon rewards.',
                  'ان ہزاروں کسانوں میں شامل ہوں جو موسمیاتی تبدیلیوں کے مطابق ڈھلنے، پیداوار بڑھانے اور کاربن انعامات حاصل کرنے کے لیے AI کا استعمال کر رہے ہیں۔',
                  'انهن هزارين هارين ۾ شامل ٿيو جيڪي موسمي تبديلين موجب ڍلڻ، پيداوار وڌائڻ ۽ ڪاربن انعام حاصل ڪرڻ لاءِ AI جو استعمال ڪري رهيا آهن.'
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => onNavigate('crop-advisory')}
                  className="px-10 py-8 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xl font-bold shadow-2xl shadow-green-200 transition-all flex items-center gap-2 group"
                >
                  {t('Get Started', 'شروع کریں', 'شروع ڪريو')}
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="px-10 py-8 border-2 border-green-600 text-green-600 rounded-2xl text-xl font-bold hover:bg-green-50 flex items-center gap-2"
                >
                  <Play className="mr-2 fill-current w-6 h-6" />
                  {t('Watch Video', 'ویڈیو دیکھیں', 'ويڊيو ڏسو')}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0, rotateY: -30 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
              style={{ perspective: '1000px' }}
            >
              <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMTExMDEzMHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Farming"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-black/20" />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 right-10 bg-white/90 backdrop-blur p-6 rounded-3xl shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-green-500 rounded-2xl text-white">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold">{t('Yield Increase', 'پیداوار میں اضافہ', 'پيداوار ۾ اضافو')}</div>
                      <div className="text-2xl font-bold text-gray-900">+30%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('Our Features', 'ہماری خصوصیات', 'اسان جون خاصيتون')} 🚀
            </h2>
            <p className="text-xl text-gray-600">
              {t('Everything you need to modernize your farm and fight climate change.', 'اپنے فارم کو جدید بنانے اور موسمیاتی تبدیلی سے لڑنے کے لیے آپ کو درکار ہر چیز۔', 'پنهنجي فارم کي جديد بڻائڻ ۽ موسمياتي تبديلي سان وڙهڻ لاءِ توهان کي گهربل هر شيءِ۔')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateY: -90, scale: 0.5 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: 'spring',
                  damping: 15,
                }}
                whileHover={{
                  y: -15,
                  rotateY: 10,
                  z: 50,
                }}
                className="group h-full"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                onClick={() => onNavigate(feature.id)}
              >
                <Card className="p-8 bg-white border-2 border-transparent group-hover:border-green-400 transition-all h-full rounded-[2.5rem] shadow-xl hover:shadow-2xl flex flex-col items-center text-center cursor-pointer overflow-hidden transform-gpu">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl mb-8 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}
                  >
                    <feature.icon className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
                  <div className="mt-8 text-4xl group-hover:scale-125 transition-transform">{feature.emoji}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('What Farmers Say', 'کسان کیا کہتے ہیں', 'هاري ڇا ٿا چون')} 💬
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100, rotateY: -90 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <Card className="p-8 bg-gray-50 rounded-[2.5rem] shadow-lg hover:shadow-2xl h-full relative overflow-hidden group transition-all duration-300 transform-gpu">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                      <img src={test.image} alt={test.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{test.name}</h4>
                      <p className="text-sm text-green-600 font-bold">{test.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-lg relative z-10 leading-relaxed">"{test.text}"</p>
                  <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="text-8xl transform rotate-12">🌾</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-green-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10,
                    repeat: Infinity,
                  }}
                >
                  🌱
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                {t('Ready to modernize your farm?', 'اپنے فارم کو جدید بنانے کے لیے تیار ہیں؟', 'پنهنجي فارم کي جديد بڻائڻ لاءِ تيار آهيو؟')}
              </h2>
              <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
                {t(
                  'Join AgriResilient today and become part of Pakistan\'s climate-smart farming revolution.',
                  'آج ہی AgriResilient میں شامل ہوں اور پاکستان کے موسمیاتی سمارٹ فارمنگ انقلاب کا حصہ بنیں۔',
                  'اڄ ئي AgriResilient ۾ شامل ٿيو ۽ پاڪستان جي موسمياتي سمارٽ فارمنگ انقلاب جو حصو بڻجو۔'
                )}
              </p>
              <Button
                onClick={() => onNavigate('login')}
                className="px-12 py-8 bg-white text-green-600 hover:bg-green-50 rounded-2xl text-xl font-bold shadow-2xl transition-all"
              >
                {t('Join Now', 'ابھی شامل ہوں', 'هاڻي شامل ٿيو')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};


