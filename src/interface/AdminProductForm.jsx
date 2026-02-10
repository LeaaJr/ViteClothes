/* AdminProductForm.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Definir talles disponibles
    const TALLES_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const TALLES_CALZADO = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

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
        destacado: false,
        tendencia: false
    });

    // Estado de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estado de alertas de MUI Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch product data if ID exists (for editing)
    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/productos/${id}`)
                .then(response => {
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
                });
        }
    }, [id]);

    // Manejar los cambios en la entrada del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Toggle de talle (activar/desactivar)
    const handleSizeToggle = (sizeName) => {
        setFormData(prevData => {
            const newTalles = { ...prevData.talles };
            if (newTalles.hasOwnProperty(sizeName)) {
                // Si existe, lo eliminamos
                delete newTalles[sizeName];
            } else {
                // Si no existe, lo agregamos con stock 0
                newTalles[sizeName] = 0;
            }
            return { ...prevData, talles: newTalles };
        });
    };

    // Cambiar stock de un talle específico
    const handleSizeStockChange = (sizeName, newStock) => {
        setFormData(prevData => ({
            ...prevData,
            talles: {
                ...prevData.talles,
                [sizeName]: parseInt(newStock, 10) || 0
            }
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setOpenSnackbar(false);

        try {
            const productData = {
                ...formData,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock, 10),
                img1: formData.img1 || null,
                img2: formData.img2 || null,
                img3: formData.img3 || null,
                talles: formData.talles
            };

            let response;
            if (id) {
                response = await axios.put(`${API_BASE_URL}/productos/${id}`, productData);
                setSuccess('Product updated successfully!');
                setSnackbarMessage('Product updated successfully!');
            } else {
                response = await axios.post(`${API_BASE_URL}/productos`, productData);
                setSuccess('Product added successfully!');
                setSnackbarMessage('Product added successfully!');
            }
            
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            if (!id) {
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

                {/* Checkboxes para destacado y tendencia */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                    <input 
                        type="checkbox" 
                        name="destacado" 
                        checked={formData.destacado} 
                        onChange={handleChange}
                        id="destacado"
                    />
                    <label htmlFor="destacado">Is Featured?</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                    <input 
                        type="checkbox" 
                        name="tendencia" 
                        checked={formData.tendencia} 
                        onChange={handleChange}
                        id="tendencia"
                    />
                    <label htmlFor="tendencia">Is Trending?</label>
                </div>
                
                {/* Nueva sección de talles con checkboxes */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <h3 style={{ marginTop: '0', marginBottom: '15px' }}>Sizes and Stock</h3>
                    
                    {/* Talles de Ropa */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '10px', color: '#555' }}>Clothing Sizes</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                            {TALLES_ROPA.map(size => (
                                <div 
                                    key={size} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        background: formData.talles.hasOwnProperty(size) ? '#e3f2fd' : '#f9f9f9'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`size-${size}`}
                                        checked={formData.talles.hasOwnProperty(size)}
                                        onChange={() => handleSizeToggle(size)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label 
                                        htmlFor={`size-${size}`} 
                                        style={{ 
                                            fontWeight: '500', 
                                            minWidth: '30px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {size}
                                    </label>
                                    {formData.talles.hasOwnProperty(size) && (
                                        <input
                                            type="number"
                                            value={formData.talles[size]}
                                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                                            placeholder="Stock"
                                            min="0"
                                            style={{ 
                                                width: '70px', 
                                                padding: '4px 8px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Talles de Calzado */}
                    <div>
                        <h4 style={{ marginBottom: '10px', color: '#555' }}>Shoe Sizes</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                            {TALLES_CALZADO.map(size => (
                                <div 
                                    key={size} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        background: formData.talles.hasOwnProperty(size) ? '#e3f2fd' : '#f9f9f9'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`size-${size}`}
                                        checked={formData.talles.hasOwnProperty(size)}
                                        onChange={() => handleSizeToggle(size)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label 
                                        htmlFor={`size-${size}`} 
                                        style={{ 
                                            fontWeight: '500', 
                                            minWidth: '30px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {size}
                                    </label>
                                    {formData.talles.hasOwnProperty(size) && (
                                        <input
                                            type="number"
                                            value={formData.talles[size]}
                                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                                            placeholder="Stock"
                                            min="0"
                                            style={{ 
                                                width: '70px', 
                                                padding: '4px 8px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            padding: '10px 20px', 
                            fontSize: '16px', 
                            background: loading ? '#ccc' : '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        {loading ? 'Processing...' : (id ? 'Update Product' : 'Add Product')}
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