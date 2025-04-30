import React, { useState, useEffect } from "react";
import style from '../style/Header.module.css';
import TypingText from "./TypingText";

const Header = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [transitionStage, setTransitionStage] = useState('visible');
  
  const images = [
    "https://static.zara.net/assets/public/4c91/c3ec/60014c4f94ce/8256786e234c/03046412044-e1/03046412044-e1.jpg?ts=1742224743694&w=750",
    "https://static.zara.net/assets/public/17c3/28bd/888e4ac282d3/91e1498dbf5b/05070308800-e1/05070308800-e1.jpg?ts=1742297115203&w=750",
    "https://static.zara.net/assets/public/e4ef/04d0/dd2e4b4b9b26/11cee2db8d18/06318401251-e1/06318401251-e1.jpg?ts=1735549646894&w=750",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Primero ocultamos la imagen actual
      setTransitionStage('hiding');
      
      // Después de la animación de ocultar, cambiamos la imagen
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setTransitionStage('showing');
        
        // Finalmente mostramos la nueva imagen
        setTimeout(() => {
          setTransitionStage('visible');
        }, 1000);
      }, 1000);
    }, 4000); // Tiempo total del ciclo
    
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = () => {
    const section = document.getElementById("FeaturedProducts");
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
        <div className={style.Header}>
        <div className={style.Left}>
            <h1>The new trend coming soon</h1>
            <div className={style.typingContainer}>
            <TypingText 
                text="Discover the latest fashion trends that are coming to revolutionize your style! With the best trends, exclusive pieces, and innovative designs."
                speed={50}
            />
            </div>
        </div>

      <div className={style.Center}>
        <div className={style.ImageContainer}>
          <div className={`${style.ImageWrapper} ${style[transitionStage]}`}>
            <img 
              src={images[currentImage]} 
              alt="Imagen promocional" 
              className={style.Image}
            />
          </div>
        </div>
      </div>

      <div className={style.Right}>
        <button onClick={scrollToSection} className={style.BtnComprar}>Buy Now</button>
      </div>
    </div>
  );
};

export default Header;