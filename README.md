<div align="center">

<img src="https://img.shields.io/badge/PrepIQ-AI%20Interview%20Prep-6c63ff?style=for-the-badge&logoColor=white" alt="PrepIQ" />

# PrepIQ — AI-Powered Interview Preparation Platform

**Upload your resume + paste a job description → Get interview-ready in seconds**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com)

<br/>

🚀 **[Live Demo](https://ai-resume-analyzer-rust-one.vercel.app)** &nbsp;·&nbsp; 🐛 **[Report Bug](../../issues)** &nbsp;·&nbsp; ✨ **[Request Feature](../../issues)**

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#-roadmap)
- [Contact](#-contact)

---

## 🎯 About

PrepIQ is a **production-deployed full-stack Gen AI SaaS application** built to help job seekers prepare smarter for interviews. It analyzes your resume against any job description using Google Gemini AI and returns a complete interview preparation report — ATS score, skill gaps, technical questions, behavioral questions, and a day-wise prep plan.

> Built as a portfolio project to demonstrate real-world engineering: AI integration, OAuth, cross-origin deployment, PDF generation, and scalable React architecture — all shipped and live.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Interview Report** | Gemini AI analyzes resume vs JD — generates technical & behavioral questions with intentions and model answers |
| 📊 **ATS Match Score** | 0–100 score showing how well your resume matches the job description |
| 🎯 **Skill Gap Detection** | Identifies missing skills with severity levels — High, Medium, Low |
| 📅 **Day-wise Prep Plan** | Structured preparation roadmap tailored to the specific role |
| 📄 **AI Resume Builder** | Generates an ATS-optimized single-page resume PDF using Puppeteer |
| 🔐 **Full Auth System** | JWT + Google OAuth + GitHub OAuth + Forgot/Reset password via email |
| 📧 **Email Service** | Nodemailer with Gmail App Password for password reset emails |
| 👤 **Profile Dropdown** | Avatar with username, email, and logout — fixed top-right on all pages |
| 📖 **Paginated History** | All previous interview reports with match score badges |
| 📱 **Responsive UI** | Dark theme with custom SCSS design system — works on all screen sizes |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| SCSS Modules | Custom design system with CSS variables |
| Axios | HTTP client with `withCredentials` for cookie auth |
| Context API | Global state — 4-layer architecture (UI → Hook → State → API) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + HttpOnly Cookies | Stateless cross-origin authentication |
| Passport.js | Google & GitHub OAuth 2.0 strategies |
| Nodemailer | Password reset email delivery |
| Puppeteer + @sparticuz/chromium | PDF generation optimized for Render |
| Multer | Resume PDF file upload |
| pdf-parse | PDF text extraction |
| bcrypt | Password hashing |

### AI & Deployment
| Technology | Purpose |
|---|---|
| Google Gemini API | Interview report + resume HTML generation |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
prepiq/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── passport.config.js       # Google & GitHub OAuth strategies
│   │   ├── controller/
│   │   │   ├── auth.controller.js       # Login, register, OAuth, forgot/reset password
│   │   │   └── interview.controller.js  # Report generation, PDF download
│   │   ├── middleware/
│   │   │   └── auth.middleware.js       # JWT cookie verification
│   │   ├── models/
│   │   │   ├── user.model.js            # User schema with OAuth + reset token fields
│   │   │   ├── interviewReport.model.js
│   │   │   └── tokenBlackList.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   └── services/
│   │       ├── ai.service.js            # Gemini AI + Puppeteer PDF generation
│   │       └── email.service.js         # Nodemailer setup
│   ├── .env.example
│   ├── app.js                           # CORS + middleware setup
│   └── server.js
│
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   │   ├── hooks/useAuth.js
        │   │   ├── pages/
        │   │   │   ├── Login.jsx
        │   │   │   ├── Register.jsx
        │   │   │   ├── ForgotPassword.jsx
        │   │   │   └── ResetPassword.jsx
        │   │   └── services/auth.api.js
        │   └── interview/
        │       ├── hooks/use.interview.js
        │       ├── pages/
        │       │   ├── Home.jsx
        │       │   └── Interview.jsx
        │       ├── components/
        │       │   └── ProfileDropdown.jsx
        │       └── services/interview.api.js
        ├── components/
        │   └── Loading.jsx              # 4 variants: page, report, download, inline
        └── services/
            └── axios.instance.js        # Base URL + withCredentials
```

---

## 🚀 Getting Started

### Prerequisites

```
node >= 18.0.0
npm >= 9.0.0
MongoDB (local or Atlas)
```

### 1. Clone the repo

```bash
git clone https://github.com/Sujaltaware/prepiq.git
cd prepiq
```

### 2. Setup Backend

```bash
cd Backend
npm install
cp .env.example .env
# fill in your env variables
node server.js
```

### 3. Setup Frontend

```bash
cd Frontend
npm install
# create .env with VITE_API_URL=http://localhost:3000
npm run dev
```

### 4. Open browser

```
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend `.env`

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/prepiq

# Auth
JWT_SECRET=your_jwt_secret_key

# AI
GOOGLE_GENAI_API_KEY=your_gemini_api_key

# Email — use Gmail App Password (not your real password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# OAuth — Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OAuth — GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Client
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```bash
VITE_API_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` files. Use `.env.example` as reference only.

### Getting Gmail App Password

```
1. myaccount.google.com → Security
2. Enable 2-Step Verification
3. Search "App Passwords" → Generate
4. Copy the 16-character password → paste as EMAIL_PASS
```

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login with email/password | ❌ |
| POST | `/logout` | Logout and clear cookie | ✅ |
| GET | `/profile` | Get current user | ✅ |
| POST | `/forgot-password` | Send reset link via email | ❌ |
| POST | `/reset-password/:token` | Reset password with token | ❌ |
| GET | `/google` | Google OAuth redirect | ❌ |
| GET | `/google/callback` | Google OAuth callback | ❌ |
| GET | `/github` | GitHub OAuth redirect | ❌ |
| GET | `/github/callback` | GitHub OAuth callback | ❌ |

### Interview — `/api/interview`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Generate AI interview report | ✅ |
| GET | `/` | Get all reports (paginated) | ✅ |
| GET | `/:interviewId` | Get single report by ID | ✅ |
| POST | `/resume/pdf/:id` | Generate and download resume PDF | ✅ |

---

## 🗺 Roadmap

- [x] JWT Authentication
- [x] Google & GitHub OAuth
- [x] Forgot / Reset Password via Email
- [x] AI Interview Report Generation
- [x] ATS Score + Skill Gap Detection
- [x] Day-wise Preparation Plan
- [x] AI Resume PDF Builder
- [x] Paginated Report History
- [x] Profile Dropdown with Logout
- [x] Production Deployment (Vercel + Render)
- [ ] Stripe Payment Integration
- [ ] Cover Letter Generator
- [ ] Interview Practice Mode (AI scores your answers)
- [ ] LinkedIn Profile Analyzer
- [ ] Toast Notification System
- [ ] Protected Routes

---

## 🧠 Key Engineering Decisions

**Why `@sparticuz/chromium` instead of Puppeteer?**
Render's free tier doesn't have Chrome installed. `@sparticuz/chromium` bundles a lightweight Chromium specifically built for serverless/cloud environments, solving the `Browser not found` error in production.

**Why `SameSite=None; Secure=true` on cookies?**
Frontend (Vercel) and backend (Render) are on different domains. Cross-origin cookies require `SameSite=None` with `Secure=true` — without this, the browser silently drops the auth cookie and every request returns 401.

**Why `useMemo` on Context values?**
Without `useMemo`, the context object is recreated on every render — even when state didn't change. This caused 100+ API calls in a loop. Wrapping the value stabilizes the reference and stops unnecessary re-renders.

**Why 4-layer architecture?**
Separating UI → Hook → State → API makes each layer independently testable and prevents logic from leaking into components. It also makes swapping the state layer (e.g. Context → Zustand) a single-file change.

---

## 👤 Contact

**Sujal Taware**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/sujaltaware)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/Sujaltaware)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail)](mailto:sujaldtaware@gmail.com)

---

<div align="center">

**If this project helped you, give it a ⭐ — it means a lot!**

Made with ❤️ and a lot of debugging by [Sujal Taware](https://github.com/Sujaltaware)

</div>
