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
  const { t, language } = useLanguage();
  const { token, user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const fileInputRef = React.useRef(null);

  // Re-fetch detection if language changes and we have a file
  React.useEffect(() => {
    if (lastFile && scanResult) {
      processFile(lastFile);
    }
  }, [language]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLastFile(file);
      processFile(file);
    }
  };

  const processFile = async (file) => {
    if (!user) {
      setError(t('Please login to use the recycling tool', 'ری سائیکلنگ ٹول استعمال کرنے کے لیے لاگ ان کریں', 'ري سائيڪلنگ ٽول استعمال ڪرڻ لاءِ لاگ ان ڪريو'));
      onNavigate('login');
      return;
    }

    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('File size must be less than 5MB', 'فائل کا سائز 5MB سے کم ہونا چاہیے', 'فائل جي سائيز 5MB کان گهٽ هجڻ گهرجي'));
      return;
    }

    setIsScanning(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('language', language);

    const performScan = async (attempt = 0) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/detect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (response.status === 429) {
          if (attempt < 1) {
            setTimeout(() => performScan(attempt + 1), 2000);
            return;
          }
        }

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
            nearbyCenters: data.nearbyCenters || [],
            recommendations: data.recyclables.map((item, index) => ({
              type: item.itemType || item.type,
              potential: item.potential || t('High Potential', 'زیادہ امکان', 'وڌيڪ امڪان'),
              value: item.value || t('Value Varies', 'قیمت مختلف ہو سکتی ہے', 'قيمت مختلف ٿي سگهي ٿي'),
              description: item.description,
              carbon: `+${Math.floor(Math.random() * 20) + 10} ${t('credits', 'کریڈٹس', 'ڪريڊٽس')}`,
              icon: (item.itemType || item.type || '').toLowerCase().includes('compost') || (item.itemType || item.type || '').toLowerCase().includes('fertilizer') ? Leaf : Factory,
              color: index % 2 === 0 ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700',
            }))
          });
        } else {
          setError(data.message || t('Detection failed', 'شناخت ناکام ہوگئی', 'سڃاڻپ ناڪام ٿي وئي'));
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError(t('Failed to connect to server. Please try again.', 'سرور سے منسلک ہونے میں ناکام۔ دوبارہ کوشش کریں۔', 'سرور سان ڳنڍڻ ۾ ناڪام. ٻيهر ڪوشش ڪريو.'));
      } finally {
        if (attempt >= 0) setIsScanning(false);
      }
    };

    performScan();
  };

  const handleUploadClick = () => {
    if (!user) {
      toast.error(t('Please login to upload images', 'تصویر اپ لوڈ کرنے کے لیے لاگ ان کریں', 'تصوير اپ لوڊ ڪرڻ لاءِ لاگ ان ڪريو'));
      onNavigate('login');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    if (!user) {
      toast.error(t('Please login to use the camera', 'کیمرہ استعمال کرنے کے لیے لاگ ان کریں', 'ڪيمرا استعمال ڪرڻ لاءِ لاگ ان ڪريو'));
      onNavigate('login');
      return;
    }
    toast.info(t('Camera access coming soon!', 'کیمرہ تک رسائی جلد آرہی ہے!', 'ڪيمرا تائين رسائي جلد اچي رهي آهي!'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('RecycleVision - Object Detection', 'RecycleVision - آبجیکٹ کی شناخت', 'RecycleVision - شئي جي سڃاڻپ')}
        </motion.h1>

        {/* Upload Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="p-8 bg-white shadow-2xl mb-8 overflow-hidden">
            <h2 className="text-gray-800 mb-6">
              {t('Upload Object Image', 'آبجیکٹ کی تصویر اپ لوڈ کریں', 'شئي جي تصوير اپ لوڊ ڪريو')}
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

            <Button
              onClick={handleUploadClick}
              disabled={isScanning}
              className="w-full h-40 border-4 border-dashed border-green-200 rounded-3xl hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-4 bg-gray-50 group"
            >
              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="text-green-600 font-bold">{t('Analyzing...', 'تجزیہ کیا جا رہا ہے...', 'تجزيو ڪيو پيو وڃي...')}</p>
                    <p className="text-xs text-gray-500">{t('Fetching Real Pakistani Data', 'پاکستان کا اصل ڈیٹا حاصل کیا جا رہا ہے', 'پاڪستان جو اصل ڊيٽا حاصل ڪيو پيو وڃي')}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-green-100 rounded-full group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-700">{t('Click to Upload Image', 'تصویر اپ لوڈ کرنے کے لیے کلک کریں', 'تصوير اپ لوڊ ڪرڻ لاءِ ڪلڪ ڪريو')}</p>
                    <p className="text-sm text-gray-500">{t('or drag and drop here', 'یا یہاں ڈریگ اینڈ ڈراپ کریں', 'يا هتي ڊريگ ۽ ڊراپ ڪريو')}</p>
                  </div>
                </>
              )}
            </Button>
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
                <h2 className="text-2xl font-bold">{t('Analyzing Image...', 'تصویر کا تجزیہ کیا جا رہا ہے...', 'تصوير جو تجزيو ڪيو پيو وڃي...')}</h2>
                <p className="text-white/80 mt-2">{t('Fetching Real Pakistani Market Data', 'پاکستان کی مارکیٹ کا اصل ڈیٹا حاصل کیا جا رہا ہے', 'پاڪستان جي مارڪيٽ جو اصل ڊيٽا حاصل ڪيو پيو وڃي')}</p>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-3xl font-bold text-gray-800 break-words">{scanResult.detected}</h2>
                  <p className="text-gray-600">{t('Confidence Score:', 'اعتماد کا سکور:', 'اعتماد جو اسڪور:')} {scanResult.confidence}%</p>
                </div>
                <div className="shrink-0 self-start bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  {t('Detected', 'شناخت شدہ', 'سڃاڻپ ٿيل')}
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {scanResult.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, rotateY: 30 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  whileHover={{ scale: 1.05, z: 50 }}
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                >
                  <Card className="h-full bg-white shadow-2xl overflow-hidden transform-gpu">
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
                          <div className="text-gray-500 text-sm">{t('Potential', 'ممکنہ', 'ممڪن')}</div>
                          <div className="text-2xl font-bold text-gray-800 break-words">{rec.potential}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">{t('Market Value', 'مارکیٹ ویلیو', 'مارڪيٽ ويليو')}</div>
                          <div className="text-2xl font-bold text-green-600 break-words">{rec.value}</div>
                        </div>
                      </div>
                      {rec.description && (
                        <p className="text-gray-600 mb-6 text-sm italic break-words">
                          {rec.description}
                        </p>
                      )}
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl shadow-xl">
                        {t('Connect with Recycler', 'ری سائیکلر سے جڑیں', 'ري سائيڪلر سان ڳنڍيو')}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {scanResult.nearbyCenters && scanResult.nearbyCenters.length > 0 && (
              <Card className="p-8 bg-white shadow-xl">
                <h2 className="text-gray-800 mb-6">{t('Nearby Options', 'قریبی مقامات', 'قريبي هنڌ')}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {scanResult.nearbyCenters.map((center, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-green-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Factory className="w-6 h-6 text-green-600" />
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {center.type}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{center.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {t('AI Suggested', 'AI تجویز کردہ', 'AI جي تجويز ڪيل')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


