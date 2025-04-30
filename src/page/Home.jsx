import React from "react";
import styles from "../style/Home.module.css"
import Header from "../components/Header";

const Home = () => {

    return(
        <>
        <div className={styles.container}>
        <Header />

  {/*       <section id="FeaturedProducts" className={styles.featuredSection}>
        <FeaturedProducts productos={productos.filter(p => p.destacado)} />
      </section>

      <section className={styles.appPromoSection}>
        <MobileAppPromo /> 
      </section>

      <section id="categories" className={styles.categoriesSection}>
        <GridGen />
      </section>

         <Footer /> */}
    </div>
        </>
    )
};

export default Home;