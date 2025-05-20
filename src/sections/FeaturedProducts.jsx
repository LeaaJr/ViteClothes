// FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, BookmarkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/FeaturedProducts.module.css';
import { getProductosDestacados } from '../api/Productos';

const FeaturedProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const validPrice = product.precio && !isNaN(product.precio) ? Number(product.precio) : 0;

  // Función para manejar el click en la tarjeta del producto
  const handleCardClick = () => {
    navigate(`/productos/${product.id}`, {
      state: { from: window.location.pathname }
    });
  };

  // Función para manejar el clic en el botón de guardar
  const handleSaveClick = (e) => {
    e.stopPropagation();

    // Obtener productos guardados actuales
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');

    // Verificar si el producto ya está guardado
    const isAlreadySaved = savedProducts.some(item => item.id === product.id);

    if (isAlreadySaved) {
      // Si ya está guardado, lo removemos
      const updatedProducts = savedProducts.filter(item => item.id !== product.id);
      localStorage.setItem('savedProducts', JSON.stringify(updatedProducts));
      setIsSaved(false);
    } else {
      // Si no está guardado, lo agregamos
      const productToSave = {
        id: product.id,
        img1: product.img1,
        nombre: product.nombre,
        precio: validPrice,
        currency: product.currency || 'EUR',
        descripcion: product.descripcion,
      };
      localStorage.setItem('savedProducts', JSON.stringify([...savedProducts, productToSave]));
      setIsSaved(true);
    }
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.src = 'placeholder.jpg';
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${product.nombre}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.img1 || 'placeholder.jpg'}
          alt={product.nombre}
          className={styles.image}
          onError={handleImageError}
        />
        <div className={styles.addButton}>
          <PlusIcon size={20} />
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.title}>
            {product.nombre}
            {product.descripcion && (
              <span className={styles.tooltip} data-tooltip={product.descripcion}></span>
            )}
          </div>
          <div className={styles.price}>
            {validPrice.toFixed(2)} {product.currency || 'EUR'}
          </div>
        </div>
        <div
          className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
          onClick={handleSaveClick}
          aria-label={isSaved ? 'Quitar de guardados' : 'Guardar producto'}
        >
          <BookmarkIcon size={16} fill={isSaved ? 'black' : 'none'} />
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
