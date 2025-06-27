    import { useState, useEffect } from "react";
    import styles from "../style/Home.module.css"
    import Header from "../components/Header";
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

      useEffect(() => {
        const fetchProductos = async () => {
          try {
            const data = await getProductos();
            setProductos(data);
            console.log('Productos cargados:', productos);
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

      return(
        <>
          <div className={styles.container}>
            <Header />
            
            <section id="FeaturedProducts" className={styles.featuredSection}>
              <FeaturedProducts productos={productos.filter(p => p.destacado === true)} />
            </section>

            <section className={styles.appPromoSection}>
              <MobileApp /> 
            </section>

            <section id="categories" className={styles.categoriesSection}>
              <GridGen />
            </section>

            {/* Sección parallax */}
            <section className={styles.parallaxWrapper}>
              <ParallaxSection id="ParallaxSection" />
            </section>

            <section className={styles.featuredSection}>
              <h2 className={styles.sectionTitle}>New summer trend</h2>
                <FeaturedProducts productos={productos.filter(p => p.tendencia === true)} />
            </section>

          </div>
        </>
      )
    };

    export default Home;