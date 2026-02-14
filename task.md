We will work on a library web app. 

# 1. Objective and Expectations

You must build a working MVP of a web application, fully runnable in a Docker environment, and you must intentionally introduce security vulnerabilities inside the code.

The objective is to practice the full security lifecycle on real code:

- Build a functional app (auth, roles, business features)  
- Implement vulnerabilities on purpose (controlled and reproducible)  
- Detect them using security tools in CI (when possible)  
- Exploit them manually and assess the risk  
- Fix them properly  
- Verify the fix (manual retest + CI rescans)  

You are expected to demonstrate:

- Ability to design and implement a realistic backend application  
- Understanding of common web vulnerabilities (cause, exploitation, impact)  
- Ability to integrate security controls into a CI pipeline (SAST/SCA at least)  
- Ability to write clear security documentation and reproduce steps  
- Ability to patch vulnerabilities without breaking functionality  

---

# 2. Instructions

## 2.1 MVP Mandatory Features

Your application must include at least:

### Authentication
- Login/password  
- Session management using cookies  
- Logout  

### User Management
- Roles: at least USER and ADMIN  
- An ADMIN can invite/create/manage users  
- A USER can update only their profile (name, email)  

### Business Feature
- Your application must include a domain feature related to your theme  

### Search
- Keyword search  
- Filters by status / priority (or equivalent concepts depending on the theme)  

---

## 2.2 Application Themes

Each team will work on a theme (you can extend features freely).
Our team will work on a library website

## 2.3 Technical Constraints (Mandatory)

You can choose your stack freely, but you must comply with the following requirements:

### Backend API (Required)
we will use  
- Node.js Express

### Frontend
we will use  
Vue / Angular  

### Database Persistence (Required)
we will use postgreSql 
(you are free to contest this)

### CI Pipeline (Required)
you can use:
- GitHub Actions  
- GitLab CI  

### Docker Execution (Required)
Your application must run using Docker.  
(Dockerfile + docker-compose)

---

### Security Tooling Integration (Mandatory)

You must integrate security tools into your development workflow and CI pipeline.

Minimum required tools:

#### SAST (Static Application Security Testing)
Examples:
- Semgrep  
- CodeQL  
- Snyk Code  

#### SCA (Software Composition Analysis)
Examples:
- Snyk Open Source  
- OWASP Dependency-Check  

#### Secret Scanning
Examples:
- Gitleaks  
- TruffleHog  

#### DAST (Dynamic Application Security Testing)
Example:
- OWASP ZAP  

#### IaC Scanning (Infrastructure-as-Code Scanning)
Examples:
- Checkmarx KICS  
- Checkov  

---

# 3. Vulnerabilities Implementation

Instead of implementing all vulnerabilities, your team must intentionally implement **5 vulnerabilities total**, chosen from the list below.

The vulnerabilities are grouped by implementation difficulty:

- Easy: fast to implement, requires basic secure coding knowledge  
- Medium: requires deeper understanding of backend design and trust boundaries  
- Hard: requires advanced technical choices (parsers, uploads, execution context, etc.)  

You must implement 5 vulnerabilities, with this distribution:

- At least 2 Easy  
- At least 2 Medium  
- At least 1 Hard  

You are free to choose which vulnerabilities you implement, as long as you respect the distribution.

You must select vulnerabilities that make sense in your application theme and architecture.

If a vulnerability is not applicable to your stack (example: XXE without XML parsing), choose another one.

If your team wants a challenge, you can include **more than 5 vulnerabilities**, but only 5 are required.

---

## 3.1.1 Vulnerability Pool

### Easy
- Broken admin access control  
- IDOR (Insecure Direct Object Reference)  
- Reflected XSS  
- User enumeration  
- Encoded password exposure  
- Open Redirect  
- SQL Injection  

### Medium
- Path traversal / LFI  
- Stored XSS  
- Business logic flaw  
- CSRF (Cross-Site Request Forgery)  
- Vulnerable dependency exploitation (real-world CVE)  
- Insecure JWT/session claims trust  
- SSRF (Server-Side Request Forgery)  

