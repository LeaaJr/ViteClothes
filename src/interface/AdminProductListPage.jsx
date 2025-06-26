// src/interface/AdminProductListPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/productos/`); // Assuming this endpoint lists all products
            setProducts(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching products:", err.response?.data || err.message);
            setError('Failed to load products. Please try again.');
            setSnackbarMessage('Failed to load products.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                // You'll need a backend endpoint for DELETE /productos/:id
                await axios.delete(`${API_BASE_URL}/productos/${productId}`);
                setSnackbarMessage('Product deleted successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchProducts(); // Re-fetch products to update the list
            } catch (err) {
                console.error("Error deleting product:", err.response?.data || err.message);
                setSnackbarMessage('Failed to delete product.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" style={{ marginLeft: '10px' }}>Loading products...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <Typography variant="h6">{error}</Typography>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Admin Product List
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/admin/add-product')} 
                style={{ marginBottom: '20px' }}
            >
                Add New Product
            </Button>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>€{product.precio.toFixed(2)}</TableCell>
                                <TableCell>{product.categoria}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell align="right">
                                    <Link to={`/admin/edit-product/${product.id}`} style={{ textDecoration: 'none', marginRight: '10px' }}>
                                        <Button variant="outlined" color="info" size="small">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        size="small" 
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AdminProductListPage;