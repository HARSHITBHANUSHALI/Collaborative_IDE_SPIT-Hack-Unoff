import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/NavbarForLandingPage'
import { 
  FaShieldAlt, 
  FaLock, 
  FaServer, 
  FaFile, 
  FaChartLine, 
  FaUserShield, 
  FaLanguage, 
  FaShareAlt,
  FaRobot,
  FaGavel,
  FaEye,
  FaCloudUploadAlt,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import { 
  HiCode, 
  HiDatabase, 
  HiTemplate 
} from 'react-icons/hi';
import { MdPrivacyTip, MdVerifiedUser } from 'react-icons/md';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const scrollRef = useRef(null);
  const featuresRef = useRef(null);
  const securityRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);
  const footerRef = useRef(null);

  // Smooth scrolling function
  const smoothScroll = (elementRef) => {
    elementRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Gemini-like Background Shapes
  const GeminiBackground = () => {
    const generateFluidShapes = () => {
      return Array(6).fill().map((_, index) => ({
        id: index,
        size: Math.random() * 200 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        blur: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        color: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 4)]
      }));
    };

    const [shapes, setShapes] = useState(generateFluidShapes());

    useEffect(() => {
      const animateShapes = () => {
        setShapes(generateFluidShapes());
      };

      const interval = setInterval(animateShapes, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ 
              scale: 0, 
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, shape.opacity, 0],
              rotate: [0, shape.rotation, shape.rotation * 1.5],
              x: [`${shape.x}%`, `${shape.x + 10}%`, `${shape.x - 10}%`],
              y: [`${shape.y}%`, `${shape.y + 15}%`, `${shape.y - 15}%`]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${shape.color}40, transparent 70%)`,
              filter: `blur(${shape.blur}px)`,
              top: `${shape.y}%`,
              left: `${shape.x}%`
            }}
          />
        ))}
      </div>
    );
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pageVariants = {
    closed: {
      rotateY: 90,
      opacity: 0,
      transition: { duration: 0.5 }
    },
    open: {
      rotateY: 0,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const contentVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <FaRobot className="text-blue-400" />,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms identify and redact sensitive information with unprecedented accuracy."
    },
    {
      icon: <FaFile className="text-green-400" />,
      title: "Multi-Format Support",
      description: "Comprehensive PII detection across PDFs, images, documents, and various file types."
    },
    {
      icon: <MdPrivacyTip className="text-purple-400" />,
      title: "Adaptive Redaction",
      description: "Intelligent redaction with configurable sensitivity levels and custom privacy rules."
    },
    {
      icon: <FaChartLine className="text-indigo-400" />,
      title: "Comprehensive Analytics",
      description: "Detailed insights into data processing, redaction activities, and privacy compliance."
    },
    {
      icon: <FaLanguage className="text-teal-400" />,
      title: "Multilingual Support",
      description: "Detect and protect PII across multiple languages with advanced linguistic processing."
    },
    {
      icon: <MdVerifiedUser className="text-orange-400" />,
      title: "Regulatory Compliance",
      description: "Built-in compliance with GDPR, CCPA, HIPAA, and global data protection standards."
    }
  ];

  const securityFeatures = [
    {
      icon: <FaLock className="text-red-400" />,
      title: "End-to-End Encryption",
      description: "Military-grade encryption protects your sensitive data throughout the entire process."
    },
    {
      icon: <FaShieldAlt className="text-yellow-400" />,
      title: "Legal Compliance Framework",
      description: "Automated compliance tracking and comprehensive audit trails for legal protection."
    },
    {
      icon: <FaEye className="text-cyan-400" />,
      title: "Intelligent Monitoring",
      description: "Continuous scanning and real-time alerts for potential PII exposure risks."
    },
    {
      icon: <FaCloudUploadAlt className="text-sky-400" />,
      title: "Secure Cloud Processing",
      description: "Zero-knowledge architecture ensures maximum privacy during data processing."
    }
  ];

  return (
    <div ref={scrollRef} id="top" className="bg-gray-950 text-white min-h-screen">
      {/* Navigation */}
       <Navbar 
        smoothScroll={smoothScroll}
        featuresRef={featuresRef}
        securityRef={securityRef}
        aboutRef={footerRef}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 bg-gray-950 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0.5, 1], 
              rotate: 360,
              scale: [0.8, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              scale: { duration: 2, ease: "easeOut" }
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Grid Pattern 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: [0, 0.5, 1, 0.5], 
              rotate: -360,
              scale: [1.2, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear",
              scale: { duration: 2, ease: "easeOut" }
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(147,51,234,0.1) 1px, transparent 1px),
                linear-gradient(-45deg, rgba(147,51,234,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Moving Beams */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              background: [
                'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.2) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute inset-0"
          />
        </div>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gray-950/50" />

        {/* Main Content */}
        <div className="container mx-auto text-center z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Central unlock button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.8
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8 bg-gray-900/50 backdrop-blur-md text-gray-300 px-6 py-3 rounded-full 
                flex items-center space-x-2 mx-auto hover:bg-gray-800/50 transition-all duration-300"
            >
              <FaShieldAlt className="text-blue-400" />
                <span>DataRakshak by SafeGuardians</span>
              <FaChevronRight className="text-gray-400" />
            </motion.button>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-7xl font-semibold mb-4 font-spaceGrotesk leading-tight"
            >
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text"
              >
                One-click PII
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
              >
                Redaction
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-xl text-gray-400 mb-12 font-outfit max-w-2xl mx-auto"
            >
              Safeguard your data with our advanced AI-powered PII redaction system
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="flex justify-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 rounded-full font-outfit 
                  hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                <a href="http://172.21.5.">Get Started</a>
              </motion.button>
              <Link to="/redact-pdf">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-700 bg-black/50 backdrop-blur-sm px-8 py-3 rounded-full font-outfit 
                    hover:bg-gray-900 transition-all duration-300 text-gray-300"
                >
                  Try Now
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-8 flex items-center space-x-2 text-gray-400"
        >
          <FaChevronDown className="animate-bounce" />
          <span className="text-sm">Scroll down</span>
        </motion.div>

        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ 
              delay: 0.5,
              duration: 1.5,
              ease: "easeOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ 
              delay: 0.7,
              duration: 1.5,
              ease: "easeOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-white font-spaceGrotesk"
          >
            Advanced Features
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 
                  hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white font-outfit">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-inter">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Features Section */}
      <section ref={securityRef} className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-white font-spaceGrotesk"
          >
            Enhanced Security Measures
          </motion.h2>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 
                  hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white font-outfit">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 font-inter">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold mb-6 text-white font-spaceGrotesk"
            >
              Ready to Protect Your Data?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-400 mb-8 font-outfit"
            >
              Start securing your sensitive information with our advanced AI-powered redaction system
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              <Link to="/redact-pdf">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 rounded-full font-outfit 
                    hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
                >
                  Try It Now               
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const footer = document.querySelector('#about-section');
                  footer?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-gray-700 bg-black/50 backdrop-blur-sm px-8 py-3 rounded-full font-outfit 
                  hover:bg-gray-900 transition-all duration-300 text-gray-300"
              >
                About Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer ref={footerRef} id="about-section" className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6">
          {/* Top Section with Logo and Description */}
          <div className="py-12 text-center border-b border-gray-800">
            <h2 className="text-3xl font-bold text-white font-spaceGrotesk mb-4">SafeGuardians</h2>
            <p className="max-w-2xl mx-auto text-gray-400 font-inter">
              Protecting your digital assets with advanced AI-powered PII redaction solutions.
            </p>
          </div>

          {/* Main Grid Section */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-outfit">About</h3>
              <p className="text-sm text-gray-400">
                A project developed at Sardar Patel Institute of Technology, focused on securing sensitive information through innovative AI solutions.
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="hover:text-blue-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-outfit">Our Team</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-400 hover:text-white transition-colors">Nikhil Chaudhari</p>
                  <p className="text-gray-400 hover:text-white transition-colors">Naufil Asar</p>
                  <p className="text-gray-400 hover:text-white transition-colors">Pulkit Dwivedi</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 hover:text-white transition-colors">Rohan Pawar</p>
                  <p className="text-gray-400 hover:text-white transition-colors">Madhura Kanfade</p>
                  <p className="text-gray-400 hover:text-white transition-colors">Harshit Bhanushali</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-outfit">Institution</h3>
              <div className="space-y-2">
                <p className="font-semibold text-white">Sardar Patel Institute of Technology</p>
                <p className="text-sm">Munshi Nagar, Andheri (West)</p>
                <p className="text-sm">Mumbai - 400058</p>
                <p className="text-sm">Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-gray-950">
          <div className="container mx-auto px-6 py-4">
            <div className="text-sm text-center text-gray-400">
              © {new Date().getFullYear()} SafeGuardians. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;