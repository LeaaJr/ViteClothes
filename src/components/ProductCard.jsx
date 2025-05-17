import React from 'react';
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
  const validPrice = precio && !isNaN(precio) ? Number(precio) : 0;

  const handleClick = () => {
    console.log('Navegando a producto ID:', id); // Debug
    navigate(`/productos/${id}`, {
      state: { from: window.location.pathname }
    });
  };

  const handleImageError = (e) => {
    e.target.src = 'placeholder.jpg';
  };

  return (
    <div 
      className={styles.card} 
      onClick={handleClick} 
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
        <div className={styles.saveButton}>
          <BookmarkIcon size={16} />
        </div>
      </div>
    </div>
  );
};


export default ProductCard;