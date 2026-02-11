import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // 1. Importamos motion
import styles from "../style/Home.module.css";
import { Header } from "../components/Header";
import FeaturedProducts from "../sections/FeaturedProducts";
import { getProductos } from "../api/Productos";
import { MobileApp } from "../sections/MobileApp";
import { GridGen } from "../productgrid/GridGen";
import { Footer } from "../components/Footer";
import { ParallaxSection } from "../sections/ParallaxSection";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const smoothVariants = {
  offscreen: { 
    opacity: 0,
    y: 30, // Distancia corta = movimiento más fluido
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // Un poco más lento para que sea elegante
      ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier para suavidad cinemática
    }
  }
};

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={styles.container}>
        <Header />

        <section id="FeaturedProducts" className={styles.featuredSection}>
          <FeaturedProducts productos={productos.filter(p => p.destacado === true)} />
        </section>

        <section className={styles.appPromoSection}>
          <MobileApp />
        </section>

{/* --- SECCIÓN CATEGORIES CON REPETICIÓN --- */}
        <motion.section
          id="categories"
          className={styles.categoriesSection}
          initial="offscreen"
          whileInView="onscreen"
          // El margin '-100px' hace que la animación termine de acomodarse 
          // justo antes de llegar al centro, evitando el efecto de "golpe"
          viewport={{ once: false, amount: 0.1, margin: "-50px" }}
          variants={smoothVariants}
        >
          <GridGen />
        </motion.section>

        {/* --- SECCIÓN PARALLAX CON REPETICIÓN --- */}
        <motion.section
          className={styles.parallaxWrapper}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.3 }}
          variants={smoothVariants}
        >
          <ParallaxSection id="ParallaxSection" />
        </motion.section>

        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>New summer trend</h2>
          <FeaturedProducts productos={productos.filter(p => p.tendencia === true)} />
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Home;