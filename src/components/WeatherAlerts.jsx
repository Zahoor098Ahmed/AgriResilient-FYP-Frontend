import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, CloudRain, Wind, AlertTriangle, Bell, Thermometer, Droplets, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export const WeatherAlerts = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userCity = user?.location?.city || 'Karachi, Pakistan';
  const lat = user?.location?.lat || 24.8607; // Default to Karachi
  const lon = user?.location?.lon || 67.0011;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using User's specific coordinates
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        setWeatherData(data);
        
        // Show real notification if weather is extreme
        if (data.current.temperature_2m > 40) {
          toast.error(t('Extreme Heat Alert!', 'شدید گرمی کا الرٹ!', 'شدید گرمي جو الرٽ!'), {
            description: t('Temperature reached ' + data.current.temperature_2m + '°C', 'درجہ حرارت ' + data.current.temperature_2m + '°C تک پہنچ گیا ہے', 'درجه حرارت ' + data.current.temperature_2m + '°C تائين پهچي ويو آهي')
          });
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [t]);

  const getWeatherInfo = (code) => {
    if (code === 0) return { label: t('Clear Sky', 'صاف آسمان', 'صاف آسمان'), icon: Sun, color: 'text-yellow-500' };
    if (code <= 3) return { label: t('Partly Cloudy', 'جزوی طور پر ابر آلود', 'جزوي طور تي بادل'), icon: Cloud, color: 'text-blue-400' };
    if (code >= 51) return { label: t('Rainy', 'بارش', 'برسات'), icon: CloudRain, color: 'text-blue-600' };
    return { label: t('Clear', 'صاف', 'صاف'), icon: Sun, color: 'text-yellow-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-800 font-medium animate-pulse">{t('Loading live weather data...', 'حقیقی وقت کا ڈیٹا لوڈ ہو رہا ہے...', 'حقيقي وقت جو ڊيٽا لوڊ ٿي رهيو آهي...')}</p>
        </div>
      </div>
    );
  }

  if (!weatherData || !weatherData.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Weather Data Unavailable', 'موسم کا ڈیٹا دستیاب نہیں ہے', 'موسم جو ڊيٽا موجود ناهي')}</h2>
          <p className="text-gray-600 mb-6">{t('Failed to fetch real-time weather. Please try again later.', 'حقیقی وقت کا موسم حاصل کرنے میں ناکام۔ براہ کرم بعد میں دوبارہ کوشش کریں۔', 'حقيقي وقت جو موسم حاصل ڪرڻ ۾ ناڪام. مهرباني ڪري بعد ۾ ٻيهر ڪوشش ڪريو.')}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            {t('Retry', 'دوبارہ کوشش کریں', 'ٻيهر ڪوشش ڪريو')}
          </Button>
        </div>
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(weatherData.current.weather_code);

  const alerts = [
    {
      severity: weatherData.current.temperature_2m > 35 ? 'high' : 'medium',
      title: weatherData.current.temperature_2m > 35 ? t('Heat Wave Warning', 'ہیٹ ویو وارننگ', 'هيٽ ويو وارننگ') : t('Standard Advisory', 'معیاری مشورہ', 'معياري صلاح'),
      description: t(`Current temperature is ${weatherData.current.temperature_2m}°C with ${weatherData.current.wind_speed_10m}km/h wind.`, `موجودہ درجہ حرارت ${weatherData.current.temperature_2m}°C ہے اور ہوا کی رفتار ${weatherData.current.wind_speed_10m} کلومیٹر فی گھنٹہ ہے۔`, `موجوده درجه حرارت ${weatherData.current.temperature_2m}°C آهي ۽ هوا جي رفتار ${weatherData.current.wind_speed_10m} ڪلوميٽر في ڪلاڪ آهي.`),
      time: 'Live',
      icon: weatherData.current.temperature_2m > 35 ? AlertTriangle : Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center font-black text-4xl"
        >
          {t('Weather & Alerts', 'موسم اور الرٹس', 'موسم ۽ الرٽس')}
        </motion.h1>

        {/* Map */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-white shadow-2xl overflow-hidden border-2 border-green-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-inner group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1653058221377-96690fa50146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwc3Rvcm0lMjBjbG91ZHN8ZW58MXx8fHwxNzYyMTQ5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Weather Map"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-white/50"
                  >
                    {React.createElement(weatherInfo.icon, { 
                      className: `w-20 h-20 ${weatherInfo.color}` 
                    })}
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/20 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{userCity} {t('Forecast', 'پیشگوئی', 'اڳڪٿي')}</span>
                    <Badge className="bg-green-500 text-white">{t('Live', 'لائیو', 'لائيو')}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 p-6 bg-green-50 rounded-2xl border-2 border-green-100">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    <Thermometer className="w-10 h-10 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t('Temperature', 'درجہ حرارت', 'درجه حرارت')}</p>
                    <h3 className="text-4xl font-black text-gray-800">{weatherData.current.temperature_2m}°C</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
                    <Droplets className="w-8 h-8 text-blue-500 mb-3" />
                    <p className="text-sm text-gray-500 font-bold">{t('Humidity', 'نمی', 'نيمo')}</p>
                    <h4 className="text-2xl font-bold text-gray-800">{weatherData.current.relative_humidity_2m}%</h4>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-100">
                    <Wind className="w-8 h-8 text-amber-500 mb-3" />
                    <p className="text-sm text-gray-500 font-bold">{t('Wind Speed', 'ہوا کی رفتار', 'هوا جي رفتار')}</p>
                    <h4 className="text-2xl font-bold text-gray-800">{weatherData.current.wind_speed_10m} km/h</h4>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <Cloud className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-bold">{t('Condition', 'حالت', 'حالت')}</p>
                      <h4 className="text-xl font-bold text-gray-800">{weatherInfo.label}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Alerts */}
        <h2 className="text-gray-800 mb-6">{t('Active Alerts', 'فعال الرٹس', 'فعال الرٽس')}</h2>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, x: 10 }}
            >
              <Card
                className={`p-6 ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-50 border-l-4 border-yellow-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <alert.icon className="w-8 h-8 text-gray-700" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-800">{alert.title}</h3>
                      <Badge
                        className={
                          alert.severity === 'high'
                            ? 'bg-red-500 text-white'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                        }
                      >
                        {alert.severity === 'high'
                          ? t('HIGH', 'زیادہ', 'وڌيڪ')
                          : alert.severity === 'medium'
                          ? t('MEDIUM', 'درمیانہ', 'وچولو')
                          : t('LOW', 'کم', 'گھٽ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{alert.description}</p>
                    <p className="text-gray-500 text-sm">{t(alert.time, 'لائیو', 'لائيو')}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};



