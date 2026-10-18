# Om Sai Power Tools & Repairing Center

## Complete Development Plan

**Document status:** Draft for approval\
**Version:** 1.0\
**Project type:** Mobile-first e-commerce and in-shop repair management
website\
**Planning constraint:** This document defines the build plan only. It
does not implement the application.

------------------------------------------------------------------------

## 1. Project summary

Build a real-world website for **Om Sai Power Tools & Repairing Center**
that supports:

-   Online browsing, search, and reservation of power tools, genuine spare parts, and accessories.
-   Customer accounts and reservation history.
-   In-shop repair booking and real-time repair-status tracking.
-   An owner/admin dashboard for products, prices, stock, orders,
    customers, technicians, and repair jobs.
-   A technician dashboard for assigned repairs, diagnostic findings, and status updates.

### Explicitly out of scope

1.  **Online payments and payment gateways:** The business does not take online payments. Payment gateways (such as Razorpay, Paytm, Stripe, card or netbanking gateways) are explicitly **excluded**. Customers pay directly at the shop counter (cash, shop UPI, or card) after inspecting their parts and load-testing repaired machines.
2.  **Delivery and shipping:** The business does not provide courier or home delivery services. The first release will **not** include courier integration, shipping charges, delivery addresses, shipment tracking, or delivery staff. Customers collect purchases and drop off/pick up repair machines directly at the shop. Customer contact information is collected solely for account, reservation, and repair communication.

### Confirmed Business Policy: Payment at Counter Only

All reservations and repair bookings are **100% free online**. Customers pay only at the physical shop counter upon collection and live testing. No payment gateway integration or online payment setup is required.

------------------------------------------------------------------------

## 2. Goals and success criteria

The first release is successful when:

1.  Customers can register, sign in, browse products, and place an order
    for shop collection.
2.  Product prices and stock can be changed by the owner without editing
    source code.
3.  Counter reservations and repair bookings are placed with zero pre-payment;
    customers pay upon collection and live testing at the shop.
4.  Customers can submit repair requests and see their own repair status
    and history.
5.  Owners can manage the product catalog, orders, repair jobs, and
    technician assignments.
6.  Technicians can update only jobs assigned to them.
7.  Customers cannot read or modify other customers' private data.
8.  The website works on common mobile browsers and remains usable on
    desktop.
9.  The deployed site uses HTTPS and has tested backup/recovery
    procedures.
10. Core workflows pass documented acceptance tests before real
    customers use the system.

------------------------------------------------------------------------

## 3. Technology stack

  -----------------------------------------------------------------------
  Layer                   Recommended technology  Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React + TypeScript      Build reusable, typed
                                                  user interfaces and
                                                  role-specific
                                                  dashboards

  Frontend tooling        Vite                    Local development
                                                  server and production
                                                  build

  Styling                 CSS or CSS Modules;     Mobile-first layouts,
                          responsive design       accessible forms,
                                                  buttons, and product
                                                  cards

  Routing                 React Router            Separate customer,
                                                  owner, and technician
                                                  pages

  Forms and validation    React forms with a      Validate user input
                          schema-validation       consistently
                          library selected during 
                          setup                   

  Authentication          Firebase Authentication Customer and staff
                                                  sign-in, password
                                                  reset, and session
                                                  handling

  Database                Cloud Firestore         Store products, users'
                                                  public profile fields,
                                                  orders, payment
                                                  records, and repairs

  Image storage           Firebase Storage        Store product and
                                                  optional repair photos
                                                  with restrictive rules

  Trusted backend         Firebase Cloud          Enforce business rules,
                          Functions using         create orders, verify
                          TypeScript              payment events, and
                                                  update stock safely

  Hosting                 Firebase Hosting        Publish the website
                                                  over HTTPS

  Payment processing      None (Excluded)         Online payments excluded.
                                                  Orders settled at shop
                                                  counter via Cash / UPI

  Testing                 Unit tests and          Check business logic,
                          browser-based           permissions, checkout,
                          end-to-end tests; exact and repair workflows
                          libraries selected      
                          during setup            

  Version control         Git                     Track changes and make
                                                  recovery/review easier
  -----------------------------------------------------------------------

