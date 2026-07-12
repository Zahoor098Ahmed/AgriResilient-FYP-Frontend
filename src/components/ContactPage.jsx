import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const ContactPage = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(t('Message sent! We\'ll get back to you soon.', 'پیغام بھیج دیا گیا! ہم جلد آپ سے رابطہ کریں گے۔', 'پيغام موڪليو ويو! اسان جلد توهان سان رابطو ڪنداسين.'));
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(data.message || t('Failed to send message. Please try again.', 'پیغام بھیجنے میں ناکام۔ دوبارہ کوشش کریں۔', 'پيغام موڪلڻ ۾ ناڪام. ٻيهر ڪوشش ڪريو.'));
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error(t('Failed to connect to server. Please try again.', 'سرور سے منسلک ہونے میں ناکام۔ دوبارہ کوشش کریں۔', 'سرور سان ڳنڍڻ ۾ ناڪام. ٻيهر ڪوشش ڪريو.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('Contact Us', 'ہم سے رابطہ کریں', 'اسان سان رابطو ڪريو')}
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Card className="p-8 bg-white shadow-2xl h-full">
              <h2 className="text-gray-800 mb-6">{t('Get In Touch', 'رابطے میں رہیں', 'رابطي ۾ رهو')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>{t('Name', 'نام', 'نالو')}</Label>
                  <Input
                    className="mt-2 py-6"
                    placeholder={t('Your name', 'آپ کا نام', 'توهان جو نالو')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t('Email', 'ای میل', 'اي ميل')}</Label>
                  <Input
                    type="email"
                    className="mt-2 py-6"
                    placeholder={t('Your email', 'آپ کا ای میل', 'توهان جي اي ميل')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t('Message', 'پیغام', 'پيغام')}</Label>
                  <Textarea
                    className="mt-2"
                    rows={5}
                    placeholder={t('Your message...', 'آپ کا پیغام...', 'توهان جو پيغام...')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-4 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 inline" />
                        {t('Send Message', 'پیغام بھیجیں', 'پيغام موڪليو')}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            {[
              { icon: Mail, title: t('Email', 'ای میل', 'اي ميل'), value: 'info@agriresilient.pk' },
              { icon: Phone, title: t('Phone', 'فون', 'فون'), value: '+92 300 1234567' },
              { icon: MapPin, title: t('Address', 'پتہ', 'پتو'), value: t('Islamabad, Pakistan', 'اسلام آباد، پاکستان', 'اسلام آباد، پاڪستان') },
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, x: 10 }}
              >
                <Card className="p-6 bg-white shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-full">
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-bold">{contact.title}</h3>
                      <p className="text-gray-600">{contact.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};


