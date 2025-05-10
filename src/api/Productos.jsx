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

export const getProductosByCategoryAndSubcategory = async (categoria, subcategoria = null) => {
  const params = new URLSearchParams();
  if (categoria) params.append('categoria', categoria);
  if (subcategoria) params.append('subcategoria', subcategoria);

  const response = await axios.get(`${API_URL}?${params.toString()}`); // ✅ CORRECTO
  return response.data;
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