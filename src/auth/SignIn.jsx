import React from 'react';
import styles from '../style/SignIn.module.css';


export const SignIn = () => {
  return (
    <div className={styles.wrapper}>
    <div className={styles.background} />
    <div className={styles.content}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
          </div>
          <h1 className={styles.title}>Sign in to your account</h1>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Your email</label>
              <input 
                type="email" 
                id="email" 
                className={styles.input} 
                placeholder="name@company.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input 
                type="password" 
                id="password" 
                className={styles.input} 
                placeholder="••••••••"
              />
            </div>
            <div className={styles.optionsRow}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" className={styles.checkbox} />
                <label htmlFor="remember" className={styles.checkboxLabel}>Remember me</label>
              </div>
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>
            <button type="submit" className={styles.loginButton}>
              Log in to your account
            </button>
            <div className={styles.signupLink}>
              <span>Don't have an account?</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};