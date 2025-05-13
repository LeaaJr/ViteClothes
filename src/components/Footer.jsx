import React from 'react'
import styles from '../style/Footer.module.css'

export const Footer = ({ id }) => {
  return (
    <footer id={id} className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.locations}>
          <div className={styles.locationItem}>
            <h3>NEW YORK</h3>
            <p>Huntersville,</p>
            <p>957 Hill Hills Suite 491, United States</p>
            <p>Office: +12(3) 456 7890 1234</p>
            <p>Support: company@name.com</p>
          </div>
          <div className={styles.locationItem}>
            <h3>ROME</h3>
            <p>Piazza di Spagna,</p>
            <p>00187 Roma RM, Italy</p>
            <p>Office: +12(3) 456 7890 1234</p>
            <p>Support: company@name.it</p>
          </div>
          <div className={styles.locationItem}>
            <h3>LONDON</h3>
            <p>Fulham Rd,</p>
            <p>London SW6 1HS, United Kingdom</p>
            <p>Office: +12(3) 456 7890 1234</p>
            <p>Support: company@name.co.uk</p>
          </div>
        </div>
        <div className={styles.newsletter}>
          <p>Sign up to our newsletter</p>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.logo}> (LOGO) </div>
          <div className={styles.copyright}>
            © 2021-2022 Flowbite™. All Rights Reserved.
          </div>
          <div className={styles.language}>🇺🇸 English (US)</div>
        </div>
      </div>
    </footer>
  )
}