### Why this stack?

It keeps infrastructure manageable for a beginner while providing
authentication, database, image storage, and hosting
in one ecosystem without any payment gateway complexity or merchant fees.

### Architecture principle

The browser is an untrusted client. It must not be allowed to decide
final prices, mark payments successful, assign privileged roles, or
directly perform sensitive stock changes. Trusted Cloud Functions and
database security rules must enforce these operations.

------------------------------------------------------------------------

## 4. Application modules

### Module A --- Authentication and profiles

**Purpose:** Identify customers and staff securely.

Responsibilities: - Customer registration, login, logout, and password
recovery. - Profile management. - Staff sign-in. - Controlled assignment
of `owner` and `technician` roles. - Restrict each customer to their own
private records.

Admin privileges must never be granted through unrestricted public
registration.

### Module B --- Product catalog

**Purpose:** Present products for sale.

Responsibilities: - Categories for power tools, spare parts, and
accessories. - Product search and category filtering. - Product details,
images, specifications, brand/model, price, and stock availability. -
Active/inactive product state. - Owner-managed product creation,
editing, and deactivation.

### Module C --- Cart and checkout

**Purpose:** Convert product browsing into an order for collection at
the shop.

Responsibilities: - Add, remove, and change cart quantities. -
Revalidate price and stock on the backend. - Show item subtotal,
applicable taxes if configured, and final amount. - State clearly that
the customer collects the order at the shop. - Create a pending order
safely and prevent duplicate processing. - Show an order confirmation
and reference number.

There are no shipping charges, courier calculations, or delivery
addresses for the first release.

### Module D --- In-Shop Counter Payment & Verification

**Purpose:** Settle payments safely at the shop counter upon inspection.

Responsibilities: - Online orders are reservations with ₹0 advance payment.
- Order state starts as `pending_collection`. - Customer inspects products
or load-tests repaired machines at the shop counter. - Payment is collected
directly at the counter via Cash, UPI QR code, or shop POS terminal. - Staff
confirms payment and marks the order as `collected`. - No online payment
gateways, API keys, or transaction processing fees are involved.

### Module E --- Order management

**Purpose:** Let customers and staff follow product purchases.

Responsibilities: - Customer order history and order detail. - Owner
view of all orders. - Order status transitions:
`pending_collection` → `ready_for_collection` → `collected` (or `cancelled`).
- Collection & payment confirmation by authorized staff. - Order item and
price snapshots so later product edits do not alter past orders.

The exact transition rules and cancellation policy must be agreed before
implementation.

### Module F --- Repair booking and tracking

**Purpose:** Manage repairs from customer request to collection.

Responsibilities: - Customer submits tool type, brand/model, issue
description, and contact information. - Optional photo upload, subject
to storage access rules. - Unique repair reference. - Owner reviews the
request and assigns a technician. - Technician records inspection
findings, estimate, work notes, and expected completion. - Customer can
approve or decline a repair estimate where applicable. - Authorized
staff update the repair status. - Customers see their own repair history
and status timeline. - Repair updates retain timestamps and the staff
identity responsible for the change.

Proposed repair states: `requested` → `received_at_shop` → `inspection`
→ `awaiting_customer_approval` → `approved` → `in_progress` →
`ready_for_collection` → `completed`.

Additional states such as `declined`, `cancelled`, or `on_hold` may be
needed. Final states and transitions must be validated with the shop
owner.

### Module G --- Owner/admin dashboard

**Purpose:** Manage daily business operations.

Responsibilities: - Product and category management. - Price, image, and
stock updates. - Order processing and collection confirmation. - Repair
request review and technician assignment. - Customer and staff
management, with role changes restricted. - Basic sales, stock, order,
and repair summaries. - Audit-friendly records of important status
changes.

