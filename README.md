# 🏦 Professional Banking & Ledger System (Backend) [Live]:https://high-concurrency-atomic-booking-system.onrender.com
 
 API_DOCS:https://high-concurrency-atomic-booking-system.onrender.com/api-docs/

This is a full-fledged Banking and Ledger System engineered to demonstrate how real-world financial applications track transactions, maintain user balances, and ensure data integrity. 

Unlike a simple CRUD application, it implements a professional **"Ledger" architecture** used by modern banks to record every movement of money as a strictly immutable debit or credit entry.


---

## 🛠 Tech Stack

The application is built using the **MEN stack** (MongoDB, Express, Node.js) with professional-grade libraries:

* **Runtime & Framework:** Node.js with Express.js for robust API routing.
* **Database & ODM:** MongoDB (Atlas) with Mongoose for schema modeling and ACID-compliant transactions.
* **Authentication & Security:** Secure sessions via **JWT** and password hashing using **bcryptjs**.
* **Email Services:** Automated notifications via **Nodemailer** integrated with Google Gmail API.
* **Deployment:** Hosted on **Render** with secure environment variable management.
* **Development Tools:** Postman (API Testing), MongoDB Compass, and Nodemon.

---

## 🌟 Key Features

* **Smart Ledger System:** Instead of a static "balance" field, the system calculates balance in real-time by aggregating all credit/debit entries, ensuring 100% accuracy.
* **Atomic Transaction Management:** Uses **Mongoose Sessions** to ensure that money transfers (debit + credit + status update) follow the "all-or-nothing" rule.
* **Multi-Account Support:** Users can manage multiple accounts with different statuses (Active, Frozen, Closed).
* **Comprehensive User Management:** Secure registration, login, and a **Token Blacklisting** system for secure logout.
* **Initial System Funding:** A dedicated 'System User' module for injecting initial liquidity into the ecosystem.
* **Automated Notifications:** Real-time email alerts for onboarding and successful transactions.

---

## ⚙️ Technical Implementation (Deep Dive)

### 1. Idempotency Protection
To prevent accidental double-spending during network retries, the system implements **Idempotency Keys**. It validates if a transaction with the same key has already been processed before execution.

### 2. Real-time Balance Aggregation
Leveraged the **MongoDB Aggregation Pipeline** to fetch and calculate the current balance on-the-fly from thousands of ledger entries.

### 3. Data Immutability & Audit Trail
Once a ledger entry is created, it is marked as **immutable**. Custom hooks block any attempt to edit or delete records, providing a permanent and tamper-proof audit trail.

### 4. Security Middlewares & TTLs
* **Private Route Protection:** Verifies tokens and checks against the blacklist.
* **Role-based Access:** Specialized middleware to restrict system-level functions.
* **Database Optimization:** Uses **TTL (Time To Live) Indexes** to automatically clean up expired blacklisted tokens after 3 days.

---

## 🚦 Getting Started

1. **Clone the repo:** `git clone <your-repo-link>`
2. **Install dependencies:** `npm install`
3. **Setup .env:** Add your `MONGO_URI`, `JWT_SECRET`, and `GMAIL_APP_PASS`.
4. **Run in dev mode:** `npm run dev`
