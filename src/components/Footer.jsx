import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const socialIcons = [
    { Icon: Facebook, href: '#', color: '#1877F2' },
    { Icon: Twitter, href: '#', color: '#1DA1F2' },
    { Icon: Instagram, href: '#', color: '#E4405F' },
    { Icon: Linkedin, href: '#', color: '#0A66C2' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-green-900 via-green-950 to-black text-white py-16 mt-20 relative overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            🌾
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5, z: 30 }}
            className="space-y-4"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h3 className="text-green-300 text-xl">
              {t('About AgriResilient', 'AgriResilient کے بارے میں', 'AgriResilient بابت')}
            </h3>
            <p className="text-green-200/80 leading-relaxed">
              {t(
                'Empowering Pakistani farmers with AI-driven climate solutions for sustainable agriculture.',
                'پاکستانی کسانوں کو AI سے چلنے والے موسمیاتی حل کے ساتھ بااختیار بنانا',
                'پاڪستاني هارين کي AI سان هلندڙ موسمياتي حلن سان بااختيار بڻائڻ'
              )}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5, z: 30 }}
            className="space-y-4"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h3 className="text-green-300 text-xl">{t('Quick Links', 'فوری لنکس', 'تيز لنڪس')}</h3>
            <ul className="space-y-2">
              {['Home', 'Dashboard', 'Resources', 'About Us'].map((link, index) => (
                <motion.li
                  key={link}
                  whileHover={{ x: 10, color: '#86efac' }}
                  className="cursor-pointer text-green-200/80"
                >
                  {link}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-green-300 text-xl">{t('Contact Us', 'ہم سے رابطہ کریں', 'اسان سان رابطو ڪريو')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-green-200/80">
                <Mail className="w-5 h-5" />
                <span>info@agriresilient.pk</span>
              </div>
              <div className="flex items-center gap-3 text-green-200/80">
                <Phone className="w-5 h-5" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-green-200/80">
                <MapPin className="w-5 h-5" />
                <span>{t('Islamabad, Pakistan', 'اسلام آباد، پاکستان', 'اسلام آباد، پاڪستان')}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-green-300 text-xl">{t('Follow Us', 'ہماری پیروی کریں', 'اسان جي پيروي ڪريو')}</h3>
            <div className="flex gap-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  style={{ color: social.color }}
                >
                  <social.Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-green-800/50 mt-12 pt-8 text-center text-green-200/60">
          <p>© 2026 AgriResilient. {t('All rights reserved.', 'جملہ حقوق محفوظ ہیں۔', 'سڀ حق محفوظ آهن.')}</p>
        </div>
      </div>
    </motion.footer>
  );
};


