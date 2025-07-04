// src/interface/AdminProductListPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';
// Import the CSS module
import styles from '../style/AdminProductListPage.module.css'; // Adjust path if necessary

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
            const response = await axios.get(`${API_BASE_URL}/productos/`);
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
            // Apply the loadingContainer class
            <div className={styles.loadingContainer}>
                <CircularProgress />
                <Typography variant="h6" style={{ marginLeft: '10px' }}>Loading products...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            // Apply the errorContainer class
            <div className={styles.errorContainer}>
                <Typography variant="h6">{error}</Typography>
            </div>
        );
    }

    return (
        // Apply the container class
        <div className={styles.container}>
            <Typography variant="h4" component="h2" gutterBottom className={styles.title}>
                Admin Product List
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin/add-product')}
                className={styles.addButton} // Apply the addButton class
            >
                Add New Product
            </Button>

            {/* Apply the tableContainer class to Paper to enable horizontal scroll */}
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {/* Apply tableHeadCell class to all TableCell in TableHead */}
                            <TableCell className={styles.tableHeadCell}>ID</TableCell>
                            <TableCell className={styles.tableHeadCell}>Name</TableCell>
                            <TableCell className={styles.tableHeadCell}>Price</TableCell>
                            <TableCell className={styles.tableHeadCell}>Category</TableCell>
                            <TableCell className={styles.tableHeadCell}>Stock</TableCell>
                            <TableCell align="right" className={styles.tableHeadCell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* Apply tableBodyCell class to all TableCell in TableBody */}
                                <TableCell component="th" scope="row" className={styles.tableBodyCell}>
                                    {product.id}
                                </TableCell>
                                <TableCell className={styles.tableBodyCell}>{product.nombre}</TableCell>
                                <TableCell className={styles.tableBodyCell}>€{product.precio.toFixed(2)}</TableCell>
                                <TableCell className={styles.tableBodyCell}>{product.categoria}</TableCell>
                                <TableCell className={styles.tableBodyCell}>{product.stock}</TableCell>
                                <TableCell align="right" className={`${styles.tableBodyCell} ${styles.actionButtons}`}>
                                    <Link to={`/admin/edit-product/${product.id}`} style={{ textDecoration: 'none' }}>
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