### Module H --- Technician dashboard

**Purpose:** Give technicians only the information needed for assigned
repair work.

Responsibilities: - View assigned repair jobs. - Record inspection
findings and estimates. - Update permitted repair statuses. - Record
work performed and expected completion. - Mark jobs ready for collection
when appropriate. - View relevant job history.

Technicians must not change product prices, payment records, user roles,
or jobs assigned to others unless the owner explicitly authorizes that
capability.

### Module I --- Notifications

**Purpose:** Inform users about important events.

Initial scope: - In-site order and repair status visibility. - Optional
email notifications if configured and affordable.

Later enhancements: - SMS or WhatsApp notifications. - Push
notifications.

Notifications must not expose sensitive customer information
unnecessarily.

### Module J --- Security, audit, and recovery

**Purpose:** Protect business records and support recovery.

Responsibilities: - Firestore and Storage security rules. - Role and
ownership checks. - Server-side validation. - Safe secret management. -
Logs for important order, payment, role, and repair-status changes. -
Usage and cost monitoring. - Backups and tested restoration procedures.

------------------------------------------------------------------------

## 5. Frontend pages

### Public and customer pages

  ------------------------------------------------------------------------------
  Page                    Route proposal                 Purpose
  ----------------------- ------------------------------ -----------------------
  Home                    `/`                            Introduce the business,
                                                         feature popular
                                                         categories, and link to
                                                         shopping and repairs

  Shop                    `/shop`                        Browse and filter
                                                         available products

  Category                `/categories/:categoryId`      View products in a
                                                         category

  Product detail          `/products/:productId`         Show images,
                                                         specifications, price,
                                                         stock, and add-to-cart
                                                         control

  Cart                    `/cart`                        Review products and
                                                         quantities

  Checkout                `/checkout`                    Confirm items,
                                                         collection method, and
                                                         payment

  Payment result          `/payment/result`              Display verified
                                                         order/payment outcome;
                                                         never independently
                                                         declare payment success

  Sign in                 `/login`                       Authenticate users

  Register                `/register`                    Create customer account

  Password recovery       `/forgot-password`             Start account recovery

  Customer account        `/account`                     Profile and account
                                                         options

  My orders               `/account/orders`              List the customer's
                                                         orders

  Order detail            `/account/orders/:orderId`     Show order items,
                                                         payment state, and
                                                         collection status

  Repair booking          `/repairs/new`                 Submit a repair request

  My repairs              `/account/repairs`             List the customer's
                                                         repair jobs

  Repair detail           `/account/repairs/:repairId`   Show status timeline,
                                                         estimate, and service
                                                         history

  Contact/about           `/contact`                     Shop contact details,
                                                         hours, and location

  Policies                `/policies/*`                  Publish privacy, terms,
                                                         cancellation, refund,
                                                         warranty, and repair
                                                         policies as approved
  ------------------------------------------------------------------------------

Routes are proposals and can be refined during UI planning.

### Owner/admin pages

  ----------------------------------------------------------------------------
  Page                    Route proposal               Purpose
  ----------------------- ---------------------------- -----------------------
  Admin overview          `/admin`                     Business summary and
                                                       pending actions

  Product management      `/admin/products`            Add, edit, deactivate,
                                                       and search products

  Category management     `/admin/categories`          Manage catalog
                                                       categories

  Inventory               `/admin/inventory`           Update stock and review
                                                       low-stock products

  Orders                  `/admin/orders`              View and process all
                                                       orders

  Order detail            `/admin/orders/:orderId`     Inspect payment and
                                                       collection state

  Repairs                 `/admin/repairs`             Review all repair jobs
                                                       and assign technicians

  Repair detail           `/admin/repairs/:repairId`   Manage estimate,
                                                       assignment, status, and
                                                       history

  Customers               `/admin/customers`           View necessary customer
                                                       details

  Staff                   `/admin/staff`               Manage staff access
                                                       using a controlled
                                                       process

  Reports                 `/admin/reports`             Basic sales, inventory,
                                                       and repair reports

  Settings                `/admin/settings`            Approved business
                                                       settings and policies
  ----------------------------------------------------------------------------

