import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, MessageCircle, Trophy, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const CarbonRewards = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user, redeemReward } = useAuth();

  const handleClaimReward = async (rewardTitle, cost) => {
    if (!user) {
      toast.error(t('Please login to claim rewards', 'انعامات حاصل کرنے کے لیے لاگ ان کریں'));
      onNavigate('login');
      return;
    }

    if ((user.credits || 0) < cost) {
      toast.error(t('Insufficient credits!', 'ناکافی کریڈٹس!'));
      return;
    }

    try {
      const result = await redeemReward(rewardTitle, cost);
      if (result.success) {
        toast.success(t(`${rewardTitle} redeemed successfully!`, `${rewardTitle} کامیابی سے حاصل کر لیا گیا!`));
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Redemption failed');
    }
  };

  const userStats = {
    credits: user?.credits || 0,
    rank: 23,
    nextMilestone: 500,
  };

  const achievements = [
    { title: t('Early Adopter', 'ابتدائی اپنانے والا'), icon: '🌱', unlocked: true },
    { title: t('Water Saver', 'پانی بچانے والا'), icon: '💧', unlocked: true },
    { title: t('Carbon Champion', 'کاربن چیمپیئن'), icon: '🏆', unlocked: false },
    { title: t('Community Leader', 'کمیونٹی لیڈر'), icon: '👥', unlocked: false },
  ];

  const rewardOptions = [
    { title: t('Premium Seeds', 'پریمیم بیج'), cost: 100, icon: '🌾', color: 'from-green-500 to-green-700' },
    { title: t('Fertilizer Discount', 'کھاد کی رعایت'), cost: 150, icon: '🧪', color: 'from-blue-500 to-blue-700' },
    { title: t('Solar Panels', 'سولر پینلز'), cost: 500, icon: '☀️', color: 'from-amber-500 to-amber-700' },
    { title: t('Irrigation System', 'آبپاشی نظام'), cost: 300, icon: '💧', color: 'from-cyan-500 to-cyan-700' },
  ];

  const progressPercentage = Math.min((userStats.credits / userStats.nextMilestone) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center text-4xl font-black"
        >
          {t('Carbon Rewards & Network', 'کاربن انعامات اور نیٹ ورک')}
        </motion.h1>

        {/* User Stats Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-to-br from-green-600 to-green-800 text-white shadow-2xl border-none">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10" />
                </div>
                <div className="text-4xl font-black">{userStats.credits}</div>
                <p className="text-green-100 text-sm">{t('Available Credits', 'دستیاب کریڈٹس')}</p>
              </div>
              
              <div className="text-center border-x border-white/10 px-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>
                <div className="text-4xl font-black">#{userStats.rank}</div>
                <p className="text-green-100 text-sm">{t('Global Rank', 'عالمی درجہ بندی')}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{t('Next Level', 'اگلا لیول')}</span>
                  <span className="font-bold">{userStats.credits} / {userStats.nextMilestone}</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-white/20" />
                <p className="text-xs text-green-200">
                  {Math.max(userStats.nextMilestone - userStats.credits, 0)} {t('more to reach next level', 'مزید پوائنٹس اگلے لیول کے لیے')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <Card className="p-6 bg-white shadow-xl border-2 border-green-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                {t('Your Badges', 'آپ کے بیجز')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-center border-2 transition-all ${item.unlocked ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-xs font-black text-gray-700 uppercase">{item.title}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Redemption Grid */}
            <Card className="p-6 bg-white shadow-xl border-2 border-green-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('Available Rewards', 'دستیاب انعامات')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {rewardOptions.map((opt, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    onClick={() => handleClaimReward(opt.title, opt.cost)}
                    className="p-5 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-green-500 hover:bg-white transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${opt.color} text-white flex items-center justify-center text-2xl shadow-lg`}>
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{opt.title}</h4>
                        <p className="text-sm text-gray-500 font-medium">{opt.cost} {t('Points', 'پوائنٹس')}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        {t('Get', 'حاصل کریں')}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Network */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-xl border-2 border-green-50 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">{t('Farmer Network', 'کسان نیٹ ورک')}</h2>
              </div>
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 border border-green-200">
                        {n}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">User_{n}00</div>
                        <div className="text-[10px] text-gray-500">Verified Farmer</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-black text-sm">{(5-n)*200} pts</div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => {
                  if (!user) {
                    toast.error(t('Please login to join the chat', 'چیٹ میں شامل ہونے کے لیے لاگ ان کریں'));
                    onNavigate('login');
                    return;
                  }
                  toast.info('Chat coming soon!');
                }}
                className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-xl font-bold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('Community Chat', 'کمیونٹی چیٹ')}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


