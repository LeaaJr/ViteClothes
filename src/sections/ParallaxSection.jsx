import React, { useRef, useEffect, useState } from 'react';
import styles from '../style/SlidingParallax.module.css';

const ParallaxSection = () => {
  const containerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRef = useRef(null);

  const slides = [
    {
      id: 1,
      media: "video",
      source: "https://static.zara.net/assets/public/4397/9518/7a0040f69000/9761a71595c1/M9230826688-ult/3600000000000.m4s",
      poster: "https://via.placeholder.com/1920x1080"
    },
    {
      id: 2,
      media: "image",
      source: "https://image.hm.com/content/dam/global_campaigns/season_01/men/start-page-assets/w14/edits/MS21E5-Edits-16x9-w14.jpg"
    },
    {
      id: 3,
      media: "image",
      source: "https://image.hm.com/content/dam/global_campaigns/season_01/men/ms21e5/scroll/MS21E5-linen-days-CPD-top-16x9.jpg"
    }
  ];

  // Efecto para el scroll snapping preciso (o eso espero )
  useEffect(() => {
    const container = containerRef.current;
    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);

      const scrollPosition = container.scrollTop;
      const slideHeight = container.clientHeight;
      const newActiveSlide = Math.round(scrollPosition / slideHeight);
      
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
        
        // Scroll mas suave al slide activo porque el que tenia andaba horrible
        container.scrollTo({
          top: newActiveSlide * slideHeight,
          behavior: 'smooth'
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSlide]);

  // Control de reproducción de video
  useEffect(() => {
    if (activeSlide === 0 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [activeSlide]);

  return (
    <section 
      ref={containerRef}
      className={`${styles.parallaxSection} ${styles.mandatoryScrollSnapping}`}
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === activeSlide ? styles.active : ''}`}
        >
          {slide.media === "video" ? (
            <video
              ref={videoRef}
              src={slide.source}
              poster={slide.poster}
              className={styles.media}
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={slide.source}
              alt={`Slide ${slide.id}`}
              className={styles.media}
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default ParallaxSection;