# Sherpa AI - Interview Preparation Platform

**Live Demo:** **https://ai-project-7d8x.onrender.com**

Sherpa AI is a full-stack AI-powered web platform that helps candidates prepare for interviews by analyzing a resume against a job description and generating a personalized preparation report with a match score, technical and behavioral questions, skill-gap analysis, strengths and weaknesses, and a structured roadmap to improve interview readiness faster and more effectively.

## How It Works

1. The user signs up or logs in.
2. The user uploads a resume (PDF) and provides a target job description.
3. The backend extracts and parses resume content.
4. Google Gemini analyzes resume and job-description alignment.
5. The platform generates a complete interview preparation report.
6. The user reviews reports, tracks history, and prepares using suggested focus areas.

## Features

### AI-Powered Analysis
- Resume vs. job-description comparison
- Match score generation (0-100)
- Context-aware AI insights

### Interview Report Generation
- Technical interview questions with suggested answers
- Behavioral interview questions with explanations
- Skill-gap analysis (low, medium, high severity)
- Strength and weakness identification

### Preparation Planning
- Day-by-day preparation roadmap
- Task-based learning suggestions
- Priority focus areas based on missing skills

### Resume Processing
- PDF resume upload
- Resume text extraction and parsing
- AI-enhanced report generation from extracted content

### Report Management
- View previously generated reports
- Open detailed report pages
- Delete old reports
- Persistent history stored in database

### Authentication and Security
- User registration and login
- JWT-based authentication
- HTTP-only cookies for session security
- Protected routes for authorized users

## Tech Stack

### Frontend
- React 18
- React Router v6
- Context API
- Axios
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI Integration
- Google Gemini API (`@google/genai`)

### Supporting Libraries
- `bcryptjs`
- `jsonwebtoken`
- `multer`
- `pdf-parse`
- `puppeteer`
- `zod`
- `cookie-parser`
- `cors`

## Why This Project Matters

This project is useful for students and professionals who want structured, personalized interview preparation instead of generic advice. It combines AI analysis with practical output so users can clearly understand where they stand and what to improve before interviews.
