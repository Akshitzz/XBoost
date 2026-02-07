# 🚀 XBoost - Autonomous AI Content Agent for X

XBoost is a powerful **Autonomous AI Agent** designed to grow your X (Twitter) presence on autopilot. It generates viral-ready tweets, schedules them based on your preferences, and autonomously engages with your community—all powered by **Google Gemini AI**.

![XBoost Dashboard](./frontend/public/pfpmain.jpg)

## ✨ Features

- **🤖 AI Content Generation**: Generates high-quality, viral hooks and threads using Google Gemini.
- **📅 Smart Scheduling**: Autonomous cron-based scheduler that posts up to 6 times a day.
- **💬 Autonomous Engagement**: The agent autonomously likes and replies to relevant tweets in your niche to grow reach.
- **📊 Real-time Dashboard**: Track your tweet history, follower growth, and agent status.
- **🔒 Secure Authentication**: Twitter OAuth 2.0 & JWT-based session management.
- **🎨 Premium UI**: Built with Next.js, Tailwind CSS, and Framer Motion for a sleek, glassmorphism experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI / Magic UI inspired
- **State**: React Hooks & Context

### Backend
- **Server**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Google Gemini API
- **Social**: Twitter API v2 (OAuth 2.0)
- **Scheduling**: Cron Jobs (via cron-job.org)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas Account
- Twitter Developer Account (Basic Tier recommended for full features)
- Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Akshitzz/XBoost.git
    cd XBoost
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend
    cd Backend
    npm install

    # Install Frontend
    cd ../frontend
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in **Backend** and `.env.local` in **frontend**.

    **Backend (`.env`)**
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    
    # Twitter API
    TWITTER_API_KEY=your_api_key
    TWITTER_API_SECRET=your_api_secret
    TWITTER_CLIENT_ID=your_client_id
    TWITTER_CLIENT_SECRET=your_client_secret
    TWITTER_ACCESS_TOKEN=your_access_token
    TWITTER_ACCESS_SECRET=your_access_secret
    
    # URLs
    CLIENT_URL=http://localhost:3000
    SERVER_URL=http://localhost:5000
    ```

    **Frontend (`.env.local`)**
    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
    ```

4.  **Run Locally**
    ```bash
    # Terminal 1: Backend
    cd Backend
    node index.js

    # Terminal 2: Frontend
    cd frontend
    npm run dev
    ```

## 🌍 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com).
- **Backend**: Deployed on [Render](https://render.com).
- **Cron Job**: Set up a ping to `https://your-backend.onrender.com/api/cron/run` every 15 minutes on [cron-job.org](https://cron-job.org).