### Technician pages

  ---------------------------------------------------------------------------------
  Page                    Route proposal                    Purpose
  ----------------------- --------------------------------- -----------------------
  Technician overview     `/technician`                     Show assigned and
                                                            pending repair jobs

  Assigned repairs        `/technician/repairs`             List jobs assigned to
                                                            the technician

  Repair detail           `/technician/repairs/:repairId`   Record inspection and
                                                            update permitted status
                                                            fields
  ---------------------------------------------------------------------------------

A route guard improves navigation, but the backend and database rules
must still enforce access.

------------------------------------------------------------------------

## 6. Backend API and operation plan

With Firebase, this project does not require a traditional REST server
for every read. The frontend can use Firebase SDKs for authorized reads
and selected simple operations. Sensitive business actions should use
callable or HTTP Cloud Functions. The following are **logical API
contracts**, not implemented endpoints.

  -------------------------------------------------------------------------
  Operation               Suggested function        Purpose and
                                                    authorization
  ----------------------- ------------------------- -----------------------
  Create order            `createOrder`             Authenticated customer;
                                                    validate product
                                                    prices, stock, and
                                                    order contents on the
                                                    server

  Create payment          `createPayment`           Authenticated customer;
                                                    create provider payment
                                                    request for a valid
                                                    pending order

  Verify payment          `verifyPayment`           Verify provider
                                                    response on the server
                                                    and update
                                                    payment/order state
                                                    idempotently

  Payment webhook         `paymentWebhook`          Receive provider
                                                    events, verify
                                                    authenticity, and
                                                    safely process repeated
                                                    events

  Cancel order            `cancelOrder`             Apply approved
                                                    cancellation rules and
                                                    prevent invalid
                                                    stock/payment changes

  Process refund          `processRefund`           Owner-authorized;
                                                    verify eligibility and
                                                    call provider securely

  Create repair request   `createRepairRequest`     Authenticated customer;
                                                    validate input and
                                                    create repair reference

  Assign technician       `assignTechnician`        Owner-only; validate
                                                    technician role and job
                                                    state

  Update repair status    `updateRepairStatus`      Owner or assigned
                                                    technician; validate
                                                    allowed transition and
                                                    record history

  Approve estimate        `approveRepairEstimate`   Repair owner/customer
                                                    confirms the estimate
                                                    for their job

  Update inventory        `updateInventory`         Owner-only; validate
                                                    quantities and record
                                                    stock changes

  Change product          `saveProduct`             Owner-only; validate
                                                    required fields,
                                                    prices, and image
                                                    references

  Manage staff role       `setStaffRole`            Restricted trusted
                                                    admin operation; never
                                                    open to public users

  Get business report     `getAdminReport`          Owner-only; return only
                                                    permitted summary data
  -------------------------------------------------------------------------

### API design requirements

-   Authenticate users and authorize each operation independently.
-   Validate all fields and reject unexpected or invalid values.
-   Never trust a client-provided price, role, payment status, or stock
    quantity.
-   Use idempotency or equivalent duplicate-event protection for payment
    operations.
-   Keep provider secrets in server-side configuration.
-   Avoid returning unnecessary personal or payment information.
-   Record timestamps and actor IDs for sensitive state changes.
-   Apply rate limits or abuse protection where appropriate.
-   Keep a documented set of allowed order and repair status
    transitions.

------------------------------------------------------------------------

## 7. Database design

Firestore uses collections and documents rather than relational tables.
The following is a logical data model; exact document fields and indexes
will be finalized before implementation.

### `users`

Purpose: Customer and staff profiles.

