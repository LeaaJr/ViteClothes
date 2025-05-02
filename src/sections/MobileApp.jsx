import React from 'react'
import { TruckIcon, PercentIcon, FilterIcon, FingerprintIcon, } from 'lucide-react'
import { FeatureCard } from '../components/FeatureCard';
import styles from '../style/MobileApp.module.css';

export const MobileApp = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <h1 className={styles.heading}>
            Buy faster and from anywhere with our mobile application
          </h1>
          <p className={styles.subheading}>
            Enhance your shopping experience with our convenient mobile
            application, allowing you to browse and purchase items swiftly from
            anywhere and anytime.
          </p>
          <div className={styles.downloadButtons}>
            <button className={styles.appStoreButton}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.buttonIcon}
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
              </svg>
              <div className={styles.buttonText}>
                <span className={styles.buttonSmallText}>Download on the</span>
                <span className={styles.buttonLargeText}>Mac App Store</span>
              </div>
            </button>
            <button className={styles.googlePlayButton}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.buttonIcon}
              >
                <path d="M3 3v18l18-9L3 3z"></path>
              </svg>
              <div className={styles.buttonText}>
                <span className={styles.buttonSmallText}>Get it on</span>
                <span className={styles.buttonLargeText}>Google Play</span>
              </div>
            </button>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.featureGrid}>
            <FeatureCard
              icon={<TruckIcon size={24} style={{backgroundColor:'#ffffff'}} />}
              title="Premium Shipping"
              description="Multiple shipping methods with real-time shipping cost"
            />
            <FeatureCard
              icon={<PercentIcon size={24} style={{backgroundColor:'#ffffff'}} />}
              title="Weekly Promotions"
              description="Explore our weekly promotions for special discounts"
            />
            <FeatureCard
              icon={<FilterIcon size={24} style={{backgroundColor:'#ffffff'}} />}
              title="Advanced Filtering"
              description="Advanced filtering options (by category, price and more)"
            />
            <FeatureCard
              icon={<FingerprintIcon size={24} style={{backgroundColor:'#ffffff'}} />}
              title="Secure Payment"
              description="Integration with trusted payment gateways such as Stripe"
            />
          </div>
        </div>
      </div>
    </div>
  );
};