import React from 'react'
import styles from '../style/Header.module.css'


export function Header() {
  return (
    <section className={styles.container}>
      {/* Left Panel: Text Content */}
      <div className={styles.leftPanel}>

        <h1 className={styles.heading}>CLOTHES</h1>

        <p className={styles.description}>
          Our collection celebrates the beauty of simplicity. Garments designed to accompany you every day,
            with clean lines, quality materials, and a timeless style that transcends trends.
             Dressing well isn't about attracting attention; it's about feeling authentic.
        </p>
      </div>

      {/* Right Panel: Image and Overlays */}
      <div className={styles.rightPanel}>
        {/* Navigation Links Overlay */}
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>
            CARRELLO (0)
          </a>
          <a href="#" className={styles.navLink}>
            LOGIN
          </a>
          <a href="#" className={styles.navLink}>
            SUPPORTO
          </a>
        </nav>

        {/* Main Image */}
        <img
          src="https://static.zara.net/assets/public/40be/5ab8/794a4ec4af55/1bf52b7abd7c/img23-a7dafb3b-6245-4eff-9d0c-9b438c38b861_0/img23-a7dafb3b-6245-4eff-9d0c-9b438c38b861_0.jpg?ts=1770230798882&w=958"
          alt="Editorial fashion shot of a person in a beige jacket and black shorts"
          className={styles.image}
        />

        {/* Bottom Caption Overlay */}
        <div className={styles.captionContainer}>
          <span className={styles.captionTitle}>UNTITLED.05</span>
          <span>Still Life</span>
          <span>Colour composition</span>
        </div>
      </div>
    </section>
  )
}
