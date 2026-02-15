# Secure Coding Library App

## 1. Project Overview
This project is a functional **Library Management System** built to demonstrate the full **Secure Software Development Lifecycle (SSDLC)**. 

The application was intentionally built with **5 critical security vulnerabilities** to practice detection, exploitation, and remediation.

**Theme:** Library (Books, Reviews, Loans)  
**Stack:** Node.js, Express, PostgreSQL, Vue.js, Docker.

---

## 2. Branch Structure
This repository contains two primary branches representing the security state of the application:

*   🔴 **`main` (Vulnerable Version):**  
    The original codebase containing all 5 vulnerabilities. Use this branch to demonstrate exploits and test detection tools.

*   🟢 **`secure-fix` (Secure Version):**  
    The hardened codebase where all vulnerabilities have been remediated. Use this branch to verify fixes and pass security scans.

---

## 3. Vulnerabilities Implemented
| # | Vulnerability | Category | Difficulty | Location |
|---|---|---|---|---|
| 1 | **SQL Injection** | Injection | Easy | `backend/routes/books.js` |
| 2 | **Reflected XSS** | Injection | Easy | `frontend/src/views/HomeView.vue` |
| 3 | **Stored XSS** | Injection | Medium | `backend/routes/books.js` |
| 4 | **IDOR** | Broken Access Control | Easy | `backend/routes/loans.js` |
| 5 | **Path Traversal** | Broken Access Control | Medium | `backend/routes/admin.js` |

*See `docs/report/final-report.md` for detailed analysis.*

---

## 4. Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js 18+ (for local testing)

### Installation & Running
1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd SecureCodingLibrary
    ```

2.  **Start the Application (Docker):**
    ```bash
    docker-compose up --build
    ```

3.  **Seed the Database (Required for Login):**
    Open a new terminal and run:
    ```bash
    docker exec securecodinglibrary-backend-1 npm run seed
    ```

4.  **Access the App:**
    *   **Frontend:** `http://localhost:8080`
    *   **Backend API:** `http://localhost:3000`

### Demo Credentials
After running the seed command:
*   **Admin:** `admin` / `admin123`
*   **User:** `user` / `user123`

---

## 5. Security Verification

### Running Vulnerability Regression Tests
We have included a Jest test suite that attempts to exploit the vulnerabilities.

**On `main` branch:** Tests should **PASS** (confirming exploits work).  
**On `secure-fix` branch:** Tests should **FAIL** (confirming exploits are blocked).

```bash
# Run tests inside the container
docker exec securecodinglibrary-backend-1 npm test
```

### Running Security Scans
This project uses GitHub Actions for automated security scanning.
*   **SAST:** Semgrep
*   **IaC:** Checkov
*   **DAST:** OWASP ZAP

Check the "Actions" tab in GitHub to see the pipeline results.

---

## 6. Deliverables
*   **Source Code:** `backend/`, `frontend/`
*   **Infrastructure:** `Dockerfile`, `docker-compose.yml`
*   **CI Configuration:** `.github/workflows/security.yml`
*   **Documentation:** `docs/report/`
