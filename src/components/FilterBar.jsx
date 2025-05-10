import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../style/FilterBar.module.css';

export const FilterBar = ({ onFilterChange, subcategorias = [] }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [state, setState] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    onFilterChange({ priceRange, selectedCategories, state });
  }, [priceRange, selectedCategories, state]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <button 
        className={`${styles.sidebarToggle} ${isSidebarOpen ? styles.hidden : ''}`}
        onClick={toggleSidebar}
      >
        <ChevronRight size={24} style={{backgroundColor:"#333"}} />
      </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
          <ChevronLeft size={24} />
        </button>
        
        <div className={styles.filterPanel}>
          <h2 className={styles.filterTitle}>Filter</h2>
          
          {/* Price Range */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Price Range</h3>
            <div className={styles.rangeInputs}>
              <div className={styles.rangeInput}>
                <label>From</label>
                <input
                  type="text"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
              </div>
              <div className={styles.rangeInput}>
                <label>To</label>
                <input
                  type="text"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Category</h3>
            <div className={styles.categoryGrid}>
            {subcategorias?.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategories.includes(category) ? styles.selected : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>State</h3>
            <div className={styles.radioGroup}>
              {['All', 'New', 'Refurbished'].map((option) => (
                <label key={option} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="state"
                    value={option}
                    checked={state === option}
                    onChange={() => setState(option)}
                  />
                  <span className={styles.radioText}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
