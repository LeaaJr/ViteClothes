/* AdminProductForm.jsx */
import React, { useState, useEffect } from 'react'; // Import useEffect
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { Snackbar, Alert } from '@mui/material';

// API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from URL (e.g., /admin/edit-product/123)

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

    // --- NEW: Fetch product data if ID exists (for editing) ---
    useEffect(() => {
        if (id) { // Only fetch if 'id' is present in the URL
            setLoading(true);
            axios.get(`${API_BASE_URL}/productos/${id}`)
                .then(response => {
                    // When fetching, talles might be null, ensure it's an object
                    const fetchedData = {
                        ...response.data,
                        talles: response.data.talles || {}
                    };
                    setFormData(fetchedData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching product for edit:', err.response?.data || err.message);
                    setSnackbarMessage('Error loading product data for editing.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                    setLoading(false);
                    // Optionally redirect if product not found or error
                    // navigate('/admin/products-list'); 
                });
        }
    }, [id]); // Re-run effect if ID changes

    // Esto es para manejar los cambios en la entrada del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; // Added type and checked for checkboxes
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value // Handle checkboxes correctly
        }));
    };

    // Manejar cambios específicamente para tamaños (entrada dinámica)
    const handleSizeChange = (sizeKey, newValue) => { // 'sizeKey' is the current key in formData.talles
        setFormData(prevData => ({
            ...prevData,
            talles: {
                ...prevData.talles,
                [sizeKey]: parseInt(newValue, 10) || 0 // Ensure stock is an integer
            }
        }));
    };
    
    // Update size key when user types in the size name input
    const handleSizeNameChange = (oldSizeKey, newSizeName) => {
        setFormData(prevData => {
            const newTalles = {};
            Object.entries(prevData.talles).forEach(([key, value]) => {
                if (key === oldSizeKey) {
                    newTalles[newSizeName] = value; // Assign old stock to new size name
                } else {
                    newTalles[key] = value;
                }
            });
            return { ...prevData, talles: newTalles };
        });
    };

    // Agregar un nuevo campo de entrada de tamaño
    const addSizeField = () => {
        setFormData(prevData => {
            const newKey = `newSize_${Object.keys(prevData.talles).length}_${Date.now()}`; // More robust unique key
            return {
                ...prevData,
                talles: {
                    ...prevData.talles,
                    [newKey]: 0 
                }
            };
        });
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
                // Clean up 'newSize_' temporary keys and only keep valid sizes
                talles: Object.fromEntries(
                    Object.entries(formData.talles)
                          .filter(([sizeName, stockValue]) => sizeName && sizeName.trim() !== '') // Remove empty size names
                          .map(([sizeName, stockValue]) => [
                              sizeName.startsWith('newSize_') ? '' : sizeName, // Remove temp prefix for submission
                              parseInt(stockValue, 10) || 0
                          ])
                          .filter(([sizeName, stockValue]) => sizeName && sizeName.trim() !== '') // Ensure size name is not empty after potential cleanup
                )
            };

            let response;
            if (id) {
                // If ID exists, it's an update (PUT)
                response = await axios.put(`${API_BASE_URL}/productos/${id}`, productData);
                setSuccess('Product updated successfully!');
                setSnackbarMessage('Product updated successfully!');
            } else {
                // Otherwise, it's a new product (POST)
                response = await axios.post(`${API_BASE_URL}/productos`, productData);
                setSuccess('Product added successfully!');
                setSnackbarMessage('Product added successfully!');
            }
            
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Opcionalmente, restablezca el formulario o navegue
            if (!id) { // Only clear form if it was a new product addition
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
            }
            // navigate('/productos'); // Descomentar para redirigir después del éxito (considerar dónde quieres redirigir)
        } catch (err) {
            console.error('Error processing product:', err.response?.data || err.message);

            setError(err.response?.data?.detail || 'Failed to process product.');
            setSnackbarMessage(err.response?.data?.detail || 'Failed to process product.');
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
            {/* Dynamic Title */}
            <h2>{id ? 'Edit Product' : 'Add New Product'}</h2> 
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
                        onChange={handleChange} // Use common handleChange for checkboxes too
                        id="destacado"
                    />
                    <label htmlFor="destacado">Is Featured?</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                    <input 
                        type="checkbox" 
                        name="tendencia" 
                        checked={formData.tendencia} 
                        onChange={handleChange} // Use common handleChange for checkboxes too
                        id="tendencia"
                    />
                    <label htmlFor="tendencia">Is Trending?</label>
                </div>
                
                {/* Dynamic Size Inputs */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <h3 style={{ marginTop: '0' }}>Sizes and Stock</h3>
                    {Object.entries(formData.talles).map(([sizeKey, stockValue]) => (
                        <div key={sizeKey} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={sizeKey.startsWith('newSize_') ? '' : sizeKey} // Clear temporary key for display
                                onChange={(e) => handleSizeNameChange(sizeKey, e.target.value)} // New handler for size name
                                placeholder="Size (e.g., S, M, L)"
                                style={{ flex: 1, padding: '8px' }}
                            />
                            <input
                                type="number"
                                value={stockValue} // Use stockValue from map directly
                                onChange={(e) => handleSizeChange(sizeKey, e.target.value)} // Use sizeKey to update correct entry
                                placeholder="Stock"
                                style={{ width: '80px', padding: '8px' }}
                            />
                            <button type="button" onClick={() => removeSizeField(sizeKey)} style={{ background: 'salmon', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSizeField} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer', marginTop: '10px' }}>Add Size</button>
                </div>

                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {loading ? 'Processing...' : (id ? 'Update Product' : 'Add Product')} {/* Dynamic button text */}
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