// SignIn.jsx
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
        login({ email: data.user });
        // Guardar sesión en localStorage
        localStorage.setItem('user', JSON.stringify({ email: data.user }));
        // Redirigir al home
        navigate('/');
      } else {
        alert(`❌ ${data.detail}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Sign in to your account</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Your email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Log in to your account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


//Datos de prueba:

/* {
  "email": "test@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "day": 15,
  "month": 5,
  "year": 1990,
  "acceptTerms": true
}

 */