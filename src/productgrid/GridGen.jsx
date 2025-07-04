// GridGen.jsx
import React from "react"; // No need for useState, useEffect directly here unless for other features
import { Link } from "react-router-dom";
import styles from "../style/GridGen.module.css";
import useScrollAnimation from "../hooks/useScrollAnimation"; // Import the custom hook

export const GridGen = () => {
    const categories = [
        {
            name: "Upper Wear",
            displayName: "Upper Wear",
            image: "https://static.zara.net/assets/public/e5d7/4cf3/75c04c72a3b7/bb8b7192bab5/07545192400-ult4/07545192400-ult4.jpg?ts=1743601820901&w=488",
            className: styles.one
        },
        {
            name: "Pants",
            displayName: "Pants",
            image: "https://static.zara.net/assets/public/f63a/875b/f93a46fa9c8c/506fb3ed4fd2/04612232250-ult/04612232250-ult.jpg?ts=1743516369416&w=662",
            className: styles.two
        },
        {
            name: "Accessories",
            displayName: "Accessories",
            image: "https://static.zara.net/assets/public/bc54/ee09/39214031a872/f2f7caefbc25/T0082340100-p/T0082340100-p.jpg?ts=1743688572352&w=272",
            className: styles.four
        },
        {
            name: "Footwear",
            displayName: "Footwear",
            image: "https://static.zara.net/assets/public/043e/d1b3/f12545768fe5/e6aa1a5b22e3/12750520102-ult/12750520102-ult.jpg?ts=1743766404410&w=662",
            className: styles.five
        }
    ];

    return (
        <div className={styles.wrapper}>
            {categories.map((category) => {
                // Use the hook for each category item
                const [ref, isVisible, isScrollingDown] = useScrollAnimation({
                    root: null, // viewport as root
                    rootMargin: '0px',
                    threshold: 0.2 // Trigger when 20% of the item is visible
                });

                return (
                    <Link
                        key={category.name}
                        to={`/productos?categoria=${encodeURIComponent(category.name)}`}
                        className={`${category.className} ${styles.gridItemAnimated} 
                                    ${isVisible ? styles.visible : styles.hidden}
                                    ${isScrollingDown ? styles.scrollDown : styles.scrollUp}` // Add scroll direction class
                                   }
                        ref={ref} // Attach the ref to the Link element
                    >
                        <div className={styles.overlay}></div>
                        <h3 className={styles.hachetres}>{category.displayName}</h3>
                        <img
                            className={styles.image}
                            alt={category.displayName}
                            src={category.image}
                            loading="lazy"
                        />
                    </Link>
                );
            })}
        </div>
    );
};