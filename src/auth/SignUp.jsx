import React, { useState } from 'react';
import styles from '../style/SignUp.module.css';
import { ChevronDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    privacyPolicy: false,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!formData.privacyPolicy) {
      setError("Debes aceptar la política de privacidad");
      return;
    }

    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          name: formData.name,
          surname: formData.surname,
          acceptTerms: formData.privacyPolicy
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en el registro");
      }

      alert("Usuario creado exitosamente");
      // Redirigir a Home después de 1 segundo (para que se vea el alert)
      setTimeout(() => {
        navigate('/'); // Asumiendo que '/' es la ruta de Home
      }, 1000);

      // Limpiar el formulario
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        privacyPolicy: false,
      });

      alert("Usuario creado exitosamente");
      // Redirigir o limpiar el formulario
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        privacyPolicy: false,
      });

    } catch (error) {
      console.error("Error en el registro:", error);
      setError(error.message || "Ocurrió un error durante el registro");
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.logo}>LOGO</div>
        <h2 className={styles.title}>PERSONAL DATA</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-MAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>CONFIRM PASSWORD</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>NAME</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="surname" className={styles.label}>SURNAME</label>
            <input
              type="text"
              id="surname"
              name="surname"
              className={styles.input}
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="privacyPolicy"
              name="privacyPolicy"
              className={styles.checkbox}
              checked={formData.privacyPolicy}
              onChange={handleChange}
              required
            />
            <label htmlFor="privacyPolicy" className={styles.checkboxLabel}>
              I have read and understood the <span className={styles.link}>Privacy and Cookie Policy</span>
            </label>
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>

      <div
        className={styles.imageSection}
        style={{ backgroundImage: `url('https://static.zara.net/assets/public/06ea/2796/673d4e18bd14/fcf0c8366205/image-desktop-94190a8f-74ad-468b-9cec-31ed9517ee39-default/image-desktop-94190a8f-74ad-468b-9cec-31ed9517ee39-default.jpg?ts=1746186312208&w=1582')` }}
      ></div>
    </div>
  );
}
