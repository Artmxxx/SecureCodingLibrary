# Secure Coding Library - Technical Security Report

## 1. Executive Summary

### Overview
We have built a fully functional "Secure Library" web application to demonstrate the complete software security lifecycle. The application allows users to register, browse books, leave reviews, and manage loans. Administrators have a dedicated dashboard to manage users, books, and view system logs.

### Vulnerability Scope
To test our detection and exploitation capabilities, we intentionally introduced **5 distinct vulnerabilities** into the codebase, ranging from critical SQL Injection to Infrastructure flaws.

### Key Results (Phase 1 & 2)
- **Phase 1 (Build):** The application is fully deployed using Docker, with a separate Frontend (Vue.js), Backend (Express), and Database (PostgreSQL).
- **Phase 2 (Detection):** We successfully integrated a CI/CD Security Pipeline using GitHub Actions.
    - **Semgrep (SAST)** successfully detected the SQL Injection and hardcoded patterns.
    - **Checkov (IaC)** identified Docker security misconfigurations (Root user execution).
    - **OWASP ZAP (DAST)** successfully scanned the running application.

---

## 2. Architecture Overview

### Stack Technology
- **Backend:** Node.js with Express.js (REST API).
- **Frontend:** Vue.js 3 with Bootstrap 5 (Single Page Application).
- **Database:** PostgreSQL 15 (Relational Data Persistence).
- **Containerization:** Docker & Docker Compose for orchestration.
- **CI/CD:** GitHub Actions for automated testing and security scanning.

### Data Flow Components
1.  **Client:** Vue.js app running in browser sends JSON requests to `http://localhost:3000/api`.
2.  **API Gateway:** Express.js server handles routing, authentication, and business logic.
3.  **Authentication:** JWT (JSON Web Tokens) are issued upon login and stored in **HTTP-Only Cookies** to prevent local access, though the application is vulnerable to XSS which could bypass other protections.
4.  **Persistence:** Sequelize ORM interacts with the PostgreSQL database.

---

## 3. Security Tooling and CI Workflow

We implemented a robust "Defense in Depth" pipeline in `.github/workflows/security.yml` that runs on every push.

### Tools Implemented

| Tool Category | Tool Name | Scope | Execution Context | Status |
|--------------|-----------|-------|-------------------|--------|
| **SAST** | **Semgrep** | Source Code (JS) | GitHub Actions Runner | ✅ Detected Issues |
| **SCA** | **NPM Audit** | Dependencies | GitHub Actions Runner | ✅ Clear |
| **Secret Scanning** | **TruffleHog** | Git History | GitHub Actions Runner | ✅ Clear |
| **IaC Scanning** | **Checkov** | Dockerfile/Compose | GitHub Actions Runner | ✅ Detected Issues |
| **DAST** | **OWASP ZAP** | Running App | GitHub Actions Runner (localhost) | ✅ Successful Scan |

### Evidence of Detection
*Refer to the Phase 2 Report for detailed logs.*
- **Semgrep** flagged the direct raw SQL query in `books.js`.
- **Checkov** flagged `CKV_DOCKER_3` (User is root) in `Dockerfile`.

---

## 4. Vulnerability Cases

We have implemented the following 5 vulnerabilities.

### Case 1: SQL Injection (SQLi)
- **Category:** Injection (Easy)
- **Location:** `backend/routes/books.js` - `GET /api/books?q=...`
- **Root Cause:** The search query parameter `q` is concatenated directly into a raw SQL string:
  ```javascript
  const query = `SELECT * FROM "Books" WHERE title ILIKE '%${q}%' ...`;
  ```
- **Detection:** Detected by **Semgrep**.

### Case 2: IDOR (Insecure Direct Object Reference)
- **Category:** Broken Access Control (Easy)
- **Location:** `backend/routes/loans.js` - `GET /api/loans/:id`
- **Root Cause:** The application checks if the user is *logged in*, but fails to check if the *loan ID* belongs to that specific user. Any user can iterate through IDs to view others' loans.
- **Detection:** Requires DAST/Manual testing (Logic flaw, hard for SAST).

### Case 3: Reflected Cross-Site Scripting (XSS)
- **Category:** Injection (Easy)
- **Location:** `frontend/src/views/HomeView.vue`
- **Root Cause:** The search term returned by the backend is rendered using `v-html` (or equivalent unsafe HTML rendering) without sanitization:
  ```javascript
  res.json({ message: `Search results for: <b>${q}</b>` });
  ```
- **Detection:** Potential detection by DAST (ZAP).

### Case 4: Stored Cross-Site Scripting (XSS)
- **Category:** Injection (Medium)
- **Location:** `backend/routes/books.js` (Review submission) & Frontend
- **Root Cause:** User reviews are saved to the database without sanitization and then rendered raw in the frontend. An attacker can inject `<script>` tags that execute for every user viewing the book.
- **Detection:** Detected by **Semgrep** (flagging unsafe usage).

### Case 5: Path Traversal
- **Category:** Broken Access Control (Medium)
- **Location:** `backend/routes/admin.js` - `GET /api/admin/logs?file=...`
- **Root Cause:** The `file` parameter is passed directly to `fs.readFileSync` without validating that it stays within the logs directory.
  ```javascript
  const filePath = path.join(logDir, filename); // No validation
  ```
- **Detection:** Potential detection by SAST.

---

## 5. Next Steps (Phase 3 & 4)

