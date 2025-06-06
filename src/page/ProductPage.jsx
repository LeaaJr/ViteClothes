import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Añadido useLocation
import { getProductos, getProductosByCategoryAndSubcategory } from '../api/Productos';
import ProductCard from '../components/ProductCard';
import styles from '../style/ProductPage.module.css';
import { FilterBar } from '../components/FilterBar';

const ProductPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categoria');
  
  const [allProductos, setAllProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    selectedCategories: [],
    state: 'All'
  });

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    
    const { priceRange, selectedCategories, state } = newFilters;
    const filtered = allProductos.filter(product => {
      const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.subcategoria);
      const matchesState =
        state === 'All'
          ? true
          : state === 'Trend'
            ? product.tendencia === true
            : product.estado === state;

      return matchesPrice && matchesCategory && matchesState;
    });

    const ordenados = filtered.sort((a, b) => {
      return a.tendencia === b.tendencia ? 0 : a.tendencia ? 1 : -1;
    });

    setFilteredProductos(ordenados);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const productosData = category
          ? await getProductosByCategoryAndSubcategory(category)
          : await getProductos();

        const ordenados = [...productosData].sort((a, b) => {
          return a.tendencia === b.tendencia ? 0 : a.tendencia ? 1 : -1;
        });

        setAllProductos(ordenados);
        setFilteredProductos(ordenados);

        // Extraer subcategorías únicas
        const subcategorias = Array.from(
          new Set(productosData.map(p => p.subcategoria).filter(Boolean))
        );

        setSubcategoriasDisponibles(subcategorias);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [category]);

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <FilterBar 
        onFilterChange={applyFilters} 
        subcategorias={subcategoriasDisponibles}
        initialFilters={filters}
      />

      <div className={styles.container}>
        <h1 className={styles.title}>
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
            : 'All products'}
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