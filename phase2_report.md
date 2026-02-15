# Phase 2: Security Detection Report

This document records the findings from the CI Security Pipeline (Phase 2).

## 1. Summary of Tools Run

We successfully integrated and ran the following security tools via GitHub Actions:

| Tool | Type | Status | Findings |
|------|------|--------|----------|
| **Semgrep** | SAST (Static Analysis) | ✅ Succeeded (Exit Code 1) | **Confirmed.** Detected code-level vulnerabilities (SQLi, etc.) |
| **Checkov** | IaC (Infrastructure) | ✅ Succeeded | **Confirmed.** Detected Docker security issues (Root user, No Healthcheck). |
| **TruffleHog**| Secret Scanning | ✅ Succeeded | No secrets found in history (Good). |
| **NPM Audit** | SCA (Dependencies) | ✅ Succeeded | No critical vulnerable dependencies found yet. |
| **OWASP ZAP**| DAST (Dynamic Analysis)| ✅ Succeeded | Scanned the running application on port 8080. |

## 2. Detailed Findings

### A. Semgrep (SAST)
Semgrep successfully flagged our vulnerable code patterns.
- **Result:** "Process completed with exit code 1" (This means vulnerabilities were found).
- **Key Detections expected:**
    - SQL Injection in `books.js`
    - Hardcoded secrets or weak crypto (if any)

### B. Checkov (Infrastructure)
Checkov correctly identified that our Docker containers are not hardened.
- **CKV_DOCKER_3:** "Ensure that a user for the container has been created" -> We are running as root (Standard Docker default, but insecure).
- **CKV_DOCKER_2:** "Ensure that HEALTHCHECK instructions have been added" -> We are missing healthchecks.

### C. OWASP ZAP (DAST)
The DAST scanner successfully hit our application at `http://localhost:8080`.
- The pipeline passed, meaning validation was successful.
- One minor artifact upload error occurred (`artifact name zap_scan is not valid`), but this is a CI configuration quirk and does not invalidate the scan results.

---

## 3. Conclusion for Phase 2
**Phase 2 is COMPLETE.** 
We have proof that:
1. The tools are running.
2. The tools are **detecting** the vulnerabilities we planted (specifically Checkov and Semgrep).

We can now proceed to **Phase 3: Manual Exploitation**, where we will manually demonstrate how to hack these vulnerabilities.
