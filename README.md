# Om Sai Power Tools & Repairing Center (Sai ToolCare) — Full System Documentation

A comprehensive, production-ready web application and real-time backend for **Om Sai Power Tools & Repairing Center**, engineered based on the approved specifications in [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).

---

## ⚡ System Architecture & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite 8** | Modern reactive UI, typed models, responsive industrial styling |
| **Icons & Design Tokens** | **Lucide React + Custom Industrial CSS** | High-contrast industrial palette, dark slate staff modals, status badges |
| **Cloud Database** | **Firebase Firestore** | Real-time listeners on `/products`, `/repairs`, `/orders`, and `/users` |
| **Authentication** | **Firebase Auth + Local Reactive Engine** | Role-based RBAC (`owner`, `technician`, `customer`) with 1-click test accounts |
| **File / Photo Storage** | **Firebase Storage** | Tool inspection photo uploads with restrictive file-type/size security rules |
| **Trusted Backend** | **Firebase Cloud Functions (TypeScript)** | Server-side triggers, 48-hour reservation expiration, counter settlement, status alerts |
| **Dual-Mode Engine** | **Cloud + Reactive Multi-Tab Fallback** | Instant multi-tab synchronization (`BroadcastChannel` + `LocalStorage`) ensures 100% functionality with or without cloud API keys |
| **Payment Model** | **In-Shop Counter Settlement Only** | **Online payment gateways excluded.** Orders are ₹0 online reservations settled physically at the Station Road counter via Cash or Shop UPI QR upon testing |

---

## 🛠️ Complete Backend Modules & Services

### 1. Cloud Functions Backend (`functions/src/index.ts`)
- **`onOrderCreated` (Firestore Trigger):**
  - Triggers on new counter reservations.
  - Automatically calculates and enforces a **48-hour expiration window** (`expiresAt`).
  - Records workshop collection slip and simulated SMS customer notification.
- **`expirePendingOrders` (Scheduled Cron Job):**
  - Sweeps pending orders where `now >= expiresAt` (48 hours elapsed).
  - Automatically transitions order status to `cancelled` with reason `48_hour_pickup_window_expired`.
  - Atomically increments and restores reserved quantities back into `/products` catalog inventory!
- **`markOrderCollected` (Trusted Callable Function):**
  - Verifies caller has `owner` or `technician` role in `/users/{uid}`.
  - Confirms counter inspection and payment via `cash` or `upi_counter`.
  - Timestamps collection and logs staff ID for audit records.
- **`onRepairStatusChanged` (Firestore Trigger):**
  - Detects repair ticket state transitions.
  - Generates instant customer pickup alerts (SMS / WhatsApp log) when tool reaches `ready_for_collection`.
- **`assignTechnicianToRepair` (Callable Function):**
  - Allows shop owner to allocate jobs to certified technicians.
- **`submitDiagnosticEstimate` (Callable Function):**
  - Allows technicians to record bench findings, required spare parts, and cost quotes.
- **`updateInventoryStock` (Callable Function):**
  - Restricts stock count and price adjustments to authenticated shop owners.

---

### 2. Security Rules & Database Indexes
- **`firestore.rules`:**
  - Role-based permissions enforcing public read for products, customer read for own tickets, and staff-only access for order fulfillment and stock edits.
- **`storage.rules`:**
  - Limits file uploads to JPEG/PNG/WebP under 5MB for tool inspection photos.
- **`firestore.indexes.json`:**
  - Compound indexes for `repairs` (`status` + `submittedAt`, `technicianName` + `submittedAt`) and `orders` (`status` + `createdAt`).

---

### 3. Client Real-Time Services (`src/services/`)
- **`adminBackendService.ts`:**
  - Consolidated interface for staff actions (settling orders, restocking, running 48h sweeps, assigning technicians, submitting diagnostics, updating prices).
  - Real-time workshop operational metrics calculation (revenue, active repairs, pending reservations, low-stock warnings).
- **`ordersService.ts`:**
  - Real-time order subscriptions, counter reservation creation, 48h expiry checking, and stock-restoring cancellations.
- **`repairsService.ts`:**
  - Real-time repair ticket booking, technician allocation, diagnostic quote submissions, and 7-stage status timeline sync.
- **`productsService.ts`:**
  - Real-time catalog subscription, stock decrements on reservation, stock increments on cancellation, and inline inventory editing.
- **`authService.ts`:**
  - Role management with 1-click test accounts for **Owner** (`Himani (Owner & Founder)`), **Technician** (`Sachin Patil`), and **Customer** (`Ramesh Contractor`).

---

## 🖥️ Staff Management Portals

