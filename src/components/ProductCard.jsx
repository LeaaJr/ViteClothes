import React from 'react'
import styles from '../style/ProductCard.module.css'
import { PlusIcon, BookmarkIcon } from 'lucide-react'

const ProductCard = ({
  id,
  imagen1,
  nombre,
  categoria,
  precio,
  descripcion,
  stock,
  currency = 'EUR',
}) => {
  // validacion de precio
  const validPrice = precio && !isNaN(precio) ? Number(precio) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={imagen1 || 'placeholder.jpg'} //Por si no hay inagen
          alt={nombre}
          className={styles.image}
        />
        <div className={styles.addButton}>
          <PlusIcon size={20} />
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.title}>
            {nombre}
            {descripcion && (
              <span className={styles.tooltip} data-tooltip={descripcion}>
               {/*  ℹ️ */}
              </span>
            )}
          </div>
          <div className={styles.price}>
            {validPrice.toFixed(2)} {currency}
          </div>
          {/*mostrar stock si se necesita */}
          {/* {stock !== undefined && (
            <div className={styles.stock}>Stock: {stock}</div>
          )} */}
        </div>
        <div className={styles.saveButton}>
          <BookmarkIcon size={16} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard;