import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';

export const ContactPage = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-800 mb-8 text-center"
        >
          {t('Contact Us', 'ہم سے رابطہ کریں')}
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Card className="p-8 bg-white shadow-2xl h-full">
              <h2 className="text-gray-800 mb-6">{t('Get In Touch', 'رابطے میں رہیں')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>{t('Name', 'نام')}</Label>
                  <Input className="mt-2 py-6" placeholder={t('Your name', 'آپ کا نام')} required />
                </div>
                <div>
                  <Label>{t('Email', 'ای میل')}</Label>
                  <Input type="email" className="mt-2 py-6" placeholder={t('Your email', 'آپ کا ای میل')} required />
                </div>
                <div>
                  <Label>{t('Message', 'پیغام')}</Label>
                  <Textarea className="mt-2" rows={5} placeholder={t('Your message...', 'آپ کا پیغام...')} required />
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
                        {t('Send Message', 'پیغام بھیجیں')}
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
              { icon: Mail, title: t('Email', 'ای میل'), value: 'info@agriresilient.pk' },
              { icon: Phone, title: t('Phone', 'فون'), value: '+92 300 1234567' },
              { icon: MapPin, title: t('Address', 'پتہ'), value: t('Islamabad, Pakistan', 'اسلام آباد، پاکستان') },
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