Proposed fields: - `uid` - `displayName` - `email` - `phone` - `role`
(`customer`, `owner`, `technician`) - `createdAt` - `isActive`

Authentication credentials remain managed by Firebase Authentication.
Role changes must be protected from user self-editing.

### `categories`

Purpose: Organize the product catalog.

Proposed fields: - `categoryId` - `name` - `slug` - `description` -
`isActive` - `createdAt` - `updatedAt`

### `products`

Purpose: Product catalog and manual inventory.

Proposed fields: - `productId` - `name` - `description` - `categoryId` -
`brand` - `model` - `sku` - `imagePaths` - `price` - `stockQuantity` -
`isActive` - `createdAt` - `updatedAt`

Price representation and currency handling must be consistent; avoid
floating-point rounding for monetary calculations. Stock updates should
use trusted transactional logic.

### `carts`

Purpose: Preserve the authenticated customer's cart.

Proposed fields: - `userId` - `items` containing product identifiers and
quantities - `updatedAt`

Prices in the cart are display hints only. The backend recalculates the
authoritative amount during checkout.

### `orders`

Purpose: Record the customer's purchase and shop collection.

Proposed fields: - `orderId` - `orderNumber` - `customerId` - `items`
containing product ID, name snapshot, SKU snapshot, quantity, and
unit-price snapshot - `subtotal` - `taxAmount` if applicable -
`totalAmount` - `currency` - `paymentStatus` - `orderStatus` -
`collectionStatus` - `createdAt` - `updatedAt` - `collectedAt` when
applicable

Do not include courier, shipping, or delivery fields in the first
release. Final tax and invoice fields depend on the business's verified
tax arrangements.

### `payments`

Purpose: Track payment attempts and gateway reconciliation.

Proposed fields: - `paymentId` - `orderId` - `customerId` - `provider` -
`providerOrderReference` - `providerPaymentReference` - `amount` -
`currency` - `status` - `verifiedAt` - `createdAt` - `updatedAt` -
`refundReference` and `refundStatus` where applicable

Do not store card numbers, CVVs, or other raw payment credentials.

### `repairJobs`

Purpose: Main record for each repair.

Proposed fields: - `repairId` - `repairNumber` - `customerId` -
`toolType` - `brand` - `model` - `issueDescription` - `imagePaths` -
`assignedTechnicianId` - `inspectionNotes` - `estimateAmount` -
`estimateStatus` - `repairStatus` - `expectedCompletionAt` -
`createdAt` - `updatedAt` - `completedAt` when applicable

Only authorized users may read or change protected repair fields.

### `repairUpdates`

Purpose: Append-only or tightly controlled repair history.

Proposed fields: - `updateId` - `repairId` - `actorId` -
`previousStatus` - `newStatus` - `note` - `createdAt`

Avoid allowing users to rewrite historical updates freely.

### `inventoryMovements` (recommended)

Purpose: Provide an audit trail for stock changes.

Proposed fields: - `movementId` - `productId` - `quantityChange` -
`reason` - `relatedOrderId` if applicable - `actorId` - `createdAt`

### `notifications` (optional first release)

Purpose: Track in-site or email notifications.

Proposed fields: - `notificationId` - `recipientId` - `type` -
`relatedRecordId` - `status` - `createdAt` - `readAt`

### Database relationships and integrity

-   A customer may have many orders and repair jobs.
-   An order belongs to one customer and contains one or more product
    snapshots.
-   A payment is associated with an order; an order may have multiple
    payment attempts.
-   A repair job belongs to one customer and may be assigned to one
    technician at a time.
-   Repair history records refer to a repair job and an actor.
-   Product stock changes and order creation must be designed to avoid
    overselling.
-   Use database indexes for actual query patterns, such as customer
    order history, repair assignments, and status filters.

------------------------------------------------------------------------

## 8. Proposed folder structure

This is a planned structure, not a created project. Names can be
adjusted after the development environment is chosen.

