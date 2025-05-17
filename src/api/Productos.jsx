// Productos.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000/productos';


//esperando a que funcione en postman supuestamente
//probado y funcionando

export const getProductos = async () => {
  try {
    console.log('Intentando conectar a:', API_URL); // Debug
    const response = await axios.get(API_URL);
    console.log('Respuesta recibida:', response); // Debug
    return response.data;
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};  


//camibo de categoria y subcategoria xd 
//Entendiendo que deberia de funcionar

export const getProductosByCategoryAndSubcategory = async (categoria, subcategoria = null) => {
  const params = new URLSearchParams();
  if (categoria) params.append('categoria', categoria);
  if (subcategoria) params.append('subcategoria', subcategoria);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

//para hacer el put en postman
//probado y funcionando

export const updateProducto = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar los productos:', error);
        throw error;
    }
};

export const addProducto = async (producto) => {
    try {
        const response = await axios.post(API_URL, producto);
        return response.data;
    } catch (error) {
        console.error('Error al agregar los productos:', error);
        throw error;
    };
};

export const getProductosDestacados = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/productos/destacados`);
      return response.data;
    } catch (error) {
      console.error('Error en getProductosDestacados:', {
        error: error.response?.data || error.message
      });
      throw error;
    }
  }; 

//este Endpoint es para el route ProductDetail.jsx

export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      timeout: 5000, // 5 segundos de timeout
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    // Validación adicional de datos
    if (!response.data || !response.data.id) {
      throw new Error('La respuesta no contiene datos válidos');
    }

    return response.data;
  } catch (error) {
    console.error('Error al obtener producto:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response?.status === 404) {
      throw new Error('Producto no encontrado');
    }
    
    throw new Error('Error al cargar el producto. Intente nuevamente.');
  }
};