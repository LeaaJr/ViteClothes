import React from 'react'
import { CheckCircleIcon } from 'lucide-react'
import styles from '../style/SlidingParallax.module.css';


export function ParallaxSection() {
  return (
    <div className={styles.container}>
      {/* First Section with Video */}
      <section className={styles.section}>
        <div className={styles.content}>
          <h2 className={styles.heading}>New Summer Trend: Work in Style</h2>
          <p className={styles.description}>
            Experience the latest trends this summer. Get ready for the season with cutting-edge designs that make a statement.
          </p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Effortless Summer Vibes</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Stay Cool with Modern Comfort</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Chic & Timeless Looks</span>
            </li>
          </ul>
          <p className={styles.description}>
            Refresh your wardrobe with timeless pieces that capture the essence of summer.
          </p>
        </div>
        <div className={styles.mediaContainer}>
          <video
            className={styles.video}
            autoPlay
            muted
            controls
            poster="https://static.zara.net/assets/public/4397/9518/7a0040f69000/9761a71595c1/M9230826688-ult/3600000000000.m4s"
          >
            <source
              src="https://static.zara.net/assets/public/4397/9518/7a0040f69000/9761a71595c1/M9230826688-ult/3600000000000.m4s"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      {/* Second Section with Image */}
      <section className={styles.section}>
        <div className={styles.content}>
          <h2 className={styles.heading}>Invest in the Best Summer Trends</h2>
          <p className={styles.description}>
            Embrace the latest trends and invest in pieces that will keep you looking fresh all summer long.
          </p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>High-Quality Fabrics</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Designed for Comfort</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Bold Colors for the Season</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Eco-Friendly Options</span>
            </li>
          </ul>
          <p className={styles.description}>
            Elevate your style with pieces that speak to both fashion and sustainability.
          </p>
        </div>
        <div className={styles.mediaContainer}>
          <img
            className={styles.media}
            src="https://image.hm.com/content/dam/global_campaigns/season_01/men/start-page-assets/w14/edits/MS21E5-Edits-16x9-w14.jpg"
            alt="Summer Trend Outfit"
          />
        </div>
      </section>
      {/* Third Section with Image */}
      <section className={styles.section}>
        <div className={styles.content}>
          <h2 className={styles.heading}>Build Your Best Summer Look</h2>
          <p className={styles.description}>
            Create a stunning look that defines the summer season, with accessories and pieces that shine.
          </p>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Stylish Accessories</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Casual Yet Trendy</span>
            </li>
            <li className={styles.featureItem}>
              <CheckCircleIcon className={styles.featureIcon} size={20} />
              <span>Perfect for Day-to-Night</span>
            </li>
          </ul>
          <p className={styles.description}>
            Unleash your creativity and build a wardrobe that takes you from beach days to city nights.
          </p>
        </div>
        <div className={styles.mediaContainer}>
          <img
            className={styles.media}
            src="https://image.hm.com/content/dam/global_campaigns/season_01/men/ms21e5/scroll/MS21E5-linen-days-CPD-top-16x9.jpg"
            alt="Trendy Summer Look"
          />
        </div>
      </section>
    </div>
  );
}