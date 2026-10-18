import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  FileText, 
  QrCode, 
  Search, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Calendar, 
  User,
  Clock
} from 'lucide-react';
import { InvoiceData, InvoiceItem, Product, CounterOrder, RepairJob } from '../types';
import { SHOP_INFO } from '../data/mockData';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInvoice?: InvoiceData | null;
  orders?: CounterOrder[];
  repairs?: { [key: string]: RepairJob };
  products?: Product[];
  onSaveNewInvoice?: (invoice: InvoiceData) => void;
  isOwner?: boolean;
}

// Convert numbers to Indian English Words for invoice formality
function numberToWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Rupees Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertBelowHundred(n: number): string {
    if (n < 20) return units[n];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
  }

  function convertBelowThousand(n: number): string {
    if (n < 100) return convertBelowHundred(n);
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertBelowHundred(n % 100) : '');
  }

  let words = '';
  let rem = rounded;

  if (Math.floor(rem / 10000000) > 0) {
    words += convertBelowHundred(Math.floor(rem / 10000000)) + ' Crore ';
    rem %= 10000000;
  }
  if (Math.floor(rem / 100000) > 0) {
    words += convertBelowHundred(Math.floor(rem / 100000)) + ' Lakh ';
    rem %= 100000;
  }
  if (Math.floor(rem / 1000) > 0) {
    words += convertBelowHundred(Math.floor(rem / 1000)) + ' Thousand ';
    rem %= 1000;
  }
  if (rem > 0) {
    words += convertBelowThousand(rem);
  }

  return words.trim() + ' Rupees Only';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  initialInvoice = null,
  orders = [],
  repairs = {},
  products = [],
  onSaveNewInvoice,
  isOwner = false
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'lookup'>('view');
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(initialInvoice);
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  // Quick POS Billing Form state (for Himani / shop counter)
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash on Counter' | 'UPI Counter' | 'Due at Collection'>('UPI Counter');
  const [posBillType, setPosBillType] = useState<'retail' | 'repair' | 'pos_quick'>('retail');
  const [posItems, setPosItems] = useState<InvoiceItem[]>([
    { description: 'Bosch 100mm Pure Copper Armature GWS 600', brand: 'Bosch Genuine', quantity: 1, unitPrice: 650, total: 650 }
  ]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');

  // Sync initial invoice when prop changes
  React.useEffect(() => {
    if (initialInvoice) {
      setCurrentInvoice(initialInvoice);
      setActiveTab('view');
    } else if (!currentInvoice && orders.length > 0) {
      // Default to latest order if available
      const latest = orders[0];
      setCurrentInvoice({
        invoiceNumber: `INV-${latest.orderRef.replace('ORD-', '')}`,
        orderRef: latest.orderRef,
        date: new Date(latest.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: latest.customerName,
        customerPhone: latest.phone,
        items: latest.items.map((i) => ({
          description: i.product.name,
          brand: i.product.brand,
          quantity: i.quantity,
          unitPrice: i.product.price,
          total: i.product.price * i.quantity
        })),
        subtotal: latest.totalAmount,
        totalAmount: latest.totalAmount,
        paymentMethod: latest.paymentMethod === 'cash' ? 'Cash on Counter' : 'UPI Counter',
        paymentStatus: latest.status === 'collected' ? 'PAID' : 'RESERVED',
        billType: 'retail'
      });
    }
  }, [initialInvoice, orders]);

  if (!isOpen) return null;

  // Print invoice function
  const handlePrint = () => {
    window.print();
  };

  // Add item in Quick POS Billing
  const handleAddPosProduct = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setPosItems((prev) => [
      ...prev,
      {
        description: prod.name,
        brand: prod.brand,
        quantity: 1,
        unitPrice: prod.price,
        total: prod.price
      }
    ]);
    setSelectedProductToAdd('');
  };

  const handleAddCustomPosItem = () => {
    setPosItems((prev) => [
      ...prev,
      {
        description: 'Workshop Service / Custom Spare',
        brand: 'Om Sai Certified',
        quantity: 1,
        unitPrice: 200,
        total: 200
      }
    ]);
  };

  const handleUpdatePosItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setPosItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        item.total = Number(item.quantity) * Number(item.unitPrice);
      }
      next[index] = item;
      return next;
    });
  };

  const handleRemovePosItem = (index: number) => {
    setPosItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate POS Bill
  const handleGeneratePosBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posCustomerName.trim() || posItems.length === 0) {
      alert('Please enter customer name and at least one item.');
      return;
    }

    const subtotal = posItems.reduce((acc, i) => acc + i.total, 0);
    const invoiceNum = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

    const newInvoice: InvoiceData = {
      invoiceNumber: invoiceNum,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim() || '+91 80774 66755',
      items: posItems,
      subtotal,
      totalAmount: subtotal,
      paymentMethod: posPaymentMethod,
      paymentStatus: posPaymentMethod === 'Due at Collection' ? 'DUE' : 'PAID',
      billType: posBillType
    };

    setCurrentInvoice(newInvoice);
    onSaveNewInvoice?.(newInvoice);
    setActiveTab('view');
  };

  // Search by reference or phone
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Search orders
    const matchedOrder = orders.find(
      (o) => o.orderRef.toLowerCase().includes(q) || o.phone.includes(q) || o.customerName.toLowerCase().includes(q)
    );

    if (matchedOrder) {
      setCurrentInvoice({
        invoiceNumber: `INV-${matchedOrder.orderRef.replace('ORD-', '')}`,
        orderRef: matchedOrder.orderRef,
        date: new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: matchedOrder.customerName,
        customerPhone: matchedOrder.phone,
        items: matchedOrder.items.map((i) => ({
          description: i.product.name,
          brand: i.product.brand,
          quantity: i.quantity,
          unitPrice: i.product.price,
          total: i.product.price * i.quantity
        })),
        subtotal: matchedOrder.totalAmount,
        totalAmount: matchedOrder.totalAmount,
        paymentMethod: matchedOrder.paymentMethod === 'cash' ? 'Cash on Counter' : 'UPI Counter',
        paymentStatus: matchedOrder.status === 'collected' ? 'PAID' : 'RESERVED',
        billType: 'retail'
      });
      setLookupMessage(null);
      setActiveTab('view');
      return;
    }

    // Search repairs
    const matchedRepair = Object.values(repairs).find(
      (r) => r.referenceId.toLowerCase().includes(q) || r.phone.includes(q) || r.customerName.toLowerCase().includes(q)
    );

    if (matchedRepair) {
      const cost = matchedRepair.estimatedCost || 650;
      setCurrentInvoice({
        invoiceNumber: `INV-${matchedRepair.referenceId.replace('REP-', 'R')}`,
        ticketId: matchedRepair.referenceId,
        date: matchedRepair.submittedAt,
        customerName: matchedRepair.customerName,
        customerPhone: matchedRepair.phone,
        items: [
          {
            description: `Tool Overhaul & Diagnostic: ${matchedRepair.toolType} (${matchedRepair.brandModel})`,
            brand: 'Workshop Service',
            quantity: 1,
            unitPrice: Math.round(cost * 0.4),
            total: Math.round(cost * 0.4)
          },
          {
            description: `Spares & Copper Rewinding: ${matchedRepair.issueDescription.slice(0, 40)}`,
            brand: 'Genuine Spares',
            quantity: 1,
            unitPrice: cost - Math.round(cost * 0.4),
            total: cost - Math.round(cost * 0.4)
          }
        ],
        subtotal: cost,
        totalAmount: cost,
        paymentMethod: 'UPI / Cash Counter',
        paymentStatus: matchedRepair.status === 'completed' ? 'PAID' : 'DUE',
        billType: 'repair',
        technicianName: matchedRepair.technicianName || 'Certified Technician'
      });
      setLookupMessage(null);
      setActiveTab('view');
      return;
    }

    setLookupMessage(`No invoice found for "${searchQuery}". Please check the phone number or order reference.`);
  };

  // WhatsApp share link
  const getWhatsAppShareLink = () => {
    if (!currentInvoice) return '';
    const text = `*OM SAI POWER TOOLS AND REPAIRING CENTER*
*Tax Invoice / Cash Bill:* ${currentInvoice.invoiceNumber}
*Customer:* ${currentInvoice.customerName}
*Date:* ${currentInvoice.date}
*Total Amount:* ₹${currentInvoice.totalAmount.toLocaleString('en-IN')}
*Status:* ${currentInvoice.paymentStatus} (${currentInvoice.paymentMethod})
*Shop Contact:* +91 80774 66755
*Address:* Station Road, Opp. Bus Depot`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const invoice = currentInvoice || {
    invoiceNumber: 'INV-2026-8812',
    date: '18 Oct 2026, 01:00 PM',
    customerName: 'Walk-in Counter Customer',
    customerPhone: '+91 80774 66755',
    items: [
      { description: 'Bosch 100mm Heavy-Duty Angle Grinder GWS 600', brand: 'Bosch', quantity: 1, unitPrice: 2450, total: 2450 },
      { description: 'Pure Copper Armature Rotor 5-Teeth', brand: 'Sai Genuine', quantity: 1, unitPrice: 650, total: 650 }
    ],
    subtotal: 3100,
    totalAmount: 3100,
    paymentMethod: 'UPI Counter',
    paymentStatus: 'PAID' as const,
    billType: 'retail' as const
  };

  return (
    <div className="modal-overlay invoice-modal-overlay" onClick={onClose}>
      <div 
        className="invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (Screen Only) */}
        <div className="invoice-screen-bar no-print">
          <div className="invoice-nav-tabs">
            <button 
              className={`invoice-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              <FileText size={16} />
              <span>Invoice Receipt</span>
            </button>
            <button 
              className={`invoice-tab-btn ${activeTab === 'lookup' ? 'active' : ''}`}
              onClick={() => setActiveTab('lookup')}
            >
              <Search size={16} />
              <span>Find Bill</span>
            </button>
            {(isOwner || onSaveNewInvoice) && (
              <button 
                className={`invoice-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <Plus size={16} />
                <span>+ Create Quick Bill</span>
              </button>
            )}
          </div>

          <div className="invoice-actions-right">
            {activeTab === 'view' && (
              <>
                <button 
                  className="btn btn-sm btn-print" 
                  onClick={handlePrint}
                  title="Print paper bill / Save PDF"
                >
                  <Printer size={15} />
                  <span>Print Bill</span>
                </button>
                <a 
                  href={getWhatsAppShareLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-share-wa"
                  title="Share bill on WhatsApp"
                >
                  <Share2 size={15} />
                  <span>WhatsApp</span>
                </a>
              </>
            )}
            <button className="invoice-close-btn" onClick={onClose} aria-label="Close invoice">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* TAB 1: LOOKUP BILL */}
        {activeTab === 'lookup' && (
          <div className="invoice-lookup-pane no-print">
            <h4 className="lookup-title">Search Past Invoices &amp; Receipts</h4>
            <p className="lookup-sub">Enter your 10-digit mobile number, Order ID (e.g. ORD-1001), or Repair Ticket (e.g. REP-1001)</p>
            <form onSubmit={handleLookup} className="lookup-form">
              <input 
                type="text"
                placeholder="Phone or Reference (e.g. 8077466755 or ORD-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input lookup-input"
                autoFocus
              />
              <button type="submit" className="btn btn-primary lookup-submit">
                <Search size={16} />
                <span>Search</span>
              </button>
            </form>
            {lookupMessage && (
              <div className="lookup-error-msg">{lookupMessage}</div>
            )}
            <div className="lookup-samples">
              <span>Quick Samples:</span>
              <button type="button" onClick={() => { setSearchQuery('8077466755'); }}>8077466755</button>
              <button type="button" onClick={() => { setSearchQuery('REP-1001'); }}>REP-1001</button>
              {orders[0] && (
                <button type="button" onClick={() => { setSearchQuery(orders[0].orderRef); }}>{orders[0].orderRef}</button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE QUICK BILL (Owner / Staff POS) */}
        {activeTab === 'create' && (
          <div className="invoice-create-pane no-print">
            <div className="create-pane-header">
              <h4>Quick Counter Billing / POS Generator</h4>
              <p>Issue an instant retail cash memo or repair service bill for walk-in customers.</p>
            </div>

            <form onSubmit={handleGeneratePosBill} className="create-bill-form">
              <div className="create-grid-2">
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Customer Name (e.g. Rajesh Kumar)"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="10-digit Mobile (e.g. 8077466755)"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="create-grid-2 mt-2">
                <div className="form-group">
                  <label className="form-label">Bill Category</label>
                  <select 
                    className="form-input"
                    value={posBillType}
                    onChange={(e) => setPosBillType(e.target.value as any)}
                  >
                    <option value="retail">Retail Spares &amp; Tools Sale</option>
                    <option value="repair">Workshop Repair &amp; Service</option>
                    <option value="pos_quick">Quick Counter Cash Memo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select 
                    className="form-input"
                    value={posPaymentMethod}
                    onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                  >
                    <option value="UPI Counter">UPI QR Scan (@8077466755)</option>
                    <option value="Cash on Counter">Cash at Counter</option>
                    <option value="Due at Collection">Payment Due on Pickup</option>
                  </select>
                </div>
              </div>

              {/* Add item selector */}
              <div className="pos-item-adder-row mt-3">
                <select 
                  className="form-input pos-product-select"
                  value={selectedProductToAdd}
                  onChange={(e) => setSelectedProductToAdd(e.target.value)}
                >
                  <option value="">-- Quick Pick from Store Inventory --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="btn btn-outline-dark"
                  onClick={() => selectedProductToAdd && handleAddPosProduct(selectedProductToAdd)}
                >
                  + Add Product
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleAddCustomPosItem}
                >
                  + Custom Line
                </button>
              </div>

              {/* Items Table in Create Mode */}
              <div className="pos-items-table-wrapper mt-3">
                <table className="pos-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style={{ width: '80px' }}>Qty</th>
                      <th style={{ width: '110px' }}>Rate (₹)</th>
                      <th style={{ width: '100px' }}>Total (₹)</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {posItems.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <input 
                            type="text" 
                            className="form-input table-inline-input"
                            value={item.description}
                            onChange={(e) => handleUpdatePosItem(idx, 'description', e.target.value)}
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            min="1"
                            className="form-input table-inline-input text-center"
                            value={item.quantity}
                            onChange={(e) => handleUpdatePosItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            min="0"
                            className="form-input table-inline-input text-right"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdatePosItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="text-right font-bold">
                          ₹{item.total.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="table-del-btn"
                            onClick={() => handleRemovePosItem(idx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pos-summary-bar mt-3">
                <div className="pos-grand-total">
                  <span>Grand Total:</span>
                  <strong>₹{posItems.reduce((acc, i) => acc + i.total, 0).toLocaleString('en-IN')}</strong>
                </div>
                <button type="submit" className="btn btn-primary btn-generate-bill">
                  <CheckCircle2 size={16} />
                  <span>Generate Official Bill &amp; Print</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: THE PRINTABLE TAX INVOICE / CASH MEMO */}
        {activeTab === 'view' && (
          <div className="printable-invoice-sheet" id="printable-bill-area">
            {/* INVOICE HEADER */}
            <div className="invoice-header-clean">
              <div className="invoice-brand-block">
                <div className="invoice-shop-name">OM SAI POWER TOOLS</div>
                <div className="invoice-shop-sub">&amp; REPAIRING CENTER</div>
                <div className="invoice-shop-tagline">Authorized Power Tools Sales, 100% Pure Copper Armatures &amp; Genuine Spares</div>
                <div className="invoice-shop-address">
                  <MapPin size={11} className="inline-icon" />
                  <span>Station Road, Opp. Bus Depot, Industrial Zone</span>
                </div>
                <div className="invoice-shop-phone">
                  <Phone size={11} className="inline-icon" />
                  <span>Contact: <strong>+91 80774 66755</strong> • Founder: Himani</span>
                </div>
              </div>

              <div className="invoice-meta-block">
                <div className="tax-invoice-title">
                  {invoice.billType === 'repair' ? 'REPAIR SERVICE INVOICE' : 'RETAIL CASH MEMO'}
                </div>
                <div className="invoice-meta-grid">
                  <div className="meta-pair">
                    <span className="meta-k">Invoice No:</span>
                    <span className="meta-v font-bold">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-k">Date &amp; Time:</span>
                    <span className="meta-v">{invoice.date}</span>
                  </div>
                  {invoice.orderRef && (
                    <div className="meta-pair">
                      <span className="meta-k">Order Ref:</span>
                      <span className="meta-v">{invoice.orderRef}</span>
                    </div>
                  )}
                  {invoice.ticketId && (
                    <div className="meta-pair">
                      <span className="meta-k">Job Ticket:</span>
                      <span className="meta-v">{invoice.ticketId}</span>
                    </div>
                  )}
                  <div className="meta-pair">
                    <span className="meta-k">Payment:</span>
                    <span className={`meta-v status-pill-${invoice.paymentStatus.toLowerCase()}`}>
                      {invoice.paymentStatus} ({invoice.paymentMethod})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-separator" />

            {/* CUSTOMER DETAILS */}
            <div className="invoice-customer-strip">
              <div className="customer-info-box">
                <span className="strip-title">Billed To (Customer):</span>
                <div className="customer-name-big">{invoice.customerName}</div>
                <div className="customer-phone-val">Phone: {invoice.customerPhone}</div>
              </div>
              <div className="workshop-counter-box">
                <span className="strip-title">Workshop Settle Desk:</span>
                <div className="counter-name">Station Road Counter Settle</div>
                <div className="counter-upi">UPI: 8077466755@okaxis</div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '55%' }}>Item Description / Genuine Part</th>
                  <th style={{ width: '15%' }} className="text-center">Brand</th>
                  <th style={{ width: '8%' }} className="text-center">Qty</th>
                  <th style={{ width: '17%' }} className="text-right">Rate (₹)</th>
                  <th style={{ width: '15%' }} className="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="table-item-desc">{item.description}</div>
                    </td>
                    <td className="text-center">
                      <span className="item-brand-tag">{item.brand || 'Genuine'}</span>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="text-right font-bold">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS & IN WORDS */}
            <div className="invoice-bottom-grid">
              <div className="invoice-words-side">
                <div className="amount-words-card">
                  <span className="words-label">Amount in Words:</span>
                  <div className="words-content">{numberToWords(invoice.totalAmount)}</div>
                </div>

                <div className="invoice-terms-card">
                  <div className="terms-heading">
                    <ShieldCheck size={13} className="terms-icon" />
                    <span>Quality Guarantee &amp; Warranty Policy:</span>
                  </div>
                  <ul>
                    <li>100% Genuine Certified Spares &amp; Pure Copper Wire Windings.</li>
                    <li>Load bench testing conducted in front of customer prior to release.</li>
                    <li>6-Month Workshop Warranty on all rewound motors and armatures.</li>
                  </ul>
                </div>
              </div>

              <div className="invoice-calculation-side">
                <div className="calc-row">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="calc-row">
                  <span>Handling &amp; Testing:</span>
                  <span className="text-success font-semibold">FREE (Shop Counter)</span>
                </div>
                <div className="calc-divider" />
                <div className="calc-total-row">
                  <span>Grand Total:</span>
                  <span className="calc-total-amt">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="calc-paid-badge">
                  <span>Status: </span>
                  <strong>{invoice.paymentStatus === 'PAID' ? '✓ FULLY PAID' : '⏳ DUE AT COUNTER'}</strong>
                </div>
              </div>
            </div>

            {/* SIGNATURE & FOOTER */}
            <div className="invoice-signature-row">
              <div className="sig-block">
                <div className="sig-line" />
                <span className="sig-label">Customer Signature</span>
              </div>
              <div className="sig-stamp-block">
                <div className="seal-graphic">
                  <div className="seal-text-circle">OM SAI POWER TOOLS</div>
                  <div className="seal-inner">CERTIFIED</div>
                </div>
                <div className="sig-line" />
                <span className="sig-label">Authorized Signatory (Himani)</span>
              </div>
            </div>

            <div className="invoice-footer-legal">
              <span>Thank you for trusting Om Sai Power Tools &amp; Repairing Center • Station Road, Opp. Bus Depot • Helpline: +91 80774 66755</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
