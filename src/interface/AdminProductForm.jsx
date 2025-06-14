/* AdminProductForm.jsx */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminProductForm = () => {
    const navigate = useNavigate();

    // Estado que tiene los datos del formulario
const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    stock: '',
    img1: '',
    img2: '',
    img3: '',
    talles: {},
    destacado: false, // Default to false
    tendencia: false  // Default to false
});

    // Estado de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estado de alertas de MUI Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Esto es para manejar los cambios en la entrada del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Manejar cambios específicamente para tamaños (entrada dinámica)
    const handleSizeChange = (size, stock) => {
        setFormData(prevData => ({
            ...prevData,
            talles: {
                ...prevData.talles,
                [size]: parseInt(stock, 10) || 0
            }
        }));
    };

    // Agregar un nuevo campo de entrada de tamaño
    const addSizeField = () => {
        setFormData(prevData => ({
            ...prevData,
            // Utilizo una clave única como 'newSize_N' para evitar problemas
            talles: {
                ...prevData.talles,
                [`newSize_${Object.keys(prevData.talles).length}`]: 0 
            }
        }));
    };

    // Eliminar un campo de entrada de tamaño
    const removeSizeField = (sizeToRemove) => {
        setFormData(prevData => {
            const newTalles = { ...prevData.talles };
            delete newTalles[sizeToRemove];
            return {
                ...prevData,
                talles: newTalles
            };
        });
    };

    // Manejar el envío del formulario
 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setOpenSnackbar(false); // Cerrar cualquier snackbar existente

    try {
        // Preparar los datos del producto
        const productData = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock, 10),
            img1: formData.img1 || null,
            img2: formData.img2 || null,
            img3: formData.img3 || null,
            talles: Object.fromEntries(
                Object.entries(formData.talles).filter(([size, stock]) => size.startsWith('newSize_') ? stock > 0 : true)
            )
        };

        const response = await axios.post(`${API_BASE_URL}/productos`, productData);

        setSuccess('Product added successfully!');
        setSnackbarMessage('Product added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Opcionalmente, restablezca el formulario o navegue
        setFormData({
            nombre: '',
            precio: '',
            descripcion: '',
            categoria: '',
            subcategoria: '',
            stock: '',
            img1: '',
            img2: '',
            img3: '',
            destacado: false,
            tendencia: false,
            talles: {}
        });
        // browse('/productos'); // Descomentar para redirigir después del éxito
    } catch (err) {
        console.error('Error adding product:', err.response?.data || err.message);

        // Mover estas líneas dentro del bloque catch
        setError(err.response?.data?.detail || 'Failed to add product.');
        setSnackbarMessage(err.response?.data?.detail || 'Failed to add product.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    } finally {
        setLoading(false);
    }
};

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div className="admin-product-form-container" style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Product Name:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Price (€):</label>
                    <input type="number" name="precio" value={formData.precio} onChange={handleChange} step="0.01" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Stock:</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }}></textarea>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
                    <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Subcategory:</label>
                    <input type="text" name="subcategoria" value={formData.subcategoria} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Image URL 1:</label>
                    <input type="url" name="img1" value={formData.img1} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Image URL 2:</label>
                    <input type="url" name="img2" value={formData.img2} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Image URL 3:</label>
                    <input type="url" name="img3" value={formData.img3} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '8px' }} />
                </div>

                {/* New fields for destacado and tendencia */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                    <input 
                        type="checkbox" 
                        name="destacado" 
                        checked={formData.destacado} 
                        onChange={(e) => setFormData(prevData => ({ ...prevData, destacado: e.target.checked }))} 
                        id="destacado"
                    />
                    <label htmlFor="destacado">Is Featured?</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                    <input 
                        type="checkbox" 
                        name="tendencia" 
                        checked={formData.tendencia} 
                        onChange={(e) => setFormData(prevData => ({ ...prevData, tendencia: e.target.checked }))} 
                        id="tendencia"
                    />
                    <label htmlFor="tendencia">Is Trending?</label>
                </div>
                
                {/* Dynamic Size Inputs */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <h3 style={{ marginTop: '0' }}>Sizes and Stock</h3>
                    {Object.entries(formData.talles).map(([size, stock]) => (
                        <div key={size} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={size.startsWith('newSize_') ? '' : size} // Borrar clave temporal para visualización
                                onChange={(e) => {
                                    const oldSize = size;
                                    const newSize = e.target.value;
                                    setFormData(prevData => {
                                        const newTalles = {};
                                        // Vuelva a agregar los tamaños existentes, pero reemplace la clave temporal anterior con el nuevo tamaño definido por el usuario
                                        Object.entries(prevData.talles).forEach(([key, val]) => {
                                            if (key === oldSize) {
                                                newTalles[newSize] = val; // Asignar el stock actual al nuevo nombre de tamaño
                                            } else {
                                                newTalles[key] = val;
                                            }
                                        });
                                        return { ...prevData, talles: newTalles };
                                    });
                                }}
                                placeholder="Size (e.g., S, M, L)"
                                style={{ flex: 1, padding: '8px' }}
                            />
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => handleSizeChange(size, e.target.value)}
                                placeholder="Stock"
                                style={{ width: '80px', padding: '8px' }}
                            />
                            <button type="button" onClick={() => removeSizeField(size)} style={{ background: 'salmon', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSizeField} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer', marginTop: '10px' }}>Add Size</button>
                </div>

                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>

            {/* Snackbar para mensajes de éxito/error */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AdminProductForm;