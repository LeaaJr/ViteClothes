import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../api/Productos';
import styles from '../style/ProductDetail.module.css'; // Asegúrate de tener este archivo
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  ChevronUpIcon, 
  ChevronDownIcon 
} from 'lucide-react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [imagenes, setImagenes] = useState(['placeholder.jpg']);
  const [productosRelacionados, setProductosRelacionados] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductoById(id);
        
        if (!data) {
          throw new Error('No se recibieron datos del producto');
        }

        // Procesar imágenes
        const imagenesFiltradas = [
          data.img1,
          data.img2,
          data.img3
        ].filter(img => img != null && img.trim() !== '');

        setImagenes(imagenesFiltradas.length > 0 ? imagenesFiltradas : ['placeholder.jpg']);
        setProducto(data);
        setError('');
        
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError(err.message || 'Error al cargar el producto');
        setTimeout(() => navigate('/productos'), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  useEffect(() => {
    const fetchRelacionados = async () => {
      try {
        const response = await axios.get(`/productos?subcategoria=${producto.subcategoria}`);
        console.log("Respuesta de la API:", response.data); // Para inspeccionar la respuesta

        // Verifica si la respuesta es un array
        if (Array.isArray(response.data)) {
          const relacionados = response.data.filter(p => p.id !== producto.id);
          setProductosRelacionados(relacionados);
        } else if (response.data.productos && Array.isArray(response.data.productos)) {
          // Si los productos están dentro de una propiedad "productos"
          const relacionados = response.data.productos.filter(p => p.id !== producto.id);
          setProductosRelacionados(relacionados);
        } else {
          console.error("La respuesta no contiene un array de productos.");
        }
      } catch (error) {
        console.error("Error al cargar productos relacionados:", error);
      }
    };

    // Solo hacer la solicitud si el producto tiene subcategoría
    if (producto?.subcategoria) {
      fetchRelacionados();
    }
  }, [producto]);

  if (loading) return <div className={styles.loading}>Cargando producto...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!producto) return <div className={styles.error}>No se encontró el producto</div>;

  return (
    <div className={styles.container}>
      <div className={styles.gallery}>
        {imagenes.length > 1 && (
          <div className={styles.thumbnails}>
            {imagenes.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index}`} 
                  onError={(e) => {
                    e.target.src = 'placeholder.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.mainImage}>
          <img 
            src={imagenes[selectedImage]} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = 'placeholder.jpg';
            }}
          />
        </div>
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{producto.nombre}</h1>

        {producto.stock <= 2 && (
          <div className={styles.badge}>¡Últimos {producto.stock} disponibles!</div>
        )}

        <div className={styles.price}>€ {producto.precio?.toFixed(2) || '0.00'}</div>

        <div className={styles.accordion}>
          <div
            className={styles.accordionHeader}
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <span>Detalles del Producto</span>
            {isDetailsOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
          </div>

          {isDetailsOpen && (
            <div className={styles.accordionContent}>
              <p>{producto.descripcion || 'No hay descripción disponible'}</p>
              <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p>
              {producto.subcategoria && (
                <p><strong>Subcategoría:</strong> {producto.subcategoria}</p>
              )}
              <p><strong>Stock disponible:</strong> {producto.stock || 0}</p>
            </div>
          )}
        </div>

        <div className={styles.accordion} />

        <button className={`${styles.button} ${styles.favoriteButton}`}>
          <HeartIcon size={18} /> Agregar a Favoritos
        </button>

        <button className={`${styles.button} ${styles.cartButton}`}>
          <ShoppingCartIcon size={18} /> Agregar al Carrito
        </button>

      </div>

      {productosRelacionados.length > 0 && (
        <div className={styles.relacionadosSection}>
          <h2>Productos Relacionados</h2>
          <div className={styles.relacionadosGrid}>
            {productosRelacionados.map((p) => (
              <div key={p.id} className={styles.relacionadoCard}>
                <img src={p.imagenes?.[0]} alt={p.nombre} />
                <p>{p.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
