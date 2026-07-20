import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      text: t(
        "Hello! I'm AgriBot. How can I help you today?",
        "ہیلو! میں AgriBot ہوں۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟",
        "هيلو! مان AgriBot آهيان۔ اڄ توهان جي ڪيئن مدد ڪري سگهان ٿو؟"
      ),
      isUser: false,
    },
  ]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const newUserMessage = { text: message, isUser: true };
    const historyForRequest = [...messages, newUserMessage];
    setMessages(historyForRequest);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newUserMessage.text,
          language,
          history: historyForRequest,
        }),
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          text: data.success
            ? data.reply
            : t('Sorry, something went wrong. Please try again.', 'معذرت، کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔', 'معاف ڪجو، ڪجهه غلط ٿي ويو. مهرباني ڪري ٻيهر ڪوشش ڪريو.'),
          isUser: false,
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          text: t('Failed to connect to server. Please try again.', 'سرور سے منسلک ہونے میں ناکام۔ دوبارہ کوشش کریں۔', 'سرور سان ڳنڍڻ ۾ ناڪام. ٻيهر ڪوشش ڪريو.'),
          isUser: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-gradient-to-br from-green-500 to-green-700 text-white p-3 sm:p-4 rounded-full shadow-2xl"
        whileHover={{
          scale: 1.1,
          rotate: 360,
          boxShadow: '0 20px 40px rgba(34, 197, 94, 0.4)',
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 bottom-20 sm:bottom-28 w-[calc(100%-2rem)] max-w-96 h-[70vh] max-h-[520px] sm:h-[500px] sm:max-h-none z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px) rotateY(-5deg)',
            }}
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-4 sm:p-5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="p-1 bg-white/20 rounded-full"
                  >
                    <MessageCircle size={20} />
                  </motion.div>
                  <h3 className="font-bold">AgriBot</h3>
                </div>
                <p className="text-xs text-green-100">{t('Online | Powered by AI', 'آن لائن | AI کے ذریعے چلنے والا', 'آن لائين | AI ذريعي هلندڙ')}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.isUser
                        ? 'bg-green-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-none text-sm shadow-sm bg-white text-gray-400 flex gap-1">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>•</motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>•</motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>•</motion.span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                  placeholder={t('Type your question...', 'اپنا سوال ٹائپ کریں...', 'پنهنجو سوال ٽائيپ ڪريو...')}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-2 bg-green-600 text-white rounded-full shadow-lg disabled:opacity-60"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


