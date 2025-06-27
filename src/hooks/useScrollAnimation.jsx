// hooks/useScrollAnimation.js
import { useEffect, useRef, useState } from 'react';

const useScrollAnimation = (options) => {
  const ref = useRef(null); // Ref for the DOM element
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(true); // Track scroll direction

  const lastScrollY = useRef(0); // To store previous scroll position

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Determine scroll direction when entering viewport
        if (window.scrollY > lastScrollY.current) {
          setIsScrollingDown(true); // Scrolling down, entering from outside
        } else {
          setIsScrollingDown(false); // Scrolling up, entering from inside
        }
      } else {
        // Element is no longer intersecting
        setIsVisible(false);
        // Determine scroll direction when exiting viewport
        if (window.scrollY > lastScrollY.current) {
          setIsScrollingDown(true); // Scrolling down, exiting downwards
        } else {
          setIsScrollingDown(false); // Scrolling up, exiting upwards
        }
      }
      lastScrollY.current = window.scrollY; // Update last scroll position
    }, options);

    observer.observe(currentRef);

    // Cleanup function
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]); // Re-run effect if options change

  return [ref, isVisible, isScrollingDown];
};

export default useScrollAnimation;