import React, { useState } from 'react'
import { HeartIcon, ShoppingCartIcon, MapPinIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import styles from '../style/ProductDetail.module.css'


export function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  // Mock product images
  const productImages = [
    'https://uploadthingy.s3.us-west-1.amazonaws.com/x7ZPgMEbroMiJwvf55KEBX/Sin_titulo.png',
    'https://uploadthingy.s3.us-west-1.amazonaws.com/x7ZPgMEbroMiJwvf55KEBX/Sin_titulo.png',
    'https://uploadthingy.s3.us-west-1.amazonaws.com/x7ZPgMEbroMiJwvf55KEBX/Sin_titulo.png',
    'https://uploadthingy.s3.us-west-1.amazonaws.com/x7ZPgMEbroMiJwvf55KEBX/Sin_titulo.png',
  ]
  return (
    <div className={styles.container}>
      <div className={styles.gallery}>
        <div className={styles.thumbnails}>
          {productImages.map((image, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.mainImage}>
          <img src={productImages[selectedImage]} alt="Apple iMac 24 inch" />
        </div>
      </div>
      <div className={styles.details}>
        <h1 className={styles.title}>
          Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM
        </h1>
        <div className={styles.badge}>the last 2 products</div>
        <div className={styles.reviews}>
          <div className={styles.stars}>★★★★★</div>
          <div className={styles.reviewCount}>345 Reviews</div>
        </div>
        <div className={styles.location}>
          <MapPinIcon
            size={16}
            style={{
              marginRight: '0.5rem',
            }}
          />
          Deliver to Bonnie Green- Sacramento 23647
        </div>
        <div className={styles.price}>$1,249.99</div>
        <div className={styles.quantitySelector}>
          <span className={styles.quantityLabel}>Quantity</span>
          <select
            className={styles.quantitySelect}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button className={`${styles.button} ${styles.favoriteButton}`}>
          <HeartIcon
            size={18}
            style={{
              marginRight: '0.5rem',
            }}
          />
          Add to favorites
        </button>
        <button className={`${styles.button} ${styles.cartButton}`}>
          <ShoppingCartIcon
            size={18}
            style={{
              marginRight: '0.5rem',
            }}
          />
          Add to cart
        </button>
        <p className={styles.infoText}>
          Also available at competitive prices from{' '}
          <span className={styles.link}>authorized retailers</span>, with
          optional Premium delivery for expedited shipping.
        </p>
        
        <div className={styles.accordion}>
          <div
            className={styles.accordionHeader}
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <span>Product Details</span>
            {isDetailsOpen ? (
              <ChevronUpIcon size={20} />
            ) : (
              <ChevronDownIcon size={20} />
            )}
          </div>
          {isDetailsOpen && (
            <div className={styles.accordionContent}>
              <p>
                The product is a high-quality, durable solution designed to meet
                the needs of modern consumers. It features advanced technology
                and ergonomic design for optimal performance and comfort.
              </p>
              <br />
              <p>
                Key features include a sleek interface, customizable settings,
                and compatibility with various devices. It is ideal for
                professionals and enthusiasts alike.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
