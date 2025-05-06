import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../style/FilterBar.module.css';

export const FilterBar = () => {
  const [priceRange, setPriceRange] = useState({
    min: 300,
    max: 3500,
  });
  const [salesRange, setSalesRange] = useState({
    min: 1,
    max: 100,
  });
  const [selectedCategories, setSelectedCategories] = useState([
    'Gaming',
    'Electronics',
  ]);
  const [state, setState] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleSalesChange = (type, value) => {
    setSalesRange((prev) => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleReset = () => {
    setPriceRange({
      min: 300,
      max: 3500,
    });
    setSalesRange({
      min: 1,
      max: 100,
    });
    setSelectedCategories(['Gaming', 'Electronics']);
    setState('All');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button 
        className={`${styles.sidebarToggle} ${isSidebarOpen ? styles.hidden : ''}`}
        onClick={toggleSidebar}
      >
        <ChevronRight size={24} />
      </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
          <ChevronLeft size={24} />
        </button>
        
        <div className={styles.filterPanel}>
          <h2 className={styles.filterTitle}>Filter</h2>
          
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Price Range</h3>
            <div className={styles.sliderContainer}>
              <div className={styles.sliderTrack}>
                <div
                  className={styles.sliderFill}
                  style={{
                    left: `${(priceRange.min / 5000) * 100}%`,
                    width: `${((priceRange.max - priceRange.min) / 5000) * 100}%`,
                  }}
                ></div>
                <div
                  className={styles.sliderHandle}
                  style={{
                    left: `${(priceRange.min / 5000) * 100}%`,
                  }}
                ></div>
                <div
                  className={styles.sliderHandle}
                  style={{
                    left: `${(priceRange.max / 5000) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
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
          
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Category</h3>
            <div className={styles.categoryGrid}>
              {[
                'Jackets',
                'Shirts',
                'T-shirts',
                'Pants',
                'Sneakers',
                'Accessories',
              ].map((category) => (
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
          
          <div className={styles.actionButtons}>
            <button className={styles.showResultsButton}>
              Show 32 Results
            </button>
            <button 
            className={styles.sidebarToggle} 
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
          </div>
        </div>
      </div>
    </>
  );
};