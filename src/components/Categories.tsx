import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { ProductCategory } from '../types';
import { Wrench, Zap, Cpu, Disc, Sparkles } from 'lucide-react';
import { Language, getTranslation } from '../utils/translations';

interface CategoriesProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  productCounts: { [key in ProductCategory]?: number };
  language?: Language;
}

export const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts,
  language = 'en'
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={22} />;
      case 'Cpu': return <Cpu size={22} />;
      case 'Disc': return <Disc size={22} />;
      default: return <Wrench size={22} />;
    }
  };

  const getCategoryTitle = (id: string, defaultName: string) => {
    switch (id) {
      case 'all': return getTranslation('cat_all', language);
      case 'power-tools': return getTranslation('cat_power_tools', language);
      case 'spare-parts': return getTranslation('cat_spare_parts', language);
      case 'accessories': return getTranslation('cat_accessories', language);
      default: return defaultName;
    }
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header-compact text-center">
          <h2 className="section-title">
            {language === 'hi' ? 'कैटेगरी के अनुसार चुनें' : 'Shop by Category'}
          </h2>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = productCounts[cat.id as ProductCategory] || 0;

            return (
              <div
                key={cat.id}
                className={`category-card-modern ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id as ProductCategory)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCategory(cat.id as ProductCategory);
                  }
                }}
              >
                <div className="cat-card-top">
                  <div className="category-icon-wrapper">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  {count > 0 && (
                    <span className="cat-count-tag">
                      {count} {language === 'hi' ? 'उपलब्ध' : 'in stock'}
                    </span>
                  )}
                </div>

                <div className="category-info">
                  <h3 className="category-name">{getCategoryTitle(cat.id, cat.name)}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
