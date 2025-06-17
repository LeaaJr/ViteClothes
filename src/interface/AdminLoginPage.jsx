// src/interface/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import styles from '../style/AdminLoginPage.module.css'; 
import logolm from '../style/logos/lmw.png';
import { useAuth } from '../auth/AuthContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ show: false, severity: '', message: '' });
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, severity: '', message: '' });

        try {
            // Intentar logear con el AuthContext
            const success = await login(email, password);

            if (success) {
                // Si el login fue exitoso, redirigir al formulario de admin
                navigate('/admin/add-product');
            } else {
                // Esto no debería ejecutarse si login lanza un error, pero es un fallback
                setAlert({ show: true, severity: 'error', message: 'Credenciales inválidas.' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error en el servidor. Inténtalo de nuevo.';
            setAlert({ show: true, severity: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.formSection} style={{ flex: 'none', maxWidth: '400px', margin: 'auto' }}>
                <div className={styles.logo}>
                    <img src={logolm} alt="Logo" />
                </div>
                <h2 className={styles.title}>ADMIN LOGIN</h2>

                {alert.show && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, show: false })}
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="admin-email" className={styles.label}>E-MAIL</label>
                        <input
                            type="email"
                            id="admin-email"
                            className={styles.input}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="admin-password" className={styles.label}>PASSWORD</label>
                        <input
                            type="password"
                            id="admin-password"
                            className={styles.input}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Saque el enlace de "Forgot password" ya que es un login admin simplificado */}
                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? 'Logging In...' : 'LOG IN AS ADMIN'}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default AdminLoginPage;