import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductos, getProductosByCategoryAndSubcategory } from '../api/Productos';
import ProductCard from '../components/ProductCard';
import styles from '../style/ProductPage.module.css';
import { FilterBar } from '../components/FilterBar';

const ProductPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try { 
        const productsData = category 
          ? await getProductosByCategoryAndSubcategory(category)
          : await getProductos();
        setProducts(productsData);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div className={styles.loading}>Cargando productos...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
        <FilterBar />
    <div className={styles.container}>
      <h1 className={styles.title}>
        {category 
          ? `${category.charAt(0).toUpperCase() + category.slice(1)}` 
          : 'Todos los productos'}
      </h1>
      
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              imagen1={product.imagen1}
              nombre={product.nombre}
              categoria={product.categoria}
              precio={product.precio}
              descripcion={product.descripcion}
              stock={product.stock}
              currency="EUR"
            />
          ))
        ) : (
          <p className={styles.empty}>No se encontraron productos</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductPage;