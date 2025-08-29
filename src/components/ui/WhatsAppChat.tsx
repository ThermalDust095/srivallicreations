import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface WhatsAppChatProps {
  className?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();

  // WhatsApp business number - replace with actual number
  const whatsappNumber = '+919876543210';

  const getDefaultMessage = () => {
    const currentPage = location.pathname;
    const baseMessage = 'Hi! I need help with ';
    
    if (currentPage.includes('/product/')) {
      return baseMessage + 'this product. Can you provide more details?';
    } else if (currentPage.includes('/cart')) {
      return baseMessage + 'my cart. I have some questions about my order.';
    } else if (currentPage.includes('/orders')) {
      return baseMessage + 'my order. Can you help me track it?';
    }
    
    return baseMessage + 'Sri Valli Creations. Can you assist me?';
  };

  const sendWhatsAppMessage = () => {
    const messageToSend = message || getDefaultMessage();
    const encodedMessage = encodeURIComponent(messageToSend);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* Chat Widget */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {isOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-w-[calc(100vw-3rem)]">
            {/* Header */}
            <div className="bg-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat with us</h3>
                  <p className="text-xs text-green-100">We're here to help!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                  👋 Hi there! How can we help you today?
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={getDefaultMessage()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />

                <button
                  onClick={sendWhatsAppMessage}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                You'll be redirected to WhatsApp
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-110"
            title="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
};

export default WhatsAppChat;