import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Sun, Bug, Calendar, TrendingUp, Leaf, Factory, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export const CropAdvisory = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { token, user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCropData, setSelectedCropData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Re-fetch advisory if language changes and we already have recommendations
  React.useEffect(() => {
    if (selectedCrop && recommendations.length > 0) {
      handleGetAdvisory();
    }
  }, [language]);

  const handleGetAdvisory = async () => {
    if (!user) {
      toast.error(t('Please login to get AI recommendations', 'AI مشورے حاصل کرنے کے لیے لاگ ان کریں', 'AI مشورا حاصل ڪرڻ لاءِ لاگ ان ڪريو'));
      onNavigate('login');
      return;
    }

    if (!selectedCrop) {
      toast.error(t('Please select a crop first', 'پہلے فصل منتخب کریں', 'پهرين فصل چونڊيو'));
      return;
    }

    setLoading(true);
    setRetryCount(0);
    setRecommendations([]);
    
    // Simple fetch with timeout or better UX
    const fetchWithRetry = async (attempt = 0) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/advisory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
          cropType: selectedCrop,
          location: user.location?.city || 'Pakistan',
          language: language
        }),
      });

        if (response.status === 429) {
          if (attempt < 1) {
            setRetryCount(attempt + 1);
            setTimeout(() => fetchWithRetry(attempt + 1), 2000);
            return;
          }
        }

        if (!response.ok) throw new Error('Failed to fetch advisory');

        const data = await response.json();
        if (data.success) {
          setRecommendations(data.data.recommendations.map(rec => ({
            ...rec,
            icon: rec.category.toLowerCase().includes('irrigation') || rec.category.toLowerCase().includes('pani') || rec.category.includes('آبپاشي') ? Droplets : 
                  rec.category.toLowerCase().includes('fertilizer') || rec.category.toLowerCase().includes('khad') || rec.category.includes('ڀاڻ') ? Sun : 
                  rec.category.toLowerCase().includes('harvesting') || rec.category.toLowerCase().includes('katai') || rec.category.includes('لڻڻ') ? Leaf : 
                  rec.category.toLowerCase().includes('land') || rec.category.toLowerCase().includes('zameen') ? Factory : Bug,
            color: rec.category.toLowerCase().includes('irrigation') || rec.category.toLowerCase().includes('pani') || rec.category.includes('آبپاشي') ? 'from-blue-500 to-blue-700' : 
                   rec.category.toLowerCase().includes('fertilizer') || rec.category.toLowerCase().includes('khad') || rec.category.includes('ڀاڻ') ? 'from-amber-500 to-amber-700' : 
                   rec.category.toLowerCase().includes('harvesting') || rec.category.toLowerCase().includes('katai') || rec.category.includes('لڻڻ') ? 'from-green-600 to-green-800' : 
                   rec.category.toLowerCase().includes('land') || rec.category.toLowerCase().includes('zameen') ? 'from-stone-500 to-stone-700' : 'from-red-500 to-red-700',
          })));
          
          // Store best sowing date if available
          if (data.data.best_sowing_date) {
            setSelectedCropData({
              name: data.data.crop,
              sowingDate: data.data.best_sowing_date
            });
          }
          
          toast.success(t('AI Advisory generated!', 'AI مشورہ تیار ہے!', 'AI مشورو تيار آهي!'));
        }
      } catch (err) {
        console.error('Advisory error:', err);
        toast.error(t('Failed to connect to AI service', 'AI سروس سے منسلک ہونے میں ناکام', 'AI سروس سان ڳنڍڻ ۾ ناڪام'));
      } finally {
        setLoading(false);
      }
    };

    fetchWithRetry();
  };

  const crops = [
    { value: 'wheat', label: '🌾 ' + t('Wheat', 'گندم', 'ڪڻڪ'), icon: '🌾' },
    { value: 'rice', label: '🌾 ' + t('Rice', 'چاول', 'چانور'), icon: '🌾' },
    { value: 'cotton', label: '🌿 ' + t('Cotton', 'کپاس', 'ڪپهه'), icon: '🌿' },
    { value: 'sugarcane', label: '🎋 ' + t('Sugarcane', 'گنا', 'ڪمند'), icon: '🎋' },
    { value: 'maize', label: '🌽 ' + t('Maize', 'مکئی', 'مڪئي'), icon: '🌽' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('AI Crop Advisory', 'AI فصل مشورہ', 'AI فصل جو مشورو')}
        </motion.h1>

        {/* Input Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <Card className="p-8 bg-white shadow-2xl mb-8 overflow-hidden transform-gpu">
            <h2 className="text-gray-800 mb-6">{t('Select Your Crop', 'اپنی فصل منتخب کریں', 'پنهنجي فصل چونڊيو')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700 mb-2">{t('Crop Type', 'فصل کی قسم', 'فصل جو قسم')}</Label>
                <Select onValueChange={setSelectedCrop}>
                  <SelectTrigger className="py-6 border-2 border-green-200">
                    <SelectValue placeholder={t('Choose crop...', 'فصل منتخب کریں...', 'فصل چونڊيو...')} />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700 mb-2">{t('Field Size (Hectares)', 'کھیت کا سائز (ہیکٹر)', 'ٻنيءَ جي سائيز (هيڪٽر)')}</Label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <motion.div
              className="mt-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleGetAdvisory}
                disabled={loading || !selectedCrop}
                className="w-full py-8 bg-green-600 hover:bg-green-700 text-white text-xl rounded-xl shadow-xl transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('AI Analyzing...', 'AI تجزیہ کر رہا ہے...', 'AI تجزيو ڪري رهيو آهي...')}
                  </div>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6 mr-2" />
                    {t('Get AI Recommendations', 'AI مشورے حاصل کریں', 'AI مشورا حاصل ڪريو')}
                  </>
                )}
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-gray-800 mb-2">
                {t('Personalized Advice for', 'آپ کے لیے ذاتی مشورہ', 'توهان لاءِ ذاتي مشورو')} {selectedCropData?.name || selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
              </h2>
              {selectedCropData?.sowingDate && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold shadow-sm">
                  <Calendar className="w-5 h-5" />
                  {t('Best Sowing Window:', 'بیجائی کا بہترین وقت:', 'پوکي جو بهترين وقت:')} {selectedCropData.sowingDate}
                </div>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: -30 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                >
                  <Card className="h-full bg-white shadow-2xl overflow-hidden border-t-8 border-green-500 flex flex-col transform-gpu">
                    <div className="p-8 flex-grow">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${rec.color} text-white shadow-xl`}>
                          <rec.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-gray-800 text-xl font-bold leading-tight">{rec.title}</h3>
                      </div>
                      
                      <div className="mb-4">
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 mb-4 px-3 py-1">
                          {rec.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                        {rec.description}
                      </p>

                      {rec.schedule && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {t('Key Steps', 'اہم اقدامات', 'اهم قدم')}
                          </h4>
                          <div className="space-y-3">
                            {rec.schedule.map((step, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-green-300 transition-colors">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 group-hover:scale-150 transition-transform flex-shrink-0" />
                                <span className="text-sm text-gray-700 leading-snug">
                                  {typeof step === 'string' ? step : (step.day + (step.amount ? ` - ${step.amount}` : ''))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


