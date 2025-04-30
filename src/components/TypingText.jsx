import React, { useState, useEffect } from 'react';
import style from '../style/TypingText.module.css';

const TypingText = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <p className={style.typingText}>
      {displayedText}
      <span className={style.cursor}>|</span>
    </p>
  );
};

export default TypingText;