import React, { useState } from 'react';
import styles from '../style/SignUp.module.css';
import { ChevronDownIcon } from 'lucide-react';


export function SignUp () {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    day: '',
    month: '',
    year: '',
    acceptTerms: false
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica para enviar el formulario
  };
  return (
    <div className={styles.wrapper}>
        <div className={styles.background} />
        <div className={styles.content}>
    <div className={styles.formContainer}>
      <div className={styles.logoContainer}>
      </div>
      <h1 className={styles.title}>Create your Free Account</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Your email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@company.com"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="@bonnie"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            className={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Birth Date</label>
          <div className={styles.dateInputs}>
            <div className={styles.selectWrapper}>
              <select 
                name="day" 
                value={formData.day} 
                onChange={handleChange} 
                className={styles.select}
                required
              >
                <option value="" disabled>Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <ChevronDownIcon className={styles.selectIcon} size={16} />
            </div>
            <div className={styles.selectWrapper}>
              <select 
                name="month" 
                value={formData.month} 
                onChange={handleChange} 
                className={styles.select}
                required
              >
                <option value="" disabled>Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <ChevronDownIcon className={styles.selectIcon} size={16} />
            </div>
            <div className={styles.selectWrapper}>
              <select 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                className={styles.select}
                required
              >
                <option value="" disabled>Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDownIcon className={styles.selectIcon} size={16} />
            </div>
          </div>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className={styles.checkbox}
            required
          />
          <label htmlFor="acceptTerms" className={styles.checkboxLabel}>
            I accept the <a href="#" className={styles.link}>Terms and Conditions</a>
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          Create an account
        </button>
      </form>
      <div className={styles.loginLink}>
        <a href="#" className={styles.link}>Already have an account?</a>
      </div>
    </div>
    </div>
    </div>
  );
}