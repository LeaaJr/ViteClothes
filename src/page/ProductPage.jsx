import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductos, getProductosByCategoryAndSubcategory } from '../api/Productos';
import ProductCard from '../components/ProductCard';
import styles from '../style/ProductPage.module.css';
import { FilterBar } from '../components/FilterBar';

const ProductPage = () => {
  const { category } = useParams();
  const [allProductos, setAllProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);

  const applyFilters = (filters) => {
    const { priceRange, selectedCategories, state } = filters;
  
    const filtered = allProductos.filter(product => {
      const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
  
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.subcategoria); // o categoria, según el campo
  
      const matchesState = state === 'All' || product.estado === state;
  
      return matchesPrice && matchesCategory && matchesState;
    });
  
    setFilteredProductos(filtered);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const productosData = category
          ? await getProductosByCategoryAndSubcategory(category)
          : await getProductos();
  
        setAllProductos(productosData);
        setFilteredProductos(productosData);
  
        // Extraer subcategorías únicas
        const subcategorias = Array.from(
          new Set(productosData.map(p => p.subcategoria))
        );
        setSubcategoriasDisponibles(subcategorias);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductos();
  }, [category]);

  if (loading) return <div className={styles.loading}>Cargando productos...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
  <FilterBar onFilterChange={applyFilters} subcategorias={subcategoriasDisponibles} />


  <div className={styles.container}>
    <h1 className={styles.title}>
      {category 
        ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
        : 'Todos los productos'}
    </h1>

    <div className={styles.productosGrid}>
      {filteredProductos.length > 0 ? (
        filteredProductos.map(product => (
          <ProductCard
            key={product.id}
            {...product}
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