``` text
om-sai-power-tools/
├── public/
│   ├── favicon/
│   └── images/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── forms/
│   │   ├── feedback/
│   │   └── products/
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── repairs/
│   │   ├── admin/
│   │   └── technician/
│   ├── pages/
│   │   ├── public/
│   │   ├── customer/
│   │   ├── admin/
│   │   └── technician/
│   ├── services/
│   │   ├── firebase/
│   │   ├── catalog/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── repairs/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── main.tsx
├── functions/
│   └── src/
│       ├── index.ts
│       ├── orders/
│       ├── payments/
│       ├── repairs/
│       ├── inventory/
│       ├── users/
│       └── shared/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── requirements/
│   ├── architecture/
│   ├── security/
│   └── test-plans/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Folder responsibilities

-   `app/`: application initialization, routing, and global providers.
-   `components/`: reusable interface components.
-   `features/`: feature-specific screens, logic, and components.
-   `pages/`: route-level page composition.
-   `services/`: frontend integrations with Firebase and backend
    functions.
-   `types/`: shared TypeScript models and API contracts.
-   `utils/`: small shared helper functions.
-   `functions/`: trusted server-side operations.
-   `tests/`: unit, integration, security, and end-to-end tests.
-   `docs/`: approved requirements and technical decisions.
-   Firebase rules and indexes: database/storage permissions and query
    support.

Do not place real credentials in `.env.example` or commit secrets to
version control. Public Firebase configuration is not a substitute for
security rules; server-side secrets must be protected separately.

------------------------------------------------------------------------

## 9. Implementation order

Build incrementally. Each phase should be tested before the next one
begins.

### Phase 0 --- Project setup and design approval

-   Confirm this plan and the remaining business decisions.
-   Confirm brand assets, shop contact details, policies, and initial
    product data.
-   Set up Git and the development environment.
-   Create a simple design system and mobile navigation plan.

**Exit criteria:** Approved requirements, architecture, and
first-release scope.

### Phase 1 --- Frontend foundation

-   Set up React, TypeScript, Vite, routing, styling, and shared
    layouts.
-   Build the responsive home page, shop layout, and reusable
    components.
-   Use sample data only during the initial UI work.

**Exit criteria:** Main pages render and work on mobile and desktop.

### Phase 2 --- Firebase and authentication

-   Configure Firebase project and environments.
-   Implement customer authentication and password recovery.
-   Define user profiles, role provisioning, Firestore rules, and
    Storage rules.
-   Test customer/owner/technician permission boundaries.

**Exit criteria:** Unauthorized users cannot access protected records or
assign themselves privileged roles.

### Phase 3 --- Product catalog and inventory

-   Implement categories, product listings, search, product details, and
    images.
-   Add owner product management and manual stock updates.
-   Add validation, indexes, and stock movement logging.

**Exit criteria:** Owner updates appear in the customer catalog; invalid
prices and stock changes are rejected.

### Phase 4 --- Cart and order creation

-   Implement cart persistence and checkout for shop collection.
-   Calculate prices and totals on the trusted backend.
-   Create orders safely and prevent duplicate creation.
-   Define order states and cancellation rules.

**Exit criteria:** A valid order is created once with correct item
snapshots, amount, and collection status.

### Phase 5 --- In-Shop Counter Payment & Handover

-   Orders are reserved online with ₹0 upfront payment.
-   Staff verifies customer item inspection and live machine load-testing.
-   Payment is collected at the shop counter via Cash or UPI QR.
-   Staff updates order status to `collected` on the admin counter screen.

**Exit criteria:** Counter orders transition safely from pending collection to collected without any payment gateway dependency.

### Phase 6 --- Repair booking and tracking

-   Implement repair request form and unique reference generation.
-   Build owner repair management and technician assignment.
-   Build technician job view and permitted status updates.
-   Add estimate approval, history, and customer repair tracking.

**Exit criteria:** Customers see only their own repair records;
technicians can update only permitted assigned jobs.

### Phase 7 --- Notifications and reports

-   Add useful order/repair notifications within budget.
-   Build basic owner reports and low-stock indicators.
-   Confirm that reports use correct and authorized data.

**Exit criteria:** Important updates are visible and reports reconcile
with the underlying records.

### Phase 8 --- Security and end-to-end testing

-   Test Firestore and Storage rules.
-   Test role escalation attempts, cross-customer access, stock races,
    and repeated payment callbacks.
-   Test mobile layouts, slow connections, form errors, and interrupted
    sessions.
-   Configure backups, recovery, logging, and usage alerts.

**Exit criteria:** All critical acceptance tests pass and backup
restoration is verified.

### Phase 9 --- Deployment and controlled launch

-   Deploy to a staging URL first.
-   Test with sample products and test-mode payments.
-   Verify policy pages, business details, payment gateway onboarding,
    and production settings.
-   Deploy the production site over HTTPS.
-   Start with a limited launch and monitor orders, repairs, errors, and
    cost.

**Exit criteria:** A real customer can complete a purchase for shop
collection and book/track a repair securely.

------------------------------------------------------------------------

## 10. Security and operational checklist

Before production:

-   Use least-privilege Firestore and Storage rules.
-   Test rules using customer, owner, technician, and unauthenticated
    test accounts.
-   Keep payment secrets only in protected server-side configuration.
-   Verify payment signatures/events and reconcile provider records.
-   Validate all monetary values and stock changes on the backend.
-   Prevent customers from modifying role fields.
-   Restrict repair images and private records to authorized users.
-   Avoid logging passwords, payment secrets, or unnecessary personal
    information.
-   Set budget and usage alerts; check the current pricing and free-tier
    conditions.
-   Configure and test backups.
-   Publish approved privacy, terms, cancellation/refund, warranty, and
    repair policies.
-   Confirm applicable GST, invoicing, consumer-protection, and
    payment-provider obligations with an appropriately qualified
    professional.
-   Test the production domain, HTTPS, recovery flows, and
    support/contact details.

------------------------------------------------------------------------

## 11. Remaining decisions before implementation

The project can proceed with UI planning, but the following should be
resolved before the corresponding feature is built:

1.  **Payment at collection:** RESOLVED & CONFIRMED. All payments take place at
    the shop counter upon pickup. Online payments are excluded from the project.
2.  **Tax status:** Is the business GST-registered, and what invoicing
    rules apply? Confirm with a qualified tax professional.
3.  **Repair charges:** Are inspections chargeable? Must customers
    approve every estimate before work starts? (Standard: Approval required before work).
4.  **Cancellation/refunds:** What are the shop's policies for unpaid
    orders, paid orders, defective products, returns, and refunds?
5.  **Collection workflow:** Confirmed 48-hour reservation hold. Proof of
    order reference code at counter confirms collection.
6.  **Business details:** Logo, phone/email, shop address, and opening
    hours confirmed.
7.  **Initial catalog:** Product names, models, categories, selling
    prices, and stock quantities confirmed.
8.  **Online Gateway selection:** EXCLUDED. No gateway accounts or online processing.

No delivery service and no online payment gateway are included in the plan.

------------------------------------------------------------------------

## 12. Approval checklist

Before implementation begins, review and approve:

-   [x] Scope: online product catalog with shop collection and in-shop repairs.
-   [x] No courier, delivery, shipping fee, or shipment tracking features.
-   [x] Online payments EXCLUDED; zero-risk counter payment confirmed.
-   [x] Customer, owner, and technician roles and permissions.
-   [x] React + TypeScript + Firebase architecture.
-   [x] Counter reservation workflow (48-hr hold, pay at shop).
-   [x] Repair estimate and approval policies.
-   [x] Acceptance criteria and phased implementation order.

**Recommended next step:** Approve or revise this plan, then begin Phase
0. Implement one phase at a time; do not build the whole application in
a single pass.
