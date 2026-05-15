import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Droplets, Thermometer, Wind, TrendingUp, AlertTriangle, Leaf, MapPin, Award, Trophy, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const Dashboard = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState({
    temp: 32,
    humidity: 65,
    wind: 15,
    condition: t('Loading...', 'لوڈ ہو رہا ہے...')
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = user?.location?.city || 'Punjab, Pakistan';
        // Simple search for coordinates based on city (simulation or simple mapping)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=30.3753&longitude=69.3451&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        const data = await res.json();
        setWeatherData({
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m,
          condition: data.current.weather_code === 0 ? t('Clear Sky', 'صاف آسمان') : t('Cloudy', 'ابر آلود')
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };
    fetchWeather();
  }, [user, t]);

  const rewards = [
     { title: t('Early Adopter', 'ابتدائی اپنانے والا'), icon: '🌱', points: 100, date: '2 days ago' },
     { title: t('Green Hero', 'گرین ہیرو'), icon: '🏆', points: 250, date: '1 week ago' },
     { title: t('Recycle Master', 'ری سائیکل ماسٹر'), icon: '⭐', points: 500, date: 'Unlocked' },
   ];

  const crops = [
    { name: 'Wheat', health: 85, stage: 'Growing', status: 'healthy', icon: '🌾' },
    { name: 'Rice', health: 72, stage: 'Flowering', status: 'warning', icon: '🌾' },
    { name: 'Cotton', health: 90, stage: 'Mature', status: 'healthy', icon: '🌿' },
    { name: 'Sugarcane', health: 65, stage: 'Growing', status: 'attention', icon: '🎋' },
  ];

  const alerts = [
    { type: 'warning', message: t('Heavy rainfall expected in 48 hours', '48 گھنٹوں میں بھاری بارش متوقع ہے'), time: '2h ago' },
    { type: 'info', message: t('Pest control recommended for wheat field', 'گندم کے کھیت کے لیے کیڑے مار کی سفارش'), time: '5h ago' },
    { type: 'success', message: t('Irrigation completed successfully', 'آبپاشی کامیابی سے مکمل'), time: '1d ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-gray-800 mb-2">
            {t(`Welcome back, ${user?.name || 'Farmer'}!`, `خوش آمدید، ${user?.name || 'کسان'}!`)}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            {user?.location?.city || t('Punjab, Pakistan', 'پنجاب، پاکستان')}
          </p>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, rotateY: 2 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl mb-8">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Cloud className="w-16 h-16" />
                  </motion.div>
                  <div>
                    <div className="text-5xl">{weatherData.temp}°C</div>
                    <p className="text-blue-200">{weatherData.condition}</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-blue-200">Humidity</div>
                    {weatherData.humidity}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-blue-200">Wind</div>
                    {weatherData.wind} km/h
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-blue-200">Feels</div>
                    {weatherData.temp + 2}°C
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Crop Health */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-800">{t('Crop Health Monitoring', 'فصل کی صحت کی نگرانی')}</h2>
                <TrendingUp className="text-green-600" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {crops.map((crop, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-green-500 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl">{crop.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-800">{crop.name}</span>
                          <Badge className={
                            crop.status === 'healthy' ? 'bg-green-500' :
                            crop.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }>
                            {crop.health}%
                          </Badge>
                        </div>
                        <Progress value={crop.health} className="h-2" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{t('Stage:', 'مرحلہ:')} {crop.stage}</div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-xl">
                <h2 className="text-gray-800 mb-4">{t('Soil Analysis', 'مٹی کا تجزیہ')}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>pH Level</span>
                    <span className="font-bold text-green-600">6.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nitrogen</span>
                    <span className="font-bold text-blue-600">Optimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moisture</span>
                    <span className="font-bold text-teal-600">45%</span>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-xl">
                <h2 className="text-gray-800 mb-4">{t('Recent Activities', 'حالیہ سرگرمیاں')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Applied fertilizer to Wheat</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Completed irrigation for Rice</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-yellow-500" />
                <h2 className="text-gray-800">{t('Alerts', 'الرٹس')}</h2>
              </div>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      alert.type === 'info' ? 'bg-blue-50 border-blue-500' : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800 mb-1">{alert.message}</div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </motion.div>
                ))}
              </div>
              <Button className="w-full mt-6 bg-gray-50 text-gray-600 hover:bg-gray-100">
                {t('View All Alerts', 'تمام الرٹس دیکھیں')}
              </Button>
            </Card>

            <Card className="p-6 bg-green-900 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="text-yellow-400 w-6 h-6" />
                  <h3 className="text-white">{t('Your Rewards', 'آپ کے انعامات')}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-400 uppercase font-bold">{t('Total Credits', 'کل کریڈٹس')}</div>
                  <div className="text-xl font-black">{user?.credits || 0}</div>
                </div>
              </div>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-green-800 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <div className="font-bold text-sm">{reward.title}</div>
                        <div className="text-[10px] text-green-400">{reward.date}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-700 text-white text-[10px]">+{reward.points} pts</Badge>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => onNavigate('carbon-rewards')}
                className="w-full mt-4 bg-green-700 hover:bg-green-600 border-none text-xs"
              >
                {t('View All Rewards', 'تمام انعامات دیکھیں')}
              </Button>
            </Card>

            <Card className="p-6 bg-white shadow-xl">
              <h3 className="mb-4 text-gray-800">{t('Market Prices', 'مارکیٹ کی قیمتیں')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-green-800 pb-2">
                  <span>Wheat</span>
                  <span className="font-bold">PKR 4,200/40kg</span>
                </div>
                <div className="flex justify-between items-center border-b border-green-800 pb-2">
                  <span>Rice</span>
                  <span className="font-bold">PKR 8,500/40kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cotton</span>
                  <span className="font-bold">PKR 9,200/40kg</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


