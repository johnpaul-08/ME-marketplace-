import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <motion.div 
      className="splash-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="splash-content">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100 
          }}
        >
          <Logo className="splash-logo" isSplash={true} />
        </motion.div>
        
        <motion.div 
          className="splash-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p>EST. 2020</p>
          <h2>Empowering Communities</h2>
        </motion.div>
        
        <div className="splash-loader">
          <motion.div 
            className="loader-bar"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
