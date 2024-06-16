import { motion } from 'framer-motion';
import React from 'react';

const AnimationDiv = ({
  children,
  style
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8
      }}>
      {children}
    </motion.div>
  );
};

export default AnimationDiv;
