// FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, BookmarkIcon, MoveLeft, MoveRight } from 'lucide-react';
import styles from '../style/FeaturedProducts.module.css';
import { getProductosDestacados } from '../api/Productos';

const FeaturedProductCard = ({ product }) => {
  const validPrice = product.precio && !isNaN(product.precio) ? Number(product.precio) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={product.img1 || 'placeholder.jpg'}
          alt={product.nombre}
          className={styles.image}
        />
        {product.destacado && <div className={styles.featuredBadge}>New Collection</div>}
      </div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.title}>
            {product.nombre}
            {product.descripcion && (
              <span className={styles.tooltip} data-tooltip={product.descripcion}></span>
            )}
          </div>
          <div className={styles.price}>{validPrice.toFixed(2)} €</div>
        </div>
        <div className={styles.saveButton}>
          <BookmarkIcon size={16} />
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = ({ productos: productosExternos }) => {
  const [productos, setProductos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProductosDestacados();
        setProductos(data);
      } catch (err) {
        setError('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    // Solo llama a la API si no vienen productos desde fuera
    if (!productosExternos) {
      fetchFeaturedProducts();
    } else {
      setProductos(productosExternos);
      setLoading(false);
    }
  }, [productosExternos]);

  if (loading) return <div className={styles.loading}>Cargando productos...</div>;
  if (productos.length === 0) return <div className={styles.empty}>No hay productos para mostrar</div>;

  const visibleProductos = productos.slice(currentIndex * 4, (currentIndex + 1) * 4);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.ceil(productos.length / 4) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(productos.length / 4) - 1 : prevIndex - 1
    );
  };

  return (
    <section className={styles.featuredSection}>
      <div className={styles.carouselContainer}>
        <button onClick={prevSlide} className={styles.navButton} aria-label="Anterior">
          {/* <MoveLeft size={30} /> */}
        </button>
        <div className={styles.carousel}>
          {visibleProductos.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
        <button onClick={nextSlide} className={styles.navButton} aria-label="Siguiente">
          {/* <MoveRight size={30} /> */}
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
