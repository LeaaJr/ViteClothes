// Productos.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000/productos';

export const getProductos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {   
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

export const getProductosByCategoryAndSubcategory = async (category, subcategory) => {
    try {
        // Si tu backend acepta filtros por query params, este es el patrón:
        const response = await axios.get(`${API_URL}?categoria=${category}&subcategoria=${subcategory}`);
        return response.data;
        
        // Opción 2: Si prefieres hacerlo en el frontend (una vez que ya tienes todos los productos):
        // const allProducts = await getProductos();
        // return allProducts.filter(p => p.categoria.toLowerCase() === category.toLowerCase() && 
        //                               p.subcategoria.toLowerCase() === subcategory.toLowerCase());
    } catch (error) {
        console.error('Error al obtener productos por categoría y subcategoría:', error);
        throw error;
    }
};

export const updateProducto = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
};

export const addProducto = async (producto) => {
    try {
        const response = await axios.post(API_URL, producto);
        return response.data;
    } catch (error) {
        console.error('Error al agregar producto:', error);
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