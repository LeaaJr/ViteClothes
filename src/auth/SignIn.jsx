import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/SignIn.module.css';
import { useAuth } from '../auth/AuthContext';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        alert(`✅ ${data.message}`);
        // Aquí usamos los datos completos del usuario que ahora viene del backend
        login(data.user); // Pasamos el objeto user completo al contexto
        navigate('/');
      } else {
        alert(`❌ ${data.detail}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('❌ Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.logo}>(LOGO)</div>
        <h2 className={styles.title}>LOG IN</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              E-MAIL
            </label>
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
            <label htmlFor="password" className={styles.label}>
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="#" className={styles.forgotPassword}>
            Forgot your password?
          </a>
          <button type="submit" className={styles.loginButton}>
            LOG IN
          </button>
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