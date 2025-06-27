// Header.jsx
import React, { useState, useEffect } from "react";
import style from '../style/Header.module.css';
import TypingText from "./TypingText";

const Header = () => {
    const [currentImage, setCurrentImage] = useState(0);
    // No need for transitionStage state anymore.
    
    const images = [
        "https://static.zara.net/assets/public/c23b/b00e/f48d49f6bcf6/28a333d03e17/05070123052-e1/05070123052-e1.jpg?ts=1736432624416&w=750",
        "https://static.zara.net/assets/public/17c3/28bd/888e4ac282d3/91e1498dbf5b/05070308800-e1/05070308800-e1.jpg?ts=1742297115203&w=750",
        "https://static.zara.net/assets/public/e4ef/04d0/dd2e4b4b9b26/11cee2db8d18/06318401251-e1/06318401251-e1.jpg?ts=1735549646894&w=750",
    ];

    useEffect(() => {
        // Change image every 4 seconds
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000); // Total time for one image: 4s (includes fade in/out time)
        
        return () => clearInterval(interval);
    }, [images.length]); // Add images.length to dependency array

    const scrollToSection = () => {
        const section = document.getElementById("FeaturedProducts");
        if (section) { // Added a check to ensure the element exists
            section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
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
                    {/* Render each image with a conditional class for active state */}
                    {images.map((imgSrc, index) => (
                        <img 
                            key={index} // Use index as key if images array is static and items don't reorder
                            src={imgSrc} 
                            alt={`Promotional image ${index + 1}`} 
                            // Add 'active' class only to the current image
                            className={`${style.Image} ${index === currentImage ? style.active : ''}`}
                        />
                    ))}
                </div>
            </div>

            <div className={style.Right}>
                <button onClick={scrollToSection} className={style.BtnComprar}>Buy Now</button>
            </div>
        </div>
    );
};

export default Header;