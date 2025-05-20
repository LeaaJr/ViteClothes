import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/ProductCard.module.css';
import { PlusIcon, BookmarkIcon } from 'lucide-react';

const ProductCard = ({
  id,
  img1,
  nombre,
  categoria,
  subcategoria,
  precio,
  descripcion,
  stock,
  currency = 'EUR',
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const validPrice = precio && !isNaN(precio) ? Number(precio) : 0;

  const handleCardClick = () => {
    navigate(`/productos/${id}`, {
      state: { from: window.location.pathname }
    });
  };

  const handleSaveClick = (e) => {
  e.stopPropagation();
  
  // Obtener productos guardados actuales
  const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
  
  // Verificar si el producto ya está guardado
  const isAlreadySaved = savedProducts.some(product => product.id === id);
  
  if (isAlreadySaved) {
    // Si ya está guardado, lo removemos
    const updatedProducts = savedProducts.filter(product => product.id !== id);
    localStorage.setItem('savedProducts', JSON.stringify(updatedProducts));
    setIsSaved(false);
  } else {
    // Si no está guardado, lo agregamos
    const productToSave = {
      id,
      img1,
      nombre,
      precio: validPrice,
      currency,
      descripcion
    };
    localStorage.setItem('savedProducts', JSON.stringify([...savedProducts, productToSave]));
    setIsSaved(true);
  }
};

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
      aria-label={`Ver detalles de ${nombre}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={img1 || 'placeholder.jpg'}
          alt={nombre}
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
            {nombre}
            {descripcion && (
              <span className={styles.tooltip} data-tooltip={descripcion}></span>
            )}
          </div>
          <div className={styles.price}>
            {validPrice.toFixed(2)} {currency}
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

export default ProductCard;