import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export const BlogPage = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      title: t('Climate-Smart Farming in Pakistan', 'پاکستان میں موسمیاتی سمارٹ کھیتی', 'پاڪستان ۾ موسمياتي سمارٽ فارمنگ'),
      excerpt: t('Learn how to adapt your farming practices to climate change', 'موسمیاتی تبدیلی کے لیے اپنی کھیتی کو کیسے ڈھالیں', 'سکو ته ڪيئن پنهنجي فارمنگ جي طريقن کي موسمياتي تبديلي سان مطابقت ڏجي'),
      author: 'Dr. Ali Hassan',
      date: 'Nov 1, 2025',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMTExMDEzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      content: t(
        `Pakistan's farmers are on the front line of climate change — shifting monsoon patterns, unpredictable heatwaves, and both floods and droughts within the same year have made traditional planting calendars unreliable.\n\nStart by watching real-time weather alerts (see the Weather page) instead of relying only on the old sowing calendar — a week's difference in sowing date can now mean the difference between a full harvest and a failed one. Switch to drought-tolerant wheat and cotton varieties recommended by your local agriculture extension office where floods or dry spells have become common.\n\nSoil health matters more than ever: composting crop residue (see the Recycling page) instead of burning it keeps moisture in the soil and cuts fertilizer costs. Combined with laser land leveling and drip irrigation where affordable, these changes can offset a large share of climate-driven yield loss.\n\nFinally, diversify — a farm growing two or three crops recovers from a bad season far better than one relying on a single crop.`,
        `پاکستان کے کسان موسمیاتی تبدیلی کی زد میں سب سے آگے ہیں — مون سون کے بدلتے ہوئے انداز، غیر متوقع گرمی کی لہریں، اور ایک ہی سال میں سیلاب اور خشک سالی دونوں نے روایتی بوائی کے کیلنڈر کو غیر معتبر بنا دیا ہے۔\n\nپرانے بوائی کیلنڈر پر انحصار کرنے کے بجائے حقیقی وقت کے موسمی الرٹس (موسم کا صفحہ دیکھیں) پر نظر رکھیں — بوائی کی تاریخ میں ایک ہفتے کا فرق اب مکمل فصل اور ناکام فصل کے درمیان فرق پیدا کر سکتا ہے۔ جہاں سیلاب یا خشک سالی عام ہو گئی ہے وہاں اپنے مقامی زرعی توسیعی دفتر کی تجویز کردہ خشک سالی برداشت کرنے والی گندم اور کپاس کی اقسام اپنائیں۔\n\nمٹی کی صحت پہلے سے کہیں زیادہ اہم ہے: فصل کی باقیات کو جلانے کے بجائے کھاد بنانا (ری سائیکلنگ کا صفحہ دیکھیں) مٹی میں نمی برقرار رکھتا ہے اور کھاد کے اخراجات کم کرتا ہے۔ لیزر لینڈ لیولنگ اور ڈرپ ایریگیشن کے ساتھ مل کر یہ تبدیلیاں موسمیاتی نقصان کا بڑا حصہ پورا کر سکتی ہیں۔\n\nآخر میں، تنوع اپنائیں — دو یا تین فصلیں اگانے والا کھیت ایک ہی فصل پر انحصار کرنے والے کھیت کے مقابلے میں خراب موسم سے کہیں بہتر طور پر سنبھل جاتا ہے۔`,
        `پاڪستان جا هاري موسمياتي تبديلي جي اڳيان آهن — مانسون جي بدلجندڙ نموني، اڻڄاتل گرمي، ۽ هڪ ئي سال ۾ ٻوڏ ۽ خشڪ سالي ٻنهي، پراڻي پوکي جي ڪئلينڊر کي ناقابل اعتبار بڻائي ڇڏيو آهي.\n\nپراڻي پوکي واري ڪئلينڊر تي ڀاڙڻ بدران حقيقي وقت جي موسمي خبردارين (موسم واري صفحي کي ڏسو) تي نظر رکو — پوکي جي تاريخ ۾ هڪ هفتي جو فرق هاڻي مڪمل فصل ۽ ناڪام فصل جي وچ ۾ فرق پيدا ڪري سگهي ٿو. جتي ٻوڏ يا خشڪ سالي عام ٿي وئي آهي اتي پنهنجي مقامي زرعي آفيس جي تجويز ڪيل خشڪ سالي برداشت ڪندڙ ڪڻڪ ۽ ڪپاهه جون قسمون استعمال ڪريو.\n\nمٽي جي صحت اڳ کان وڌيڪ اهم آهي: فصل جي بچيل حصن کي ساڙڻ بدران ڀاڻ ٺاهڻ (ري سائيڪلنگ واري صفحي کي ڏسو) مٽي ۾ نمي برقرار رکي ٿو ۽ ڀاڻ جو خرچ گهٽائي ٿو. ليزر ليولنگ ۽ ڊرپ آبپاشي سان گڏجي اهي تبديليون موسمياتي نقصان جو وڏو حصو پورو ڪري سگهن ٿيون.\n\nآخر ۾، مختلف فصلون پوکيو — ٻه يا ٽي فصلون پوکيندڙ ٻني هڪ ئي فصل تي ڀاڙيندڙ ٻني جي ڀيٽ ۾ خراب موسم مان تمام سٺي نموني سنڀري ٿي.`
      ),
    },
    {
      title: t('Maximizing Wheat Yield in 2025', '2025 میں گندم کی پیداوار کو زیادہ سے زیادہ کرنا', '2025 ۾ ڪڻڪ جي پيداوار کي وڌ کان وڌ ڪرڻ'),
      excerpt: t('Best practices for wheat cultivation this season', 'اس موسم میں گندم کی کاشت کے بہترین طریقے', 'هن موسم ۾ ڪڻڪ جي پوک جا بهترين طريقا'),
      author: 'Fatima Khan',
      date: 'Oct 28, 2025',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1664729570424-069f0c0d5ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzYyMTQ5MDYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: t(
        `Wheat remains Pakistan's most important staple, and small changes in technique can add up to a significant yield increase this season.\n\nSow between November 1st and November 20th — the "Kor" (first) irrigation 22-25 days after sowing is the single most critical watering of the whole cycle, so don't delay it. Treat seed with fungicide before drilling, and use around 50kg of seed per acre at a depth of 2-3 inches for even germination.\n\nApply 2 bags of DAP per acre at sowing time, then split your urea across the tillering (around day 45) and booting (around day 85) stages rather than dumping it all at once — this alone can noticeably raise grain weight. Watch soil moisture closely during the grain-filling stage around day 110.\n\nHarvest once grain moisture drops below 12%, typically April-May — harvesting too early or too late both cost you yield. Use the AI Crop Advisory page any time for a schedule tailored to your specific location.`,
        `گندم اب بھی پاکستان کی سب سے اہم اجناس ہے، اور تکنیک میں چھوٹی تبدیلیاں اس موسم میں پیداوار میں نمایاں اضافہ کر سکتی ہیں۔\n\nیکم نومبر سے 20 نومبر کے درمیان بوائی کریں — بوائی کے 22 سے 25 دن بعد 'کور' (پہلا) پانی پورے چکر کا سب سے اہم پانی ہے، اسے تاخیر سے نہ دیں۔ ڈرل کرنے سے پہلے بیج کو پھپھوندی کش دوا سے علاج کریں، اور یکساں اگاؤ کے لیے فی ایکڑ تقریباً 50 کلو بیج 2-3 انچ کی گہرائی پر استعمال کریں۔\n\nبوائی کے وقت فی ایکڑ ڈی اے پی کے 2 تھیلے استعمال کریں، پھر یوریا کو ایک ساتھ ڈالنے کے بجائے ٹلرنگ (تقریباً 45 دن) اور بوٹنگ (تقریباً 85 دن) کے مراحل میں تقسیم کریں — یہ اکیلے دانے کے وزن میں نمایاں اضافہ کر سکتا ہے۔ تقریباً 110 دن پر دانہ بھرنے کے مرحلے کے دوران مٹی کی نمی پر گہری نظر رکھیں۔\n\nجب دانے کی نمی 12 فیصد سے کم ہو جائے تو کٹائی کریں، عام طور پر اپریل-مئی — بہت جلدی یا بہت دیر سے کٹائی دونوں پیداوار میں نقصان کا باعث بنتی ہیں۔ اپنے مخصوص مقام کے مطابق شیڈول کے لیے کسی بھی وقت AI فصل مشورہ کا صفحہ استعمال کریں۔`,
        `ڪڻڪ اڃا تائين پاڪستان جو سڀ کان اهم اَنُّ آهي، ۽ طريقي ۾ ننڍيون تبديليون هن موسم ۾ پيداوار ۾ خاص اضافو ڪري سگهن ٿيون.\n\n1 نومبر کان 20 نومبر جي وچ ۾ پوکيو — پوکي جي 22 کان 25 ڏينهن بعد 'ڪور' (پهريون) پاڻي سڄي چڪر جو سڀ کان اهم پاڻي آهي، ان ۾ دير نه ڪريو. ڊرل ڪرڻ کان اڳ ٻج کي ڦڦوند ڪش دوا سان علاج ڪريو، ۽ هڪجهڙي اُڀار لاءِ في ايڪڙ تقريبن 50 ڪلو ٻج 2-3 انچ جي کوهه تي استعمال ڪريو.\n\nپوکي وقت في ايڪڙ ڊي اي پي جا 2 ٿيلها استعمال ڪريو، پوءِ يوريا کي هڪ ئي دفعي وجهڻ بدران ٽلرنگ (تقريبن 45 ڏينهن) ۽ بوٽنگ (تقريبن 85 ڏينهن) مرحلن ۾ ورهايو — اهو اڪيلو داڻي جي وزن ۾ خاص اضافو ڪري سگهي ٿو. تقريبن 110 ڏينهن تي داڻي ڀرڻ واري مرحلي دوران مٽي جي نمي تي ويجهي نظر رکو.\n\nجڏهن داڻي جي نمي 12 سيڪڙو کان گهٽ ٿي وڃي تڏهن لڻو، عام طور تي اپريل-مئي — تمام جلدي يا تمام دير سان لڻڻ ٻئي پيداوار ۾ نقصان جو سبب بڻجن ٿا. پنهنجي مخصوص هنڌ مطابق شيڊول لاءِ ڪنهن به وقت AI فصل صلاح واري صفحي کي استعمال ڪريو.`
      ),
    },
    {
      title: t('Turning Waste into Profit', 'فضلہ کو منافع میں تبدیل کرنا', 'فضول کي فائدي ۾ تبديل ڪرڻ'),
      excerpt: t('How recycling damaged crops can earn you money', 'تباہ شدہ فصلوں کی ری سائیکلنگ سے پیسے کیسے کمائیں', 'تباھ ٿيل فصلن جي ري سائيڪلنگ مان پئسا ڪيئن ڪمائجن'),
      author: 'Ahmed Raza',
      date: 'Oct 25, 2025',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1752741177226-d4d595d8c517?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBjb21wb3N0fGVufDF8fHx8MTc2MjE0OTA2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      content: t(
        `Every season, huge amounts of wheat straw, cotton stalks, rice husk, and sugarcane bagasse get burned in the field — not just wasted value, but a major source of air pollution and smog across Punjab and Sindh.\n\nMost crop residue has real resale value: wheat straw and rice husk compost into organic fertilizer worth 500-750 PKR per bag, cotton stalks and bagasse can be sold as animal feed supplement, and larger quantities of bagasse are bought by paper mills. None of this requires new equipment — just collection, basic drying or chopping, and a buyer.\n\nThe fastest way to find out what your specific residue is worth is the Waste Recycling page here in AgriResilient: upload a photo and it identifies the item, gives you a realistic PKR price range, and suggests real nearby mandis, compost plants, or feed buyers based on your profile location.\n\nEven a small farm turning residue into compost instead of burning it saves on fertilizer costs the very next season — the return isn't just cash, it's better soil for years afterward.`,
        `ہر موسم میں گندم کا بھوسا، کپاس کے ڈنٹھل، چاول کی بھوسی اور گنے کا چھلکا کھیت میں جلا دیا جاتا ہے — یہ نہ صرف قیمت کا ضیاع ہے بلکہ پنجاب اور سندھ میں فضائی آلودگی اور سموگ کا ایک بڑا ذریعہ بھی ہے۔\n\nزیادہ تر فصل کی باقیات کی حقیقی دوبارہ فروخت کی قیمت ہوتی ہے: گندم کا بھوسا اور چاول کی بھوسی کھاد بن کر 500-750 روپے فی بیگ کی مالیت رکھتے ہیں، کپاس کے ڈنٹھل اور گنے کا چھلکا جانوروں کی خوراک کے طور پر فروخت ہو سکتے ہیں، اور بڑی مقدار میں چھلکا کاغذ کی ملوں کو فروخت ہوتا ہے۔ اس کے لیے نئے آلات کی ضرورت نہیں — صرف جمع کرنا، بنیادی خشک کرنا یا کاٹنا، اور ایک خریدار۔\n\nیہ جاننے کا تیز ترین طریقہ کہ آپ کی مخصوص باقیات کی قیمت کیا ہے، یہاں AgriResilient کا ویسٹ ری سائیکلنگ صفحہ ہے: ایک تصویر اپ لوڈ کریں اور یہ چیز کی شناخت کرتا ہے، آپ کو حقیقت پسندانہ روپے کی قیمت کی حد دیتا ہے، اور آپ کے پروفائل کے مقام کی بنیاد پر قریبی منڈیوں، کھاد پلانٹس، یا خوراک خریداروں کی تجویز دیتا ہے۔\n\nایک چھوٹا کھیت بھی باقیات کو جلانے کے بجائے کھاد میں تبدیل کر کے اگلے ہی موسم میں کھاد کے اخراجات بچاتا ہے — فائدہ صرف نقدی نہیں، بلکہ آنے والے سالوں کے لیے بہتر مٹی بھی ہے۔`,
        `هر موسم ۾ ڪڻڪ جو ڀوسو، ڪپاهه جا ٻوٽا، چانورن جي ڀونڊ ۽ گنيء جي کاڻي کيت ۾ ساڙي ڇڏجي ٿي — هي نه صرف قيمت جو نقصان آهي پر پنجاب ۽ سنڌ ۾ هوا جي آلودگي ۽ دونهين جو هڪ وڏو سبب پڻ آهي.\n\nاڪثر فصل جي بچيل شين جي حقيقي وڪري جي قيمت هوندي آهي: ڪڻڪ جو ڀوسو ۽ چانورن جي ڀونڊ ڀاڻ بڻجي 500-750 رپيا في ٻوري جي قيمت رکن ٿا، ڪپاهه جا ٻوٽا ۽ گنيء جي کاڻي جانورن جي خوراڪ طور وڪامي سگهن ٿا، ۽ وڏي مقدار ۾ کاڻي ڪاڱي جي ملن کي وڪامي ٿي. ان لاءِ نئين سامان جي ضرورت ناهي — رڳو گڏ ڪرڻ، خشڪ ڪرڻ يا ڪٽڻ، ۽ هڪ خريدار.\n\nھي ڄاڻڻ جو تڪڙو طريقو ته توهان جي مخصوص بچيل شين جي قيمت ڇا آهي، هتي AgriResilient جو ويسٽ ري سائيڪلنگ صفحو آهي: هڪ تصوير اپ لوڊ ڪريو ۽ اهو شئي جي سڃاڻپ ڪري ٿو، توهان کي حقيقي پي ڪي آر قيمت جي حد ڏئي ٿو، ۽ توهان جي پروفائل جي هنڌ جي بنياد تي قريبي منڊين، ڀاڻ پلانٽس، يا خوراڪ خريدارن جي صلاح ڏئي ٿو.\n\nھڪ ننڍي ٻني به بچيل شين کي ساڙڻ بدران ڀاڻ ۾ تبديل ڪري ايندڙ موسم ۾ ڀاڻ جو خرچ بچائي ٿي — فائدو رڳو نقد نه، پر ايندڙ سالن لاءِ بھتر مٽي پڻ آهي.`
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-12 text-center"
        >
          {t('Resources & Blog', 'وسائل اور بلاگ', 'وسيلا ۽ بلاگ')}
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
              }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <Card
                onClick={() => setSelectedArticle(article)}
                className="bg-white shadow-xl hover:shadow-2xl overflow-hidden h-full cursor-pointer transition-all duration-300 transform-gpu"
              >
                <div className="h-48 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-gray-800 mb-3 font-bold">{article.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-green-600 font-medium"
                    whileHover={{ x: 10 }}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{t('Read More', 'مزید پڑھیں', 'وڌيڪ پڙهو')}</span>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <div className="h-56 -mx-6 -mt-6 mb-2 overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{selectedArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedArticle.readTime}</span>
                    </div>
                    <span>{selectedArticle.date}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                {selectedArticle.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


