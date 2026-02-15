# Secure Coding Library App

## 1. Project Overview
This project is a functional **Library Management System** built to demonstrate the full **Secure Software Development Lifecycle (SSDLC)**. The application allows users to browse books, write reviews, and borrow items, while administrators can manage the inventory and view system logs.

The application was intentionally built with **5 critical security vulnerabilities** to practice detection, exploitation, and remediation.

### Technical Stack
-   **Backend:** Node.js, Express, Sequelize ORM
-   **Frontend:** Vue.js (served via Nginx/Node)
-   **Database:** PostgreSQL 15
-   **Infrastructure:** Docker & Docker Compose
-   **CI/CD:** GitHub Actions (Semgrep, TruffleHog, Checkov)

---

## 2. Vulnerabilities Implemented

The following vulnerabilities have been implemented for educational purposes:

| # | Vulnerability | Category | Location | Difficulty |
|---|---|---|---|---|
| **1** | **SQL Injection** | Injection | `backend/routes/books.js` (Search) | Easy |
| **2** | **Reflected XSS** | Injection | `frontend/src/views/HomeView.vue` | Easy |
| **3** | **Stored XSS** | Injection | `backend/routes/books.js` (Reviews) | Medium |
| **4** | **IDOR** | Access Control | `backend/routes/loans.js` (Get Loan) | Easy |
| **5** | **Path Traversal** | Access Control | `backend/routes/admin.js` (Logs) | Medium |

---

## 3. How to Run the Application (Docker)

This repository contains two primary branches. You can switch between them to see the "Vulnerable" state and the "Secure" state.

### A. Run the VULNERABLE Version (`main`)
Use this branch to demonstrate exploits and test detection tools.

1.  **Switch to the branch:**
    ```bash
    git checkout main
    ```
2.  **Start the containers:**
    ```bash
    docker-compose down -v --remove-orphans  # Clean up old containers
    docker-compose build
    docker-compose up -d
    ```
3.  **Seed the Database (Required):**
    ```bash
    docker exec securecodinglibrary-backend-1 npm run seed
    ```
4.  **Access the App:**
    -   Frontend: [http://localhost:8080](http://localhost:8080)
    -   Backend API: [http://localhost:3000](http://localhost:3000)

### B. Run the SECURE Version (`secure-fix`)
Use this branch to verify fixes and pass security scans.

1.  **Switch to the branch:**
    ```bash
    git checkout secure-fix
    ```
2.  **Start the containers:**
    ```bash
    docker-compose down -v --remove-orphans
    docker-compose build
    docker-compose up -d
    ```
3.  **Seed the Database (Required):**
    ```bash
    docker exec securecodinglibrary-backend-1 npm run seed
    ```
4.  **Access the App:**
    -   Frontend: [http://localhost:8080](http://localhost:8080)

---

## 4. How to Run Tests (Verification)

We have included a Jest test suite `tests/vulnerability_check.test.js` that attempts to exploit the vulnerabilities.

**Command:**
```bash
docker exec securecodinglibrary-backend-1 npm test
```

### Expected Results

*   **On `main` (Vulnerable):**
    *   Tests should **PASS**.
    *   This confirms the exploits *succeeded*, proving the app is vulnerable.

*   **On `secure-fix` (Secure):**
    *   Tests should **FAIL** (specifically, receive 403 Forbidden, 400 Bad Request, or sanitized output).
    *   This confirms the exploits *failed*, proving the app is secure.

---

## 5. Demo Credentials

The database is seeded with the following users:

| Role | Username | Email | Password |
|---|---|---|---|
| **Admin** | `admin` | `admin@library.com` | `password123` |
| **User** | `alice` | `alice@library.com` | `password123` |
| **User** | `bob` | `bob@library.com` | `password123` |

---

## 6. API Documentation

### Auth
*   `POST /api/auth/register` - Create account
*   `POST /api/auth/login` - Login (Returns cookie)
*   `POST /api/auth/logout` - Logout

### Books
*   `GET /api/books?q=...` - Search books (Vulnerable to SQLi/XSS)
*   `POST /api/books/:id/reviews` - Add review (Vulnerable to Stored XSS)
*   `GET /api/books/:id/reviews` - Get reviews

### Loans
*   `POST /api/loans` - Borrow a book
*   `GET /api/loans` - List my loans
*   `GET /api/loans/:id` - Get loan details (Vulnerable to IDOR)

### Admin
*   `GET /api/admin/logs?file=...` - Read server logs (Vulnerable to Path Traversal)

---

## 7. Project Deliverables
*   **Source Code:** `backend/`, `frontend/`
*   **Infrastructure:** `Dockerfile`, `docker-compose.yml`
*   **CI Configuration:** `.github/workflows/security.yml`
*   **Documentation:** `docs/report/`