### 1. Workshop Owner Management Portal (`AdminPortal.tsx`)
Accessible when signed in as `owner` (`himani.owner@saitoolcare.com`):
- **Live Workshop KPIs:** Total counter cash/UPI revenue collected, pending 48h reservations value, active bench repairs, and low-stock items count.
- **Counter Collections Tab:**
  - Search and filter all orders (`pending_collection`, `collected`, `cancelled`).
  - 1-Click Counter Settlement: **"Paid Cash"** or **"Paid UPI QR"**.
  - **"Paid & Cancel"** button that immediately returns reserved units to inventory stock.
  - **"Run 48-Hr Auto-Cancel Sweep"** button for manual expiration audits.
- **Repairs Queue Tab:**
  - View all workshop repair tickets.
  - Dropdown to assign certified technicians (*Ramesh Sharma*, *Suresh Patil*, *Dinesh Raut*).
  - Quick stage progression buttons.
- **Inventory & Stock Manager Tab:**
  - Live stock count for all power tools, genuine copper armatures, and blades.
  - Low-stock visual alert badges ($\le 5$ units).
  - Inline `+1`, `-1`, and price/stock edit controls.

### 2. Technician Bench & Diagnostics Portal (`TechnicianPortal.tsx`)
Accessible when signed in as `technician` (`ramesh.tech@toolcare.local`):
- **Queue Filter:** Toggle between "My Assigned Jobs" and "All Workshop Jobs".
- **Bench Diagnostic Form:**
  - Review customer-reported complaint and uploaded tool photos.
  - Enter root cause findings (e.g. *Armature commutator grooved, carbon brushes worn*).
  - Enter cost estimate in ₹ and replacement spare parts required.
  - Click **"Submit Quote to Customer"** to move status to `awaiting_customer_approval`.
- **Workshop Stage Progression Controls:**
  - `1. Start Inspection` ➔ `2. Awaiting Approval` ➔ `3. Repair in Progress` ➔ `4. Bench Tested & Ready for Pickup` ➔ `5. Completed & Handed Over`.
- **Timeline Audit Trail:** Chronological review of all timestamps and technician notes.

---

## 🚀 How to Run & Test the Application

### 1. Start the Vite Frontend Server
The Vite server is currently running:
👉 **[http://localhost:5174/](http://localhost:5174/)**

To run manually from terminal:
```cmd
cd C:\Users\HIMANI\.gemini\antigravity\scratch\toolcare
npm run dev
```

### 2. Build Frontend & Cloud Functions
```cmd
# Build frontend
npm run build

# Build cloud functions
cd functions
npm run build
```

---

## 🧪 Step-by-Step Verification Guide

1. **Verify Customer Counter Reservation:**
   - Open [http://localhost:5174/](http://localhost:5174/).
   - Add the *Bosch GWS 600 Angle Grinder* (Price: ₹2,480, Stock: 8) to the cart.
   - Open Cart Drawer and click **"Confirm Counter Reservation"**.
   - Note the generated reservation code (e.g. `TC-RES-XXXX`). Observe the stock count automatically decrement to 7.

2. **Verify Owner Admin Settlement (Cash / UPI):**
   - Click **"Sign In"** in the top navbar.
   - Click the test button **"Owner (Himani)"** and click **"Sign In as Owner"**.
   - Notice the amber **"Owner Portal"** button in the header and the link in the cloud status strip.
   - Click **"Owner Portal"** to open the management modal.
   - Locate the reservation you just made under the **Counter Reservations** tab.
   - Click **"Paid Cash"** or **"Paid UPI"**.
   - Observe the order marked as collected, the revenue KPI increment, and the counter receipt recorded!

3. **Verify Technician Workbench & Diagnostics:**
   - Click the user avatar in the header and click **"Switch Role / Sign In"**.
   - Click **"Technician (Ramesh Sharma)"** and sign in.
   - Click **"Tech Bench"** in the top header.
   - Select repair ticket **`REP-1001`** or any job from the queue.
   - Type inspection findings, enter an estimate of ₹850, and click **"Submit Quote to Customer"**.
   - Click **"4. Bench Tested & Ready for Pickup"**.
   - Open another tab or use the public **"Track Repair"** modal to search for that ticket reference and observe the live updated timeline!

4. **Verify Inventory Control & Low Stock Warning:**
   - In the Owner Portal under the **Inventory & Stock** tab, click `-` on any product until stock falls to 5 or lower.
   - Observe the red **"Low Stock ($\le 5$)"** warning badge appear and the KPI metric increment.
   - Edit the price or stock and click **Save**; the customer-facing catalog updates immediately.

5. **Verify 48-Hour Auto-Cancel Sweep:**
   - In the Owner Portal under **Counter Reservations**, click **"Run 48-Hr Auto-Cancel Sweep"**.
   - The backend sweeps all reservations and auto-cancels uncollected ones, returning their reserved quantities to inventory.
