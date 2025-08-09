import React from 'react';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Size Guide', href: '#' },
        { label: 'Returns', href: '#' },
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Shipping Info', href: '#' },
        { label: 'Track Order', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Sri Valli Creations</span>
            </div>
            <p className="text-gray-400 text-sm leading-6">
              Discover the latest trends in women's fashion. Quality, style, and elegance in every piece.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Follow us for the latest updates and exclusive offers!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Sri Valli Creations. All rights reserved. Made with ❤️ for fashion lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;