- **Phase 3 (Exploitation):** We will manually exploit each of these vulnerabilities to demonstrate the risk.
- **Phase 4 (Remediation):** We will patch the code (e.g., using Sequelize parameterized queries, sanitizing HTML input) and verify the fixes.


# Detection Evidence

This document contains the evidence of detection for the 5 confirmed vulnerabilities. Below is the actual output from our GitHub Actions CI pipeline, followed by the detailed breakdown of findings.

### GitHub Actions Pipeline Result
**Job Status:** ❌ FAILED (As expected)
**Scanner:** Semgrep (SAST)

```text
┌─────────────┐
│ Scan Status │
└─────────────┘
  Scanning 48 files tracked by git with 1064 Code rules:

  Language      Rules   Files          Origin      Rules
 ─────────────────────────────        ───────────────────
  <multilang>      62      48          Community    1064
  js              156      18
  json              4       4
  yaml             31       2
  dockerfile        6       2
  html              1       1

┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 13 (13 blocking)
 • Rules run: 257
 • Targets scanned: 48
 • Parsed lines: ~100.0%
 • Scan was limited to files tracked by git
Ran 257 rules on 48 files: 13 findings.
Error: Process completed with exit code 1.
```

> **Interpretation:** The extensive rule set (1064 rules) successfully flagged **13 blocking issues**, verifying that our vulnerabilities are detectable by standard security tooling.

## 1. SQL Injection (SQLi)

*   **Location:** `backend/routes/books.js`:31
*   **Tool:** Semgrep (Static Analysis)
*   **Rule ID:** `javascript.sequelize.security.sequelize-sql-injection`
*   **Severity:** **CRITICAL**

### Evidence Output
```json
{
  "check_id": "javascript.sequelize.security.sequelize-sql-injection",
  "path": "backend/routes/books.js",
  "start": { "line": 31, "col": 21 },
  "end": { "line": 31, "col": 96 },
  "extra": {
    "message": "Detected a SQL injection vulnerability. The variable 'q' is directly interpolated into a raw SQL query string. Use Sequelize parameterized queries (replacements) or model methods like findAll({ where: ... }) instead.",
    "severity": "ERROR",
    "lines": "const query = `SELECT * FROM \"Books\" WHERE title ILIKE '%${q}%' OR author ILIKE '%${q}%'`;"
  }
}
```

---

## 2. Reflected Cross-Site Scripting (XSS)

*   **Location:** `frontend/src/views/HomeView.vue`:23
*   **Tool:** ESLint (plugin-vue) / Semgrep
*   **Rule ID:** `vue/no-v-html`
*   **Severity:** **HIGH**

### Evidence Output
```text
/frontend/src/views/HomeView.vue
  23:38  warning  'v-html' directive can lead to XSS attack  vue/no-v-html

  Line 23: <div class="text-dark" v-html="searchMessage"></div>
                                  ^ user input flows here
```

> **Analysis:** The variable `searchMessage` contains user input (`q`) from the search bar, which is rendered as raw HTML. This allows attacker-controlled scripts to execute in the victim's browser.

---

## 3. Stored Cross-Site Scripting (XSS)

*   **Location:** `frontend/src/views/HomeView.vue`:59
*   **Tool:** Semgrep (Taint Analysis)
*   **Rule ID:** `javascript.browser.security.vue-v-html-taint`
*   **Severity:** **HIGH**

### Evidence Output
```json
{
  "check_id": "javascript.browser.security.vue-v-html-taint",
  "path": "frontend/src/views/HomeView.vue",
  "start": { "line": 59, "col": 37 },
  "message": "User-controlled data 'review.content' is used in 'v-html'. This data originates from an API response and is potentially unsafe if not sanitized on the backend.",
  "code": "<p class=\"mb-0 small text-secondary\" v-html=\"review.content\"></p>"
}
```
> **Note:** The backend `backend/routes/books.js` stores the review content directly without sanitization, confirming the source of the tainted data.

---

## 4. Insecure Direct Object Reference (IDOR)

*   **Location:** `backend/routes/loans.js`:60
*   **Tool:** Manual Dynamic Analysis / Burp Suite Logs
*   **Status:** **VERIFIED**

### Evidence Output (HTTP Traffic Log)
static analysis tools (SAST) often fail to detect IDOR because "ownership" is a business logic concept. The evidence is captured via traffic analysis.

```http
GET /api/loans/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <TOKEN_OF_USER_B>

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "userId": 2,  <-- "User A" (ID 2)
  "bookId": 1,
  "status": "LOANED"
}
```
> **Analysis:** User B (Token verified) successfully requested the loan details for Loan ID 1, which belongs to User A (userId: 2). The server returned `200 OK` instead of `403 Forbidden`.

---

## 5. Path Traversal

*   **Location:** `backend/routes/admin.js`:31
*   **Tool:** Semgrep
*   **Rule ID:** `javascript.express.security.path-traversal`
*   **Severity:** **HIGH**

### Evidence Output
```json
{
  "check_id": "javascript.express.security.path-traversal",
  "path": "backend/routes/admin.js",
  "start": { "line": 31, "col": 22 },
  "end": { "line": 31, "col": 48 },
  "extra": {
    "message": "Detected potential path traversal. 'filename' comes from user input (req.query) and is passed to 'path.join' without prior validation against a whitelist or path sanitization.",
    "severity": "ERROR",
    "lines": "const filePath = path.join(logDir, filename);"
  }
}
```
> **Attack Vector:** An attacker can supply `../../.env` as the filename, causing `path.join` to resolve to the project root secret file.
