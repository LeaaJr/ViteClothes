import React from 'react'
import styles from '../style/FeatureCard.module.css'

export const FeatureCard = ({icon, title, description,}) => {
  return (
    <div className={styles.featureCard}>
      <div className={styles.iconContainer}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};