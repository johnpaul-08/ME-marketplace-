import React from 'react';
import '../styles/Skeleton.css';

const Skeleton = ({ type = 'text', width = '100%', height, style = {}, className = '' }) => {
  const classes = `skeleton skeleton-${type} ${className}`;
  
  const baseStyle = {
    width,
    height: height || (type === 'text' ? '1rem' : 'auto'),
    ...style
  };

  return <div className={classes} style={baseStyle}></div>;
};

export default Skeleton;
