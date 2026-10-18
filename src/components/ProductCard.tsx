import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  ShoppingCart, 
  Check, 
  Eye, 
  Star, 
  MapPin, 
  Zap, 
  Cpu, 
  Disc, 
  Wrench, 
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { whatsappService } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isInCart?: boolean;
  isOwnerMode?: boolean;
  onUpdateInventory?: (id: string, stock: number, price?: number) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isInCart = false,
  isOwnerMode = false,
  onUpdateInventory
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editStock, setEditStock] = useState(product.stockCount);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Synchronize when product price changes from props
  useEffect(() => {
    setEditPrice(product.price);
    setEditStock(product.stockCount);
  }, [product.price, product.stockCount]);

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={44} className="amazon-tool-icon text-amber-500" />;
      case 'Cpu': return <Cpu size={44} className="amazon-tool-icon text-amber-500" />;
      case 'Disc': return <Disc size={44} className="amazon-tool-icon text-amber-500" />;
      default: return <Wrench size={44} className="amazon-tool-icon text-amber-500" />;
    }
  };

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice 
    ? Math.round((discountAmount / product.originalPrice) * 100) 
    : 0;

  const isLowStock = product.stockCount <= 5;

  const handleSavePrice = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateInventory) return;

    try {
      setIsSaving(true);
      await onUpdateInventory(product.id, editStock, editPrice);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditingPrice(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to update product pricing:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`amazon-product-card ${isOwnerMode ? 'owner-mode-card' : ''}`}>
      {/* Top Tag & Deal Badge */}
      <div className="amazon-card-badges">
        {discountPercent > 0 ? (
          <span className="amazon-deal-badge">{discountPercent}% off &bull; Deal</span>
        ) : product.badge ? (
          <span className="amazon-seller-badge">{product.badge}</span>
        ) : (
          <span className="amazon-in-shop-badge">Genuine In-Shop Part</span>
        )}

        <span 
          className="amazon-brand-pill" 
          style={{ 
            color: product.brandColor || '#007185',
            borderColor: product.brandColor ? `${product.brandColor}40` : undefined
          }}
        >
          {product.brand}
        </span>
      </div>

      {/* Visual Image / Spec Container */}
      <div 
        className="amazon-card-image-box"
        onClick={() => onViewDetails(product)}
        title="Click to view detailed specifications"
      >
        {product.imageUrl && !imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="amazon-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="amazon-icon-frame">
            {getProductIcon(product.imageIcon)}
          </div>
        )}

        <span className="amazon-model-tag">Model: {product.modelNumber}</span>
        
        <button 
          className="amazon-quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          type="button"
        >
          <Eye size={13} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Details & Pricing */}
      <div className="amazon-card-body">
        {/* Title */}
        <h3 
          className="amazon-card-title"
          onClick={() => onViewDetails(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Compatibility Tag for Spare Parts & Accessories */}
        {product.compatibility && (
          <div className="amazon-compatibility-tag" title={product.compatibility}>
            <Wrench size={11} className="compat-icon" />
            <span className="compat-text">
              <strong className="compat-label">Fits:</strong> {product.compatibility}
            </span>
          </div>
        )}

        {/* Customer Ratings */}
        <div className="amazon-ratings-row">
          <div className="amazon-stars-group">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={13} 
                className={i < Math.floor(product.rating) ? 'star-gold-fill' : 'star-empty'} 
              />
            ))}
            <span className="rating-score-num">{product.rating}</span>
          </div>
          <span className="reviews-count-link">({product.reviewsCount})</span>
        </div>

        {/* Pricing Block with Owner Price Setting Trigger */}
        <div className="amazon-price-block">
          <div className="price-main-line">
            <span className="currency-small">₹</span>
            <span className="price-large">{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="mrp-strikethrough">
                M.R.P.: <del>₹{product.originalPrice.toLocaleString('en-IN')}</del>
              </span>
            )}

            {/* Owner Inline Edit Trigger */}
            {isOwnerMode && (
              <button
                type="button"
                className="owner-edit-price-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingPrice(!isEditingPrice);
                }}
                title="Himani's Price Control: Click to set your custom counter price"
              >
                <Edit3 size={11} />
                <span>Set Price</span>
              </button>
            )}
          </div>
          <span className="price-tax-note">Inclusive of all taxes &bull; ₹0 online fee</span>
        </div>

        {/* Inline Owner Price Setting Popover */}
        {isEditingPrice && (
          <div className="owner-inline-editor-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-editor-badge">
              <span>👑 Himani's Price Setting</span>
              <button 
                type="button"
                className="owner-editor-close"
                onClick={() => setIsEditingPrice(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="owner-editor-grid">
              <div className="owner-input-group">
                <label>Shop Price (₹):</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Math.max(1, Number(e.target.value)))}
                  className="owner-number-input"
                  min={1}
                />
              </div>
              <div className="owner-input-group">
                <label>Stock Count:</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Math.max(0, Number(e.target.value)))}
                  className="owner-number-input"
                  min={0}
                />
              </div>
            </div>

            {/* Quick Adjustment Pills */}
            <div className="owner-quick-pills">
              <button type="button" onClick={() => setEditPrice(p => Math.max(1, p - 50))}>-₹50</button>
              <button type="button" onClick={() => setEditPrice(p => p + 50)}>+₹50</button>
              <button type="button" onClick={() => setEditPrice(p => p + 100)}>+₹100</button>
              <button type="button" onClick={() => setEditPrice(p => p + 500)}>+₹500</button>
            </div>

            <div className="owner-editor-actions">
              <button 
                type="button" 
                className="owner-save-btn"
                onClick={handleSavePrice}
                disabled={isSaving}
              >
                {isSaving ? 'Updating...' : 'Save Price'}
              </button>
              <button 
                type="button" 
                className="owner-cancel-btn"
                onClick={() => setIsEditingPrice(false)}
              >
                Cancel
              </button>
            </div>

            {saveSuccess && (
              <div className="owner-success-badge">
                <CheckCircle2 size={12} /> Price updated to ₹{editPrice.toLocaleString('en-IN')}!
              </div>
            )}
          </div>
        )}

        {/* Crisp Stock Status & Location Tag */}
        <div className="amazon-stock-status-compact">
          {product.stockCount > 0 ? (
            isLowStock ? (
              <span className="stock-alert-low">Only {product.stockCount} left</span>
            ) : (
              <span className="stock-in-stock">In Stock ({product.stockCount})</span>
            )
          ) : (
            <span className="stock-out">Out of stock</span>
          )}
          <span className="pickup-tag-compact">Station Rd Counter</span>
        </div>

        {/* Clean, Sleek Action Buttons */}
        <div className="amazon-card-action-compact">
          <button
            className={`amazon-add-btn-compact ${isInCart ? 'in-cart' : ''}`}
            onClick={() => onAddToCart(product)}
            disabled={product.stockCount === 0}
            type="button"
          >
            {isInCart ? (
              <>
                <Check size={14} />
                <span>In Cart (+1)</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="amazon-whatsapp-hold-btn-compact"
            onClick={(e) => {
              e.stopPropagation();
              const url = whatsappService.getHoldItemUrl(product.name, product.modelNumber, product.price);
              window.open(url, '_blank');
            }}
            title="Inquire stock & hold on WhatsApp"
          >
            <MessageSquare size={13} />
            <span>Hold</span>
          </button>
        </div>
      </div>
    </div>
  );
};
