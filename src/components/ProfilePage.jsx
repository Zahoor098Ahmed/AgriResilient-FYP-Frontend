import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Bell, Globe, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

export const ProfilePage = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    city: user?.location?.city || ''
  });

  if (!user) return null;

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    try {
      await updateProfile({ preferredLanguage: newLang });
    } catch (err) {
      console.error('Failed to save language preference:', err);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let updateData = { ...formData };

      // Geocoding logic: Get Lat/Lon from city name using Open-Meteo Geocoding API (Free)
      if (formData.city && formData.city !== user?.location?.city) {
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formData.city)}&count=1&language=en&format=json`);
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            updateData.lat = geoData.results[0].latitude;
            updateData.lon = geoData.results[0].longitude;
            updateData.city = geoData.results[0].name; // Normalized name
          }
        } catch (geoErr) {
          console.error('Geocoding error:', geoErr);
        }
      }

      const result = await updateProfile(updateData);
      if (result.success) {
        toast.success(t('Profile updated successfully!', 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی!', 'پروفائل ڪاميابي سان اپڊيٽ ٿي وئي!'));
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center text-4xl font-black"
        >
          {t('Profile & Settings', 'پروفائل اور ترتیبات', 'پروفائل ۽ سيٽنگون')}
        </motion.h1>

        {/* Avatar Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <Card className="p-8 bg-white shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500" />
            <motion.div
              className="relative w-32 h-32 mx-auto mb-4 group"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-full h-full rounded-full border-4 border-white shadow-xl flex items-center justify-center text-5xl overflow-hidden bg-gray-100 ${user.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.gender === 'female' ? '👩' : '👨'
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-all opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
              </button>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 font-medium">
              {user.role === 'admin' ? t('Administrator', 'ایڈمنسٹریٹر', 'ايڊمنسٽريٽر') : t('Member', 'ممبر', 'ميمبر')} • {user.location?.city || 'Punjab, Pakistan'}
            </p>
          </Card>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Card className="p-8 bg-white shadow-xl border-2 border-white/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t('Personal Information', 'ذاتی معلومات', 'ذاتي معلومات')}</h2>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {isEditing ? t('Cancel', 'کینسل', 'منسوخ') : t('Edit Profile', 'پروفائل تبدیل کریں', 'پروفائل تبديل ڪريو')}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 font-bold">{t('Full Name', 'پورا نام', 'پورو نالو')}</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      className="pl-10 py-6 bg-gray-50 border-gray-200" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing} 
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-bold">{t('Email', 'ای میل', 'اي ميل')}</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input className="pl-10 py-6 bg-gray-50 border-gray-200" defaultValue={user.email} disabled />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 font-bold">{t('Location', 'مقام', 'جڳهه')}</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    className="pl-10 py-6 bg-gray-50 border-gray-200" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder={t('Enter your city', 'اپنا شہر درج کریں', 'پنهنجو شهر داخل ڪريو')}
                    disabled={!isEditing} 
                  />
                </div>
              </div>
              {isEditing && (
                <div className="space-y-4">
                  <Button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-green-600 py-6 rounded-xl font-bold shadow-lg shadow-green-200"
                  >
                    {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto" /> : t('Save Changes', 'تبدیلیاں محفوظ کریں', 'تبديليون محفوظ ڪريو')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-white shadow-xl">
            <h2 className="text-gray-800 mb-6">{t('Preferences', 'ترجیحات', 'ترجيحات')}</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{t('Push Notifications', 'پش نوٹیفیکیشنز', 'پش نوٽيفڪيشنز')}</span>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{t('Language', 'زبان', 'ٻولي')}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('en')}
                    className={language === 'en' ? 'bg-green-600' : ''}
                  >
                    EN
                  </Button>
                  <Button 
                    variant={language === 'ur' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('ur')}
                    className={language === 'ur' ? 'bg-green-600' : ''}
                  >
                    اردو
                  </Button>
                  <Button 
                    variant={language === 'sd' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('sd')}
                    className={language === 'sd' ? 'bg-green-600' : ''}
                  >
                    سنڌي
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button 
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-100"
              >
                {t('Logout', 'لاگ آؤٹ', 'لاگ آئوٽ')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};


