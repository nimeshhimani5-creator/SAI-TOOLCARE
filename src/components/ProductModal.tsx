import React, { useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { 
  X, 
  ShoppingCart, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Star, 
  Zap, 
  Cpu, 
  Disc, 
  Wrench,
  ShieldCheck,
  Crown,
  Edit3
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currentUser?: UserProfile | null;
  isOwnerMode?: boolean;
  onUpdateInventory?: (id: string, stock: number, price?: number) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  currentUser,
  isOwnerMode = false,
  onUpdateInventory
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [modalPrice, setModalPrice] = useState(product?.price || 0);
  const [modalStock, setModalStock] = useState(product?.stockCount || 0);
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [priceSaveMessage, setPriceSaveMessage] = useState<string | null>(null);

  const isOwner = currentUser?.role === 'owner' || isOwnerMode;

  useEffect(() => {
    if (product) {
      setModalPrice(product.price);
      setModalStock(product.stockCount);
      setImgError(false);
      setPriceSaveMessage(null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleSaveModalPrice = async () => {
    if (!onUpdateInventory) return;
    try {
      setIsSavingPrice(true);
      await onUpdateInventory(product.id, modalStock, modalPrice);
      setPriceSaveMessage(`Price successfully updated to ₹${modalPrice.toLocaleString('en-IN')}`);
      setTimeout(() => {
        setPriceSaveMessage(null);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingPrice(false);
    }
  };

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={56} className="modal-svg-icon text-amber-500" />;
      case 'Cpu': return <Cpu size={56} className="modal-svg-icon text-amber-500" />;
      case 'Disc': return <Disc size={56} className="modal-svg-icon text-amber-500" />;
      default: return <Wrench size={56} className="modal-svg-icon text-amber-500" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content product-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: `${product.brandColor || '#005691'}15`,
                color: product.brandColor || '#005691',
                borderColor: `${product.brandColor || '#005691'}40`,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              {product.brand}
            </span>
            <h3 className="modal-title">{product.name}</h3>
            <span className="modal-model">Model: {product.modelNumber}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Visual Showcase */}
          <div className="modal-visual-row">
            <div className="modal-icon-box">
              {product.imageUrl && !imgError ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="modal-product-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                getProductIcon(product.imageIcon)
              )}
            </div>
            
            <div className="modal-pricing-box">
              <div className="modal-price">
                <span className="price-val">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="price-orig">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="stock-info-row">
                <span className={`stock-dot ${product.stockCount > 0 ? 'in-stock' : 'out-of-stock'}`} />
                <span>
                  {product.stockCount > 0 
                    ? `In Stock (${product.stockCount} units available at Station Road counter)` 
                    : 'Temporarily out of stock'}
                </span>
              </div>
              <div className="shop-pickup-banner">
                <MapPin size={16} className="pickup-banner-icon" />
                <div>
                  <strong>In-Shop Counter Pickup &bull; ₹0 Online Advance</strong>
                  <p>Reserve online, inspect & test-run machine live at counter before payment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Himani's Owner Pricing Control Panel */}
          {isOwner && (
            <div className="modal-owner-panel">
              <div className="owner-panel-heading">
                <Crown size={15} className="text-amber-600" />
                <strong>Himani's Owner Price Control (Decide Custom Price)</strong>
              </div>
              <div className="owner-panel-fields">
                <div className="owner-field-item">
                  <label>Selling Price (₹):</label>
                  <input
                    type="number"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(Math.max(1, Number(e.target.value)))}
                    min={1}
                    className="modal-owner-input"
                  />
                </div>
                <div className="owner-field-item">
                  <label>Counter Stock Units:</label>
                  <input
                    type="number"
                    value={modalStock}
                    onChange={(e) => setModalStock(Math.max(0, Number(e.target.value)))}
                    min={0}
                    className="modal-owner-input"
                  />
                </div>
                <button
                  type="button"
                  className="btn-modal-owner-save"
                  onClick={handleSaveModalPrice}
                  disabled={isSavingPrice}
                >
                  {isSavingPrice ? 'Saving...' : '💾 Update Counter Price'}
                </button>
              </div>

              {priceSaveMessage && (
                <div className="modal-owner-success">
                  <CheckCircle2 size={13} /> {priceSaveMessage}
                </div>
              )}
            </div>
          )}

          {/* Compatibility Details */}
          {product.compatibility && (
            <div className="modal-compat-box">
              <div className="modal-compat-head">
                <Wrench size={16} className="text-blue-600" />
                <strong>Direct Machine Compatibility &amp; Fitment</strong>
              </div>
              <p className="modal-compat-body">{product.compatibility}</p>
            </div>
          )}

          {/* Description */}
          <div className="modal-section">
            <h4 className="modal-section-title">Description</h4>
            <p className="modal-desc-text">{product.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="modal-section">
            <h4 className="modal-section-title">Technical Specifications &amp; Quality Guarantee</h4>
            <div className="specs-table">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="spec-row">
                  <span className="spec-key">{key}</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart Action */}
          <div className="modal-action-row">
            <div className="quantity-control">
              <button 
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                disabled={quantity >= product.stockCount}
              >
                +
              </button>
            </div>

            <button 
              className="btn btn-primary modal-add-btn"
              onClick={handleAdd}
              disabled={product.stockCount === 0}
            >
              <ShoppingCart size={18} />
              <span>Reserve in Counter Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
