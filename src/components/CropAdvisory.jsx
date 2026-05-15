import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Sun, Bug, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';

export const CropAdvisory = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleGetAdvisory = () => {
    if (!user) {
      toast.error(t('Please login to get AI recommendations', 'AI مشورے حاصل کرنے کے لیے لاگ ان کریں'));
      onNavigate('login');
      return;
    }
    setShowRecommendations(true);
  };

  const crops = [
    { value: 'wheat', label: '🌾 ' + t('Wheat', 'گندم'), icon: '🌾' },
    { value: 'rice', label: '🌾 ' + t('Rice', 'چاول'), icon: '🌾' },
    { value: 'cotton', label: '🌿 ' + t('Cotton', 'کپاس'), icon: '🌿' },
    { value: 'sugarcane', label: '🎋 ' + t('Sugarcane', 'گنا'), icon: '🎋' },
  ];

  const recommendations = [
    {
      icon: Droplets,
      title: t('Irrigation Schedule', 'آبپاشی کا شیڈول'),
      description: t('Water your wheat every 7-10 days. Next irrigation 10', 'ہر 7-10 دنوں میں اپنی گندم کو پانی دیں'),
      color: 'from-blue-500 to-blue-700',
      schedule: [
        { day: 'Nov 3', status: 'completed', amount: '50mm' },
        { day: 'Nov 10', status: 'upcoming', amount: '45mm' },
        { day: 'Nov 17', status: 'planned', amount: '50mm' },
      ],
    },
    {
      icon: Sun,
      title: t('Fertilizer Application', 'کھاد کا اطلاق'),
      description: t('Apply NPK fertilizer (20:10:10) at 150 kg/hectare', 'NPK کھاد (20:10:10) 150 کلوگرام فی ہیکٹر لگائیں'),
      color: 'from-amber-500 to-amber-700',
      schedule: [
        { day: 'Nov 5', type: 'Urea', amount: '100 kg/ha' },
        { day: 'Nov 20', type: 'DAP', amount: '75 kg/ha' },
        { day: 'Dec 5', type: 'Potash', amount: '50 kg/ha' },
      ],
    },
    {
      icon: Bug,
      title: t('Pest Control', 'کیڑے مار'),
      description: t('Watch for aphids. Spray neem oil if detected', 'افڈز کے لیے دیکھیں۔ اگر پتہ چلے تو نیم کا تیل اسپرے کریں'),
      color: 'from-red-500 to-red-700',
      alerts: [
        { pest: 'Aphids', risk: 'Medium', action: 'Monitor weekly' },
        { pest: 'Stem Borer', risk: 'Low', action: 'Preventive spray' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('AI Crop Advisory', 'AI فصل مشورہ')}
        </motion.h1>

        {/* Input Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="p-8 bg-white shadow-2xl mb-8">
            <h2 className="text-gray-800 mb-6">{t('Select Your Crop', 'اپنی فصل منتخب کریں')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700 mb-2">{t('Crop Type', 'فصل کی قسم')}</Label>
                <Select onValueChange={setSelectedCrop}>
                  <SelectTrigger className="py-6 border-2 border-green-200">
                    <SelectValue placeholder={t('Choose crop...', 'فصل منتخب کریں...')} />
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
                <Label className="text-gray-700 mb-2">{t('Field Size (Hectares)', 'کھیت کا سائز (ہیکٹر)')}</Label>
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
                className="w-full py-8 bg-green-600 hover:bg-green-700 text-white text-xl rounded-xl shadow-xl transition-all"
                disabled={!selectedCrop}
              >
                {t('Get Recommendations', 'سفارشات حاصل کریں')}
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* Recommendations */}
        {showRecommendations && (
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -90 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, z: 50 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Card className="h-full bg-white shadow-2xl overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${rec.color}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${rec.color} text-white shadow-lg`}>
                        <rec.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-gray-800 font-bold">{rec.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{rec.description}</p>
                    {rec.schedule && (
                      <div className="space-y-3">
                        {rec.schedule.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm border-b pb-2">
                            <span className="text-gray-500">{item.day}</span>
                            <span className="font-medium text-green-700">{item.amount || item.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


