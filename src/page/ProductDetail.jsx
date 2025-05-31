import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../api/Productos';
import styles from '../style/ProductDetail.module.css';
import { useCart } from '../context/CartContext';
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
  const [isSizesOpen, setIsSizesOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const {addToCart} = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { img1, nombre, precio, descripcion } = producto || {};
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  

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
    if (!producto?.subcategoria) return;
    
    try {
      const response = await axios.get(`http://localhost:8000/productos`, {
        params: {
          subcategoria: producto.subcategoria
        }
      });

      console.log("Respuesta de productos relacionados:", response.data);

      // Asegúrate de que la respuesta sea un array
      const productosData = Array.isArray(response.data) ? response.data : 
                          response.data.productos || [];
      
      const relacionados = productosData
        .filter(p => p.id !== producto.id)
        .slice(0, 4);
      
      setProductosRelacionados(relacionados);
      
    } catch (error) {
      console.error("Error al cargar productos relacionados:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      setProductosRelacionados([]);
    }
  };

  fetchRelacionados();
}, [producto]);

useEffect(() => {
  const saved = localStorage.getItem('savedProducts');
  const savedProducts = saved ? JSON.parse(saved) : [];
  const isProductSaved = savedProducts.some(p => p.id === id);
  setIsSaved(isProductSaved);
}, [id]);


const handleAddToCart = () => {
    if (!selectedSize && producto.talles && Object.keys(producto.talles).length > 0) {
      alert('Please select a size before adding to cart');
      return;
    }

    const rawPrice = producto.precio?.toFixed(2) || '0.00';
    const cleanPrice = rawPrice.toString().replace('$', '').trim();

    addToCart({
    id: producto.id,
    name: producto.nombre,
    price: `€${cleanPrice}`,
    imageSrc: imagenes[0],
    imageAlt: producto.nombre,
    size: selectedSize,
    quantity: quantity
  });
  
  setIsAdded(true);
  setTimeout(() => setIsAdded(false), 2000);
};

 const handleSaveClick = (e) => {
    e.stopPropagation();
    
const saved = localStorage.getItem('savedProducts');
const savedProducts = saved ? JSON.parse(saved) : [];

const productToSave = {
  id,
  img1: producto.img1,
  nombre: producto.nombre,
  precio: producto.precio,
  descripcion: producto.descripcion,
  savedAt: new Date().toISOString()
};

    let updatedProducts;
    
    if (isSaved) {
      // Remover producto
      updatedProducts = savedProducts.filter(p => p.id !== id);
      setIsSaved(false);
    } else {
      // Agregar producto
      updatedProducts = [...savedProducts, productToSave];
      setIsSaved(true);
    }

    localStorage.setItem('savedProducts', JSON.stringify(updatedProducts));
  };

   const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  setPosition({ x, y });
};

  if (loading) return <div className={styles.loading}>Cargando producto...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!producto) return <div className={styles.error}>No se encontró el producto</div>;

  return (
    <>
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
        
        <div 
          className={`${styles.mainImage} ${zoom ? styles.zoomed : ''}`}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <img 
            src={imagenes[selectedImage]} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = 'placeholder.jpg';
            }}
            style={{ transformOrigin: `${position.x}% ${position.y}%` }}
          />
          {zoom && <div className={styles.zoomLens} style={{ left: `${position.x}%`, top: `${position.y}%` }}></div>}
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
            <span>Product Details</span>
            {isDetailsOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
          </div>

          {isDetailsOpen && (
            <div className={styles.accordionContent}>
              <p>{producto.descripcion || 'No hay descripción disponible'}</p>
              <p><strong>Category:</strong> {producto.categoria || 'N/A'}</p>
              {producto.subcategoria && (
                <p><strong>Subcategory:</strong> {producto.subcategoria}</p>
              )}
             {/*  <p><strong>Current Stock:</strong> {producto.stock || 0}</p> */}
            </div>
          )}
        </div>

        <div className={styles.accordion}>
        <div
          className={styles.accordionHeader}
          onClick={() => setIsSizesOpen(!isSizesOpen)}
        >
          <span>Available Sizes</span>
          {isSizesOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
        </div>

          {isSizesOpen && (
            <div className={styles.accordionContent}>
              {producto.talles && Object.keys(producto.talles).length > 0 ? (
                <div className={styles.sizeSelector}>
                  {Object.entries(producto.talles).map(([size, stock]) => (
                    <div 
                      key={size}
                      className={`${styles.sizeOption} ${selectedSize === size ? styles.selectedSize : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span>{size}</span>
                      <span className={styles.sizeStock}>({stock} available)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay talles disponibles para este producto</p>
              )}
              
{/*               {selectedSize && (
                <button 
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  Agregar al carrito (Talle: {selectedSize})
                </button>
              )} */}

              {/* esta caracteristica es opcional y tiene funcionamiento logico en este caso la dejo comentada para un futuro */}

            </div>
          )}
        </div>

        <div className={styles.accordion} />

          <button 
            className={`${styles.button} ${styles.favoriteButton} ${isSaved ? styles.saved : ''}`}
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon size={18} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved' : 'Add to favorites'}
          </button>

        <button 
        onClick={handleAddToCart}
        className={`${styles.button} ${styles.cartButton} ${isAdded ? styles.added : ''}`}
        disabled={isAdded}
      >
        <ShoppingCartIcon size={18} />
        {isAdded ? 'Added to Cart!' : 'Add to Cart'}
      </button>

        <div className={styles.paymentMethods}>
        <p className={styles.paymentTitle}>These are the currently accepted payment methods:</p>
        <div className={styles.paymentIcons}>
          <img src="https://static.vecteezy.com/system/resources/previews/020/975/576/large_2x/visa-logo-visa-icon-transparent-free-png.png" alt="Visa" />
          <img src="https://salex.it/wp-content/uploads/MasterCard_Logo.svg_.png.webp" alt="MasterCard" />
          <img src="https://www.citypng.com/public/uploads/preview/hd-amex-american-express-logo-png-701751694708970jttzjjyo6e.png" alt="American Express" />
          <img src="https://static.vecteezy.com/system/resources/previews/019/909/676/large_2x/paypal-transparent-paypal-free-free-png.png" alt="PayPal" />
        </div>
      </div>

      </div>
    </div>
    {productosRelacionados.length > 0 && (
        <div className={styles.relacionadosSection}>
          <h2 className={styles.relacionadosTitle}>Productos Relacionados</h2>
          <div className={styles.relacionadosDivider}></div>
          <div className={styles.relacionadosGrid}>
            {productosRelacionados.slice(0, 4).map((p) => {
              const imagenesProducto = [
                p.img1,
                p.img2,
                p.img3
              ].filter(img => img != null && img.trim() !== '');
              
              const imagenPrincipal = imagenesProducto.length > 0 
                ? imagenesProducto[0] 
                : 'placeholder.jpg';

              return (
                <div 
                  key={p.id} 
                  className={styles.relacionadoCard}
                  onClick={() => navigate(`/productos/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/productos/${p.id}`)}
                >
                  <img 
                    src={imagenPrincipal} 
                    alt={p.nombre}
                    onError={(e) => {
                      e.target.src = 'placeholder.jpg';
                    }}
                    className={styles.relacionadoImage}
                    loading="lazy"
                  />
                  <h3 className={styles.relacionadoNombre}>{p.nombre}</h3>
                  <p className={styles.relacionadoPrecio}>€ {p.precio?.toFixed(2) || '0.00'}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </>
  );
};

export default ProductDetail;
