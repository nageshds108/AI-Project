# 🎯 Sherpa AI — Interview Preparation Platform

A modern AI-powered web application that analyzes your resume against a job description and generates a personalized interview preparation report — including technical questions, behavioral questions, skill gap analysis, preparation roadmap, and match score.

---

## 🌐 Overview

Sherpa AI is a full-stack intelligent platform built to help candidates prepare effectively for job interviews.  
By leveraging AI, it transforms resumes into actionable insights and structured preparation strategies.

The system uses **Google Gemini AI** to analyze user inputs and generate detailed interview reports, making preparation smarter, faster, and more personalized.

---

## 🚀 Features

### 🤖 AI-Powered Analysis
- Resume vs Job Description comparison  
- Match score generation (0–100%)  
- Context-aware AI insights  

---

### 📊 Interview Report Generation
- Technical interview questions with answers  
- Behavioral interview questions with explanations  
- Skill gap analysis (low / medium / high severity)  
- Strengths & weaknesses identification  

---

### 📅 Preparation Plan
- Day-by-day preparation roadmap  
- Task-based learning suggestions  
- Focus areas based on missing skills  

---

### 📄 Resume Processing
- Upload resume (PDF format)  
- Extract and parse text using backend processing  
- Generate optimized AI-enhanced resume PDF  

---

### 🧾 Report Management
- View all previous reports  
- Open detailed report view  
- Delete reports  
- Persistent history stored in database  

---

### 🔐 Authentication System
- User registration & login  
- JWT-based authentication  
- HTTP-only cookies for secure sessions  
- Protected routes  

---

## 🛠️ Tech Stack

### Frontend
- React 18  
- React Router v6  
- Context API (State Management)  
- Axios (API calls)  
- Custom CSS (Dark Theme UI)  

---

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

---

### AI Integration
- Google Gemini API (`@google/genai`)  

---

### Other Tools & Libraries
- bcryptjs (Password hashing)  
- jsonwebtoken (JWT authentication)  
- multer (File uploads)  
- pdf-parse (Resume text extraction)  
- puppeteer (PDF generation)  
- zod (Validation)  
- cookie-parser & cors  

---

## ⚙️ How It Works

1. User registers or logs in  
2. Uploads resume + enters job description  
3. Backend extracts resume text  
4. AI processes and analyzes inputs  
5. System generates structured interview report  
6. User views and prepares accordingly  
