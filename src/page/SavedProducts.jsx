import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/SavedProducts.module.css';

const SavedProducts = () => {
  const savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];

  return (
    <div className={styles.container}>
      <h1>Productos Guardados</h1>
      {savedProducts.length === 0 ? (
        <p>No tienes productos guardados</p>
      ) : (
        <div className={styles.productsGrid}>
          {savedProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.img1 || 'placeholder.jpg'} alt={product.nombre} />
              <h3>{product.nombre}</h3>
              <p>{product.precio.toFixed(2)} {product.currency}</p>
              <Link to={`/productos/${product.id}`} style={{color:"black"}}>Ver detalles</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProducts;