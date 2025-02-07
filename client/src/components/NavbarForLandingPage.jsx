import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaBars, 
  FaTimes, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin 
} from 'react-icons/fa';

const Navbar = ({ smoothScroll, featuresRef, securityRef, aboutRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', onClick: scrollToTop },
    { label: 'Features', ref: featuresRef },
    { label: 'Security', ref: securityRef },
    { label: 'About Us', ref: aboutRef }
  ];

  const socialLinks = [
    { icon: FaGithub, href: '#' },
    { icon: FaTwitter, href: '#' },
    { icon: FaLinkedin, href: '#' }
  ];

  const menuVariants = {
    closed: { 
      opacity: 0,
      x: '100%',
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <FaShieldAlt className="text-blue-500 text-2xl" />
          <h1 className="text-2xl font-bold text-white font-spaceGrotesk">DataRakshak</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="space-x-6">
            {navItems.map((item, index) => (
              <motion.button 
                key={index}
                onClick={item.onClick || (() => smoothScroll(item.ref))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 pl-6 border-l border-gray-700">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <link.icon className="text-xl" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="text-white"
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 right-0 left-0 bg-black/90 backdrop-blur-lg md:hidden"
            >
              <div className="container mx-auto px-6 py-8">
                {/* Mobile Navigation Links */}
                <div className="space-y-6 mb-8">
                  {navItems.map((item, index) => (
                    <motion.button 
                      key={index}
                      onClick={item.onClick || (() => {
                        smoothScroll(item.ref);
                        setIsMenuOpen(false);
                      })}
                      whileTap={{ scale: 0.95 }}
                      className="block w-full text-left text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Social Links */}
                <div className="flex justify-center space-x-6">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <link.icon className="text-2xl" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;