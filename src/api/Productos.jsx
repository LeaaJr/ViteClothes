// Productos.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000/productos';


//esperando a que funcione en postman supuestamente
//probado y funcionando

export const getProductos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {   
        console.error('Error al obtener los productos:', error);
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