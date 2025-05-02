import { useState, useEffect } from "react";
import styles from "../style/Home.module.css"
import Header from "../components/Header";
import FeaturedProducts from "../sections/FeaturedProducts";
import { getProductos } from "../api/Productos";
import { MobileApp } from "../sections/MobileApp";
import { GridGen } from "../productgrid/GridGen";
import { Footer } from "../components/Footer";

const Home = () => {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        console.log("Productos cargados:", data);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

    return(
        <>
        <div className={styles.container}>
        <Header />

        <section id="FeaturedProducts" className={styles.featuredSection}>
        <FeaturedProducts productos={productos.filter(p => p.destacado)} />
      </section>

       <section className={styles.appPromoSection}>
        <MobileApp /> 
      </section>

      <section id="categories" className={styles.categoriesSection}>
        <GridGen />
      </section>

         <Footer /> 
    </div>
        </>
    )
};

export default Home;