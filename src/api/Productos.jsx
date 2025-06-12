// Productos.jsx
import axios from 'axios';

// Esto Define la base URL de la API.
// En producción (Vercel), VITE_API_BASE es la URL de Render.
// En desarrollo (localhost), VITE_API_BASE será undefined o se puede configurar en .env.development.
// Por eso, uso un fallback a localhost para el desarrollo.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// A partir de ahora, construye tus URLs usando API_BASE_URL.
// Por ejemplo, para /productos
const PRODUCTOS_API_URL = `${API_BASE_URL}/productos`;


//esperando a que funcione en postman supuestamente
//probado y funcionando

export const getProductos = async () => {
  try {
        console.log('Intentando conectar a:', PRODUCTOS_API_URL); // Debug
        const response = await axios.get(PRODUCTOS_API_URL);
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
    try {
        const params = new URLSearchParams();
        if (categoria) params.append('categoria', categoria);
        if (subcategoria) params.append('subcategoria', subcategoria);

        // Asegúrar de usar API_BASE_URL aquí, no PRODUCTOS_API_URL si estás construyendo el path con parámetros
        const url = `${API_BASE_URL}/productos?${params.toString()}`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    // Asegúrate que la respuesta sea un array
    if (!Array.isArray(response.data)) {
      throw new Error('La respuesta no es un array de productos');
    }

    return response.data;
  } catch (error) {
    console.error('Error en getProductosByCategoryAndSubcategory:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

//para hacer el put en postman
//probado y funcionando

export const updateProducto = async (id, updatedData) => {
    try {
        const response = await axios.put(`<span class="math-inline">\{PRODUCTOS\_API\_URL\}/</span>{id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar los productos:', error);
        throw error;
    }
};

export const addProducto = async (producto) => {
    try {
        const response = await axios.post(PRODUCTOS_API_URL, producto);
        return response.data;
    } catch (error) {
        console.error('Error al agregar los productos:', error);
        throw error;
    };
};

export const getProductosDestacados = async () => {
    try {
  
        const response = await axios.get(`${API_BASE_URL}/productos/destacados`);
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
  // Verifica si el id es numérico
  if (isNaN(id)) {
        throw new Error('ID de producto inválido');
    }

    try {
        // <<<<<<<<<<<< ESTA ES LA LÍNEA ES LA QUE ME DA PROBLEMAAAAS >>>>>>>>>>>>>
        const response = await axios.get(`${API_BASE_URL}/productos/${id}`, { // Usa API_BASE_URL
            timeout: 5000,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.id) {
            throw new Error('Producto no encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener producto:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url // Esto te dirá la URL exacta que Axios intentó
        });

        if (error.response?.status === 404) {
            throw new Error('Producto no encontrado');
        }

        throw new Error(error.response?.data?.message || 'Error al cargar el producto');
    }
};

//Veremos el funcionamiento en caso de deploy