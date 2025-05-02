import React from 'react';
import ProductCard from '../components/ProductCard';
import styles from '../style/ProductGrid.module.css';

const ProductGrid = ({ products }) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          nombre={product.nombre}
          categoria={product.categoria}
          precio={product.precio}
          descripcion={product.descripcion}
          stock={product.stock}
          imagen1={product.imagen1}
          currency="EUR"
        />
      ))}
    </div>
  );
};

export default ProductGrid;