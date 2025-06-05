import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/SignIn.module.css';
import logolm from '../style/logos/lmw.png'
import { useAuth } from '../auth/AuthContext';
import { Alert } from '@mui/material';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ show: true, message: `✅ ${data.message}`, severity: 'success' });
        login(data.user); // Guardar usuario en contexto

        // Opcional: esto hace esperar un segundo msa para mostrar la alerta antes de navegar
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setAlert({ show: true, message: `❌ ${data.detail}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setAlert({ show: true, message: '❌ Error al conectar con el servidor', severity: 'error' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.logo}>
           <img src={logolm} alt="Logo" />
        </div>
        <h2 className={styles.title}>LOG IN</h2>

        {/* Alerta condicional */}
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
            <label htmlFor="email" className={styles.label}>E-MAIL</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>PASSWORD</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
          <button type="submit" className={styles.loginButton}>LOG IN</button>
        </form>
      </div>
      <div className={styles.imageSection}>
        <img
          src="https://static.zara.net/assets/public/f4a2/db52/cce048cbbde5/d6ba2d463363/image-desktop-398a24e0-3e15-48a2-bfec-82a6211fb5ad-default/image-desktop-398a24e0-3e15-48a2-bfec-82a6211fb5ad-default.jpg?ts=1746186282702&w=736"
          alt="ZARA fashion model"
          className={styles.fashionImage}
        />
      </div>
    </div>
  );
};
