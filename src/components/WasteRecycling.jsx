import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Scan, Leaf, Factory, TrendingUp, MapPin, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export const WasteRecycling = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { token, user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!user) {
      setError(t('Please login to use the recycling tool', 'ری سائیکلنگ ٹول استعمال کرنے کے لیے لاگ ان کریں'));
      onNavigate('login');
      return;
    }

    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('File size must be less than 5MB', 'فائل کا سائز 5MB سے کم ہونا چاہیے'));
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/detect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Detection failed');
      }

      const data = await response.json();

      if (data.success) {
        setScanResult({
          detected: data.detected,
          confidence: (data.confidence * 100).toFixed(1),
          recyclables: data.recyclables,
          recommendations: data.recyclables.map((item, index) => ({
            type: item,
            potential: 'High Potential',
            value: 'Value Varies',
            carbon: `+${Math.floor(Math.random() * 20) + 10} credits`,
            icon: index % 2 === 0 ? Factory : Leaf,
            color: index % 2 === 0 ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700',
          })),
          recyclers: [
            { name: 'Eco-Friendly Recyclers', distance: '5 km', rating: 4.8, verified: true },
            { name: 'Green Life Solutions', distance: '12 km', rating: 4.6, verified: true },
            { name: 'Recycle Pros', distance: '18 km', rating: 4.9, verified: true },
          ],
        });
      } else {
        setError(data.message || 'Detection failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(t('Failed to connect to server', 'سرور سے منسلک ہونے میں ناکام'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      toast.error(t('Please login to upload images', 'تصویر اپ لوڈ کرنے کے لیے لاگ ان کریں'));
      onNavigate('login');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    if (!user) {
      toast.error(t('Please login to use the camera', 'کیمرہ استعمال کرنے کے لیے لاگ ان کریں'));
      onNavigate('login');
      return;
    }
    toast.info(t('Camera access coming soon!', 'کیمرہ تک رسائی جلد آرہی ہے!'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('RecycleVision - Object Detection', 'RecycleVision - آبجیکٹ کی شناخت')}
        </motion.h1>

        {/* Upload Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="p-8 bg-white shadow-2xl mb-8">
            <h2 className="text-gray-800 mb-6">
              {t('Upload Object Image', 'آبجیکٹ کی تصویر اپ لوڈ کریں')}
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <motion.div
              className="border-4 border-dashed border-green-300 rounded-2xl p-12 text-center bg-gradient-to-br from-green-50 to-blue-50 cursor-pointer hover:border-green-500 transition-all"
              whileHover={{ scale: 1.02, rotateY: 3 }}
              onClick={handleUploadClick}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Upload className="w-16 h-16 mx-auto text-green-600 mb-4" />
              </motion.div>
              <h3 className="text-gray-800 mb-2">
                {t('Click to upload or drag & drop', 'اپ لوڈ کرنے کے لیے کلک کریں یا گھسیٹیں')}
              </h3>
              <p className="text-gray-600">
                {t('PNG, JPG up to 5MB', 'PNG، JPG 5MB تک')}
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Button 
                  onClick={handleUploadClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {t('Upload', 'اپ لوڈ')}
                </Button>
                <Button 
                  onClick={handleCameraClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t('Camera', 'کیمرہ')}
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Scanning Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mb-4"
                >
                  <Scan className="w-20 h-20 mx-auto" />
                </motion.div>
                <h2 className="text-2xl font-bold">{t('AI Analyzing Object...', 'AI آبجیکٹ کا تجزیہ کر رہا ہے...')}</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Results */}
        {scanResult && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-green-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{scanResult.detected}</h2>
                  <p className="text-gray-600">{t('Confidence Score:', 'اعتماد کا سکور:')} {scanResult.confidence}%</p>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  {t('Detected', 'شناخت شدہ')}
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {scanResult.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: -90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  whileHover={{ scale: 1.05, z: 50 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card className="h-full bg-white shadow-2xl overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${rec.color}`} />
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${rec.color} text-white shadow-xl`}>
                          <rec.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-gray-800 text-xl font-bold">{rec.type}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {rec.carbon}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <div className="text-gray-500 text-sm">{t('Potential', 'ممکنہ')}</div>
                          <div className="text-2xl font-bold text-gray-800">{rec.potential}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">{t('Market Value', 'مارکیٹ ویلیو')}</div>
                          <div className="text-2xl font-bold text-green-600">{rec.value}</div>
                        </div>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl shadow-xl">
                        {t('Connect with Recycler', 'ری سائیکلر سے جڑیں')}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="p-8 bg-white shadow-xl">
              <h2 className="text-gray-800 mb-6">{t('Nearby Recyclers', 'قریبی ری سائیکلرز')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {scanResult.recyclers.map((recycler, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-green-500 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Factory className="w-6 h-6 text-green-600" />
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {recycler.distance}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">{recycler.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {t('Verified Center', 'تصدیق شدہ مرکز')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};


