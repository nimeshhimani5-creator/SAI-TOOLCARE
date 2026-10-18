import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { 
  MOCK_PRODUCTS, 
  SAMPLE_REPAIRS, 
  CATEGORIES 
} from './data/mockData';
import { 
  Product, 
  ProductCategory, 
  CartItem, 
  RepairJob, 
  UserProfile, 
  CounterOrder 
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductList } from './components/ProductList';
import { RepairSection } from './components/RepairSection';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { ShopInfo } from './components/ShopInfo';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { RepairModal } from './components/RepairModal';
import { TrackRepairModal } from './components/TrackRepairModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { TechnicianPortal } from './components/TechnicianPortal';
import { InvoiceModal } from './components/InvoiceModal';
import { Toast } from './components/Toast';
import { isFirebaseConfigured } from './services/firebase';
import { authService } from './services/authService';
import { productsService } from './services/productsService';
import { repairsService } from './services/repairsService';
import { ordersService } from './services/ordersService';
import { adminBackendService } from './services/adminBackendService';
import { Language } from './utils/translations';
import { InvoiceData } from './types';

export const App: React.FC = () => {
  // Real-Time Inventory & Products
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  
  // Real-Time Repairs Database
  const [repairDb, setRepairDb] = useState<{ [key: string]: RepairJob }>(SAMPLE_REPAIRS);

  // Real-Time Counter Orders & Reservations
  const [orders, setOrders] = useState<CounterOrder[]>([]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOwnerPricingMode, setIsOwnerPricingMode] = useState<boolean>(true);

  // Language State: English by default with option to convert into Hindi
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('toolcare_lang');
    if (saved === 'hi') return 'hi';
    return 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('toolcare_lang', lang);
  };

  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState('');

  // Staff Portals State
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isTechnicianPortalOpen, setIsTechnicianPortalOpen] = useState(false);

  
  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState<string>('REP-1001');

  // Billing & Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const handleOpenInvoice = (invoice?: InvoiceData) => {
    if (invoice) {
      setSelectedInvoice(invoice);
    }
    setIsInvoiceModalOpen(true);
  };


  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Subscribe to Live Firestore / Reactive Products
  useEffect(() => {
    const unsubscribe = productsService.subscribeToProducts((liveList) => {
      setProducts(liveList);
    });
    return () => unsubscribe?.();
  }, []);

  // 2. Subscribe to Live Firestore / Reactive Repair Tickets
  useEffect(() => {
    const unsubscribe = repairsService.subscribeToRepairs((liveRepairs) => {
      setRepairDb(liveRepairs);
    });
    return () => unsubscribe?.();
  }, []);

  // 3. Subscribe to Real-Time Auth State
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe?.();
  }, []);

  // 4. Subscribe to Real-Time Counter Reservation Orders
  useEffect(() => {
    const unsubscribe = ordersService.subscribeToOrders((liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsubscribe?.();
  }, []);


  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stockCount, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to counter reservation cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Submit Counter Reservation & Sync Stock in Real-Time
  const handleConfirmReservation = async (orderRef: string, customerName: string, phone: string) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );

    const newOrder: CounterOrder = {
      orderRef,
      items: [...cartItems],
      totalAmount,
      customerName,
      phone,
      status: 'pending_collection',
      createdAt: new Date().toISOString()
    };

    await ordersService.createReservationOrder(newOrder);
    showToast(`Order ${orderRef} reserved! Real-time stock updated across workshop.`);
  };

  // Repair request submission to Real-Time Database
  const handleRegisterRepair = async (newRepair: RepairJob) => {
    await repairsService.createRepairJob(newRepair);
    showToast(`Repair booking ${newRepair.referenceId} saved to database! Bring tool to shop counter.`);
  };

  // Inventory Stock & Custom Price Setting (Himani's Owner Controls)
  const handleUpdateInventory = async (productId: string, stock: number, price?: number) => {
    try {
      await adminBackendService.updateInventory(productId, stock, price);
      const targetProd = products.find(p => p.id === productId);
      const name = targetProd ? targetProd.name.split(' ').slice(0, 4).join(' ') : 'Product';
      showToast(`Updated ${name}: ${price ? `Price ₹${price.toLocaleString('en-IN')}` : ''} | Stock: ${stock} units`);
    } catch (err) {
      console.error('Failed to update inventory:', err);
      showToast('Error updating inventory item');
    }
  };

  const handleSwitchToOwner = async () => {
    try {
      const ownerUser = await authService.signInAsStaff('owner');
      setCurrentUser(ownerUser);
      setIsOwnerPricingMode(true);
      showToast('Switched to Himani (Owner) session. Pricing controls unlocked!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenTrackModalWithTicket = (ticketId?: string) => {
    if (ticketId) {
      setTrackTicketId(ticketId);
    }
    setIsTrackModalOpen(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute category item counts from live products list
  const categoryCounts = useMemo(() => {
    const counts: { [key in ProductCategory]?: number } = {
      all: products.length,
      'power-tools': 0,
      'spare-parts': 0,
      'accessories': 0
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]! += 1;
      }
    });
    return counts;
  }, [products]);

  const cartProductIds = useMemo(() => {
    return new Set(cartItems.map((item) => item.product.id));
  }, [cartItems]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pending_collection').length;
  }, [orders]);

  const activeRepairsCount = useMemo(() => {
    return Object.values(repairDb).filter((r) => r.status !== 'completed').length;
  }, [repairDb]);

  return (
    <div className="app-container">
      {/* 1. Header & Navigation with User Account and Real-time indicators */}
      <Navbar
        cartCount={totalCartCount}
        currentUser={currentUser}
        pendingOrdersCount={pendingOrdersCount}
        activeRepairsCount={activeRepairsCount}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRepairModal={() => setIsRepairModalOpen(true)}
        onOpenTrackModal={() => handleOpenTrackModalWithTicket()}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenTechnicianPortal={() => setIsTechnicianPortalOpen(true)}
        onOpenInvoice={() => handleOpenInvoice()}
        language={language}
        onLanguageChange={handleLanguageChange}
      />



      <main>
        {/* 2. Hero Presentation with Workshop Stats Banner */}
        <Hero
          onBrowseCatalog={scrollToCatalog}
          onOpenRepairModal={() => setIsRepairModalOpen(true)}
          onOpenTrackModal={(ticketId) => handleOpenTrackModalWithTicket(ticketId)}
          onSelectCategory={setSelectedCategory}
          language={language}
        />

        {/* 3. Category Filter Highlights with Modern Badges */}
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={categoryCounts}
          language={language}
        />

        {/* 4. Filterable & Searchable Live Product Grid */}
        <ProductList
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
          onViewDetails={(product) => setSelectedProduct(product)}
          cartProductIds={cartProductIds}
          currentUser={currentUser}
          onUpdateInventory={handleUpdateInventory}
          isOwnerPricingMode={isOwnerPricingMode}
          onToggleOwnerPricingMode={() => setIsOwnerPricingMode(!isOwnerPricingMode)}
          onSwitchToOwnerAccount={handleSwitchToOwner}
          language={language}
        />

        {/* 5. In-Shop Repair Services + Interactive Cost Estimator + Live Tracker */}
        <RepairSection
          onOpenRepairModal={() => setIsRepairModalOpen(true)}
          onOpenTrackModal={(ticketId) => handleOpenTrackModalWithTicket(ticketId)}
        />

        {/* 6. How In-Shop Collection Works */}
        <HowItWorks />

        {/* 7. Contractor & Carpenter Reviews */}
        <Testimonials />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />

        {/* 9. Store Counter Location & Working Hours */}
        <ShopInfo />
      </main>

      {/* 10. Footer with Approved Policies & Contact */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currentUser={currentUser}
        isOwnerMode={currentUser?.role === 'owner' || isOwnerPricingMode}
        onUpdateInventory={handleUpdateInventory}
      />

      <RepairModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        onSubmitRepair={handleRegisterRepair}
        onViewTracker={(ticketId) => handleOpenTrackModalWithTicket(ticketId)}
      />

      <TrackRepairModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        repairDatabase={repairDb}
        initialTicketId={trackTicketId}
        onOpenInvoice={handleOpenInvoice}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onConfirmReservation={handleConfirmReservation}
        onOpenInvoice={handleOpenInvoice}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.displayName}! (${user.role.toUpperCase()})`);
        }}
        onSignOut={() => {
          authService.signOut();
          setCurrentUser(null);
          showToast('You have signed out.');
        }}
      />

      {/* Staff Management Portals */}
      {currentUser && (
        <>
          <AdminPortal
            isOpen={isAdminPortalOpen}
            onClose={() => setIsAdminPortalOpen(false)}
            currentUser={currentUser}
            orders={orders}
            repairs={repairDb}
            products={products}
            onShowToast={showToast}
            onOpenInvoice={(inv) => {
              if (inv) setSelectedInvoice(inv);
              setIsInvoiceModalOpen(true);
            }}
          />

          <TechnicianPortal
            isOpen={isTechnicianPortalOpen}
            onClose={() => setIsTechnicianPortalOpen(false)}
            currentUser={currentUser}
            repairs={repairDb}
            onShowToast={showToast}
          />
        </>
      )}

      {/* Official Tax Invoice & Cash Bill Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        initialInvoice={selectedInvoice}
        orders={orders}
        repairs={repairDb}
        products={products}
        isOwner={currentUser?.role === 'owner'}
        onSaveNewInvoice={(newInv) => {
          showToast(`Bill ${newInv.invoiceNumber} created successfully!`);
        }}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default App;
