# Remediation Verification Plan (Phase 5)

## Overview
This document guides the manual verification process to confirm that all 5 vulnerabilities have been successfully remediated. Follow these steps sequentially.

## 1. Verify Application Status
- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:8080` (or check docker port mapping)
- **Database:** Running (Postgres 15)

## 2. Manual Verification Checklist

### [ ] 1. SQL Injection (Search)
**Objective:** Confirm that the search field treats input as literal text, not SQL commands.
1. Navigate to the Home Page.
2. In the Search bar, enter: `' OR '1'='1`
3. Click **Search**.
4. **Expected Result (Secure):** You should see "No books found" or just match books literally containing that text (none).
5. **Previous Vulnerable Result:** All books in the database were displayed.

### [ ] 2. Reflected XSS (Search)
**Objective:** Confirm that scripts injected into search terms are not executed by the browser.
1. Navigate to the Home Page.
2. In the Search bar, enter: `<script>alert('XSS')</script>`
3. Click **Search**.
4. **Expected Result (Secure):** The text `<script>alert('XSS')</script>` appears on the screen as plain text. No alert box pops up.
5. **Previous Vulnerable Result:** An alert box with "XSS" appeared immediately.

### [ ] 3. Stored XSS (Reviews)
**Objective:** Confirm that malicious scripts in reviews are sanitized before storage/display.
1. Login as a User (e.g., `alice@library.com` / `password123`).
2. Go to any Book Details page.
3. Write a review with content: `Great read! <script>alert('Stored XSS')</script>`
4. Submit the review.
5. Refresh the page.
6. **Expected Result (Secure):** The review appears as "Great read!", with the script tag removed or rendered as text. No alert pops up.
7. **Previous Vulnerable Result:** An alert box popped up every time the page loaded.

### [ ] 4. IDOR (Loan Details)
**Objective:** Confirm that users cannot access loan details belonging to others.
1. Login as User A (`alice@library.com`).
2. Borrow a book to create a loan (e.g., ID: 1).
3. Logout and login as User B (`bob@library.com`).
4. Try to access User A's loan via URL or API (e.g., `GET /api/loans/1`).
5. **Expected Result (Secure):** You receive a 403 Forbidden error message ("Unauthorized access").
6. **Previous Vulnerable Result:** Required details of Loan #1 were displayed.

### [ ] 5. Path Traversal (Admin Logs)
**Objective:** Confirm that the file parameter is strictly validated.
1. Login as Admin (`admin@library.com` / `password123`).
2. Use a tool like Postman or Curl to request:
   `GET /api/admin/logs?file=../.env`
3. **Expected Result (Secure):** You receive a 400 Bad Request error ("Invalid or unauthorized log file").
4. **Previous Vulnerable Result:** The contents of the `.env` file (containing passwords) were returned.

## 3. Automated Verification Status
- **Regression Suite:** `npm test` (Backend)
- **Status:** **PASSED** (All vulnerability checks failed, confirming security).
