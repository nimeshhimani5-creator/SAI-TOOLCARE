import React, { useMemo, useState } from 'react';
import { Product, ProductCategory, UserProfile } from '../types';
import { ProductCard } from './ProductCard';
import { 
  PackageOpen, 
  X, 
  ShieldCheck, 
  Edit3, 
  SlidersHorizontal,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { Language, getTranslation } from '../utils/translations';

interface ProductListProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  cartProductIds: Set<string>;
  currentUser?: UserProfile | null;
  onUpdateInventory?: (id: string, stock: number, price?: number) => Promise<void>;
  isOwnerPricingMode?: boolean;
  onToggleOwnerPricingMode?: () => void;
  onSwitchToOwnerAccount?: () => void;
  language?: Language;
}

const BRANDS = ['All Brands', 'Bosch', 'Makita', 'DeWalt', 'Dongcheng', 'HiKOKI'];

export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onViewDetails,
  cartProductIds,
  currentUser,
  onUpdateInventory,
  isOwnerPricingMode = false,
  onToggleOwnerPricingMode,
  onSwitchToOwnerAccount,
  language = 'mr'
}) => {
  const [selectedBrand, setSelectedBrand] = useState('All Brands');

  const isOwner = currentUser?.role === 'owner' || isOwnerPricingMode;

  // Filter products based on active category, selected brand & search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = 
        selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesBrand = 
        selectedBrand === 'All Brands' || 
        product.brand.toLowerCase().includes(selectedBrand.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.modelNumber.toLowerCase().includes(query) ||
        (product.compatibility && product.compatibility.toLowerCase().includes(query)) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  return (
    <section id="catalog-section" className="amazon-catalog-section">
      <div className="container">


        {/* Amazon-Style Results Bar */}
        <div className="amazon-results-banner">
          <div className="results-left">
            <span className="results-count-text">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> official products &amp; spares
              {selectedCategory !== 'all' && (
                <span className="category-active-tag">
                  in {selectedCategory.replace('-', ' ').toUpperCase()}
                </span>
              )}
              {selectedBrand !== 'All Brands' && (
                <span className="brand-active-tag">
                  brand: {selectedBrand}
                </span>
              )}
              {searchQuery && (
                <span className="search-match-tag">
                  matching &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </span>
          </div>

          <div className="results-right">
            <div className="amazon-dept-pills">
              <button 
                className={`dept-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => onSelectCategory('all')}
              >
                All Departments
              </button>
              <button 
                className={`dept-pill ${selectedCategory === 'power-tools' ? 'active' : ''}`}
                onClick={() => onSelectCategory('power-tools')}
              >
                Power Tools
              </button>
              <button 
                className={`dept-pill ${selectedCategory === 'spare-parts' ? 'active' : ''}`}
                onClick={() => onSelectCategory('spare-parts')}
              >
                100% Copper Spares
              </button>
              <button 
                className={`dept-pill ${selectedCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => onSelectCategory('accessories')}
              >
                Blades &amp; Bits
              </button>
            </div>

            {searchQuery && (
              <button 
                className="amazon-clear-search-btn"
                onClick={() => onSearchChange('')}
              >
                <X size={14} />
                <span>Clear search</span>
              </button>
            )}
          </div>
        </div>

        {/* Brand Filter Horizontal Row */}
        <div className="amazon-brand-chips-row">
          <span className="brand-chips-label">Filter by Brand:</span>
          <div className="brand-chips-list">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`brand-chip-btn ${selectedBrand === brand ? 'active' : ''}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Separated Products Shelf */}
        <div className="amazon-shelf-container">
          <div className="shelf-header">
            <div>
              <h2 className="shelf-title">
                {selectedCategory === 'power-tools' 
                  ? 'Heavy-Duty Power Tools for Metal Fabrication & Masonry'
                  : selectedCategory === 'spare-parts'
                  ? 'Pure Copper Armatures, Stator Field Coils & Precision Spares'
                  : selectedCategory === 'accessories'
                  ? 'Laser Turbo Diamond Blades, Carbide Bits & High-RPM Bearings'
                  : selectedBrand !== 'All Brands'
                  ? `Official ${selectedBrand} Power Tools & Certified Replacement Parts`
                  : 'Popular Tools & Replacement Spares Stocked at Workshop'}
              </h2>
              <p className="shelf-subtitle">
                Reserve online with ₹0 advance &bull; Inspect and bench-test machine live at Station Road counter before payment.
              </p>
            </div>
            <div className="shelf-guarantee-badge">
              <ShieldCheck size={16} className="text-amber-500" />
              <span>100% Genuine Copper &bull; In-Shop Load Test</span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="amazon-empty-results">
              <PackageOpen size={48} className="text-gray-400" />
              <h3>No products found matching your search.</h3>
              <p>Try clearing your brand filter or search query to see all workshop stock.</p>
              <button 
                className="amazon-reset-btn"
                onClick={() => {
                  onSearchChange('');
                  setSelectedBrand('All Brands');
                  onSelectCategory('all');
                }}
              >
                Show All 29 Products
              </button>
            </div>
          ) : (
            <div className="amazon-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isInCart={cartProductIds.has(product.id)}
                  isOwnerMode={isOwner}
                  onUpdateInventory={onUpdateInventory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
