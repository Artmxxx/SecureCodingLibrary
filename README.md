# Secure Coding Library App

## Project Description
A vulnerable Library Management System built to demonstrate common web security flows (DevSecOps).

**Theme:** Library
**Stack:** Node.js, Express, PostgreSQL, Vue.js, Docker.

## Prerequisites
- Docker & Docker Compose
- Node.js 18+

## How to Run
1. `docker-compose up --build`
2. Access Frontend: `http://localhost:8080`
3. Access Backend: `http://localhost:3000`

## API Documentation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/books | List Books (Search vuln) |
| GET | /api/loans/:id | Loan Details (IDOR vuln) |
| POST | /api/books/:id/reviews | Post Review (XSS vuln) |
| POST | /api/books/:id/cover | Upload Cover (Upload vuln) |

## Demo Credentials
- **Admin:** (Create manually via seed or direct DB insert if needed, currently open registration)
- **User:** Register via `/register` (Postman/Curl for now as UI only has login)

## Running Tests
`npm test` (Backend)
