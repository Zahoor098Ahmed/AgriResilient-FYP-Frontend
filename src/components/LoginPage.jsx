import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, Globe, AlertCircle, ArrowLeft, ShieldCheck, KeyRound, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export const LoginPage = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { login, signup, forgotPassword, resetPassword, socialLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('auth'); // 'auth', 'forgot', 'reset'
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success(t('Welcome back!', 'خوش آمدید!', 'واپسي تي ڀليڪار!'));
        onNavigate('home');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError(t('An unexpected error occurred. Please try again.', 'ایک غیر متوقع خرابی پیش آگئی۔ براہ کرم دوبارہ کوشش کریں۔', 'هڪ اڻڄاتل غلطي پيش آئي. مهرباني ڪري ٻيهر ڪوشش ڪريو.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Anti-bot check
    if (honeypot) {
      console.log('Bot detected!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match', 'پاس ورڈز مماثل نہیں ہیں', 'پاسورڊ نٿا ملن'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signup(formData.name, formData.email, formData.password, formData.gender);
      if (result.success) {
        toast.success(t('Account created successfully! Please login.', 'اکاؤنٹ کامیابی سے بن گیا! براہ کرم لاگ ان کریں۔', 'اڪائونٽ ڪاميابيءَ سان ٺهي ويو! مهرباني ڪري لاگ ان ڪريو.'));
        // Automatically switch to login tab
        const loginTab = document.querySelector('[value="login"]');
        if (loginTab) loginTab.click();
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError(t('An unexpected error occurred. Please try again.', 'ایک غیر متوقع خرابی پیش آگئی۔ براہ کرم دوبارہ کوشش کریں۔', 'هڪ اڻڄاتل غلطي پيش آئي. مهرباني ڪري ٻيهر ڪوشش ڪريو.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        toast.success(t('OTP sent to your email!', 'او ٹی پی آپ کے ای میل پر بھیج دیا گیا ہے!', 'OTP توهان جي اي ميل تي موڪلي ڇڏيو ويو آهي!'));
        setView('reset');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('Failed to send OTP', 'OTP بھیجنے میں ناکام', 'OTP موڪلڻ ۾ ناڪام'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match', 'پاس ورڈز مماثل نہیں ہیں', 'پاسورڊ نٿا ملن'));
      return;
    }
    setIsLoading(true);
    try {
      const result = await resetPassword(formData.email, formData.otp, formData.password);
      if (result.success) {
        toast.success(t('Password reset successful!', 'پاس ورڈ کامیابی سے تبدیل ہو گیا!', 'پاسورڊ ڪاميابيءَ سان تبديل ٿي ويو!'));
        onNavigate('home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('Failed to reset password', 'پاس ورڈ تبدیل کرنے میں ناکام', 'پاسورڊ تبديل ڪرڻ ۾ ناڪام'));
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Fetch user info from Google using access token
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = await res.json();
        
        const result = await socialLogin({
          name: googleUser.name,
          email: googleUser.email,
          provider: 'google',
          providerId: googleUser.sub,
          profileImage: googleUser.picture
        });

        if (result.success) {
          toast.success(t('Google Login Successful!', 'گوگل لاگ ان کامیاب!', 'گوگل لاگ ان ڪامياب!'));
          onNavigate('home');
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error(t('Google Login failed', 'گوگل لاگ ان ناکام ہوگیا', 'گوگل لاگ ان ناڪام ٿي ويو'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => toast.error(t('Google Login failed', 'گوگل لاگ ان ناکام ہوگیا', 'گوگل لاگ ان ناڪام ٿي ويو'))
  });

  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      googleLogin();
      return;
    }

    // For Facebook, we would use useFacebookLogin or similar
    toast.info(t(`${provider} Login is coming soon with real OAuth!`, `${provider} لاگ ان جلد آرہا ہے!`, `${provider} لاگ ان جلد اچي رهيو آهي!`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl">
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-gray-800 mb-2">{t('Welcome to AgriResilient', 'AgriResilient میں خوش آمدید', 'AgriResilient ۾ ڀليڪار')}</h2>
            <p className="text-gray-600">
              {t('Climate-smart farming solutions', 'موسمیاتی سمارٹ کھیتی کے حل', 'موسمياتي سمارٽ فارمنگ جا حل')}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <AnimatePresence mode="wait">
              {view === 'auth' ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">{t('Login', 'لاگ ان', 'لاگ ان')}</TabsTrigger>
                    <TabsTrigger value="register">{t('Register', 'رجسٹر', 'رجسٽر')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="email" className="text-gray-700">
                          {t('Email', 'ای میل', 'اي ميل')}
                        </Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('Enter your email', 'اپنا ای میل درج کریں', 'پنهنجي اي ميل داخل ڪريو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-gray-700">
                            {t('Password', 'پاس ورڈ', 'پاسورڊ')}
                          </Label>
                          <button
                            type="button"
                            onClick={() => setView('forgot')}
                            className="text-xs text-green-600 hover:text-green-800 font-medium"
                          >
                            {t('Forgot Password?', 'پاس ورڈ بھول گئے؟', 'پاسورڊ وسري ويو؟')}
                          </button>
                        </div>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="password"
                            type="password"
                            placeholder={t('Enter your password', 'اپنا پاس ورڈ درج کریں', 'پنهنجو پاسورڊ داخل ڪريو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-6 rounded-xl shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-6 h-6 border-4 border-white border-t-transparent rounded-full mx-auto"
                            />
                          ) : (
                            t('Login', 'لاگ ان', 'لاگ ان')
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <div className="mb-4 flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Bot className="w-3 h-3" />
                      <span>{t('Anti-bot protection active', 'اینٹی بوٹ تحفظ فعال ہے', 'اينٽي بوٽ تحفظ فعال آهي')}</span>
                    </div>
                    <form onSubmit={handleSignupSubmit} className="space-y-6">
                      {/* Honeypot field - hidden from users */}
                      <div className="hidden">
                        <input 
                          type="text" 
                          value={honeypot} 
                          onChange={(e) => setHoneypot(e.target.value)} 
                          tabIndex="-1" 
                          autoComplete="off"
                        />
                      </div>
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="name" className="text-gray-700">
                          {t('Full Name', 'پورا نام', 'پورو نالو')}
                        </Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="name"
                            type="text"
                            placeholder={t('Enter your name', 'اپنا نام درج کریں', 'پنهنجو نالو داخل ڪريو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="email" className="text-gray-700">
                          {t('Email', 'ای میل', 'اي ميل')}
                        </Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('Enter your email', 'اپنا ای میل درج کریں', 'پنهنجي اي ميل داخل ڪريو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.65 }}
                      >
                        <Label className="text-gray-700">{t('Gender', 'جنس', 'جنس')}</Label>
                        <div className="flex gap-4 mt-2">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, gender: 'male'})}
                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${formData.gender === 'male' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                          >
                            ♂ {t('Male', 'مرد', 'مرد')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, gender: 'female'})}
                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${formData.gender === 'female' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500'}`}
                          >
                            ♀ {t('Female', 'عورت', 'عورت')}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label htmlFor="password" className="text-gray-700">
                          {t('Password', 'پاس ورڈ', 'پاسورڊ')}
                        </Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="password"
                            type="password"
                            placeholder={t('Create a password', 'پاس ورڈ بنائیں', 'پاسورڊ ٺاهيو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label htmlFor="confirmPassword" className="text-gray-700">
                          {t('Confirm Password', 'پاس ورڈ کی تصدیق کریں', 'پاسورڊ جي تصديق ڪريو')}
                        </Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={t('Confirm your password', 'اپنے پاس ورڈ کی تصدیق کریں', 'پنهنجي پاسورڊ جي تصديق ڪريو')}
                            className="pl-10 py-6 border-2 border-green-200 focus:border-green-500 rounded-xl"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-6 rounded-xl shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-6 h-6 border-4 border-white border-t-transparent rounded-full mx-auto"
                            />
                          ) : (
                            <>
                              {t('Register', 'رجسٹر', 'رجسٽر')} 🌱
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>
                </motion.div>
              ) : view === 'forgot' ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">{t('Reset Password', 'پاس ورڈ تبدیل کریں', 'پاسورڊ تبديل ڪريو')}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {t('Enter your email to receive a reset OTP', 'او ٹی پی حاصل کرنے کے لیے اپنا ای میل درج کریں', 'او ٽي پي حاصل ڪرڻ لاءِ پنهنجي اي ميل داخل ڪريو')}
                    </p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-gray-700">{t('Email', 'ای میل', 'اي ميل')}</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@gmail.com"
                          className="pl-10 py-6 border-2 border-green-200 rounded-xl"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 py-6 rounded-xl" disabled={isLoading}>
                      {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto" /> : t('Send OTP', 'او ٹی پی بھیجیں', 'او ٽي پي موڪليو')}
                    </Button>
                    <button type="button" onClick={() => setView('auth')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500">
                      <ArrowLeft className="w-4 h-4" /> {t('Back to Login', 'لاگ ان پر واپس جائیں', 'لاگ ان تي واپس وڃو')}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">{t('Verify OTP', 'او ٹی پی کی تصدیق کریں', 'او ٽي پي جي تصديق ڪريو')}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {t('Enter the 6-digit code and your new password', '6 ہندسوں کا کوڈ اور نیا پاس ورڈ درج کریں', '6 انگن جو ڪوڊ ۽ نئون پاسورڊ داخل ڪريو')}
                    </p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <Label htmlFor="otp" className="text-gray-700">{t('OTP Code', 'او ٹی پی کوڈ', 'او ٽي پي ڪوڊ')}</Label>
                      <div className="relative mt-2">
                        <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          className="pl-10 py-6 border-2 border-green-200 rounded-xl text-center text-2xl tracking-widest"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-gray-700">{t('New Password', 'نیا پاس ورڈ', 'نئون پاسورڊ')}</Label>
                      <div className="relative mt-2">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10 py-6 border-2 border-green-200 rounded-xl"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-700">{t('Confirm Password', 'پاس ورڈ کی تصدیق کریں', 'پاسورڊ جي تصديق ڪريو')}</Label>
                      <div className="relative mt-2">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10 py-6 border-2 border-green-200 rounded-xl"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 py-6 rounded-xl" disabled={isLoading}>
                      {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto" /> : t('Reset Password', 'پاس ورڈ تبدیل کریں', 'پاسورڊ تبديل ڪريو')}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>

          {/* Social Login */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {t('Or continue with', 'یا جاری رکھیں', 'يا جاري رکو')}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </motion.button>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Decorative 3D Elements */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 bg-green-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />
    </div>
  );
};