### Hard
- XXE (XML External Entity Injection)  
- Insecure file upload (RCE)  
- Insecure Deserialization  
- Prototype Pollution  
- SQL Injection second order  

If you’d like to implement additional types of vulnerabilities, validate your choice with the instructor first.

---

## 3.1.2 Required Workflow for Each Vulnerability

For each vulnerability, you must deliver a complete “security case” including:

### 1) Vulnerable Code Explanation
- Where it is implemented (file + function)  
- Why it is vulnerable (root cause)  
- What conditions allow exploitation  

### 2) CI Security Detection (if detected by tools)
- Which tool detected it (SAST / SCA / secret scanning, etc.)  
- Evidence: CI logs, report, SARIF output, screenshots  
- If NOT detected: explain why + propose improvements (config/rules/tools)  

### 3) Manual Exploitation Proof
- Step-by-step reproduction  
- Payloads used  
- Evidence (screenshots / terminal outputs)  
- Impacts and risks (why it matters)  

### 4) Fix and Explanation
- Corrected code (patch)  
- Explanation: what security measure prevents the issue  

### 5) Verification of the Fix
- Manual retest (attack no longer works)  
- CI rescan (alert disappears if it was detected)  

---

## 3.1.3 Important Rules

- Vulnerabilities must be introduced in a controlled way (not random)  
- Vulnerabilities must be exploitable in your Docker environment (local)  
- Do not attack external real services or systems  
- Vulnerabilities must be realistic, reproducible, and documented  
- Your final corrected version must remain functional  

---

# 4. Deliverables & Notations

you must submit the following deliverables:

---

## 1. Git Repository

Add instructors as contributors.

Your repository must contain everything needed to run, test, exploit, and fix the application.

### Mandatory Content

#### Source Code
- Backend API (required)  
- Frontend (optional)  
- Database schema/migrations (or equivalent)  
- 2 branches: app works both before and after security fixes  

#### Docker Execution
- Dockerfile(s)  
- docker-compose.yml  
- One command to start the full stack  

#### CI Pipeline
- Configuration file (GitHub Actions / GitLab CI)  
- Automated test execution  
- Security tools integration (SAST, SCA, Secret Scanning, DAST, IaC scanning)  

#### README.md
- Project description + theme  
- Prerequisites  
- How to run the app with Docker  
- How to run tests  
- API documentation (Swagger link / Postman collection)  
- Demo credentials (admin + user)  

---

## 2. Technical Report (PDF Format)

You must submit a short technical report explaining the full security work performed during the project.

### Recommended Structure

### Executive Summary (half page max)
- What was built (theme + MVP scope)  
- What was tested (vulnerability choices)  
- Main results (key risks + fixes)  

### Architecture Overview
- Stack used (backend, DB, CI, Docker)  
- Main components and data flow  
- Authentication/session model  

### Security Tooling and CI Workflow
- Tools implemented (SAST, SCA, Secret Scanning, DAST, IaC)  
- Where they run (local, CI)  
- Screenshots or extracts of CI evidence  

### Vulnerability Cases (5 Required)

For each vulnerability:

- Name + category + difficulty  
- Vulnerable code explanation (root cause)  
- Exploitation steps (manual) + proof  
- Impact/risk analysis (why it matters)  
- Detection evidence (tool finding, if any)  
- Fix implemented (patch explanation)  
- Verification (manual retest + rescan results)  

### Conclusion
- Lessons learned  
- Remaining risks / limitations  
- Recommended improvements (if this was a real project)  

Your report must include evidence (screenshots/logs).

---

## Indicative Grading Scale

- MVP features implemented correctly: 20%  
- Vulnerabilities implemented and quality: 30%  
- Manual exploitation proof and impact analysis: 20%  
- Fix quality (secure patch + no regressions): 15%  
- CI security integration + repo quality (README/tests): 15%  


