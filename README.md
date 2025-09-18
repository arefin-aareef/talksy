Talksy - Real-time Chat Application
📌 What I Built and Why

I built a real-time chat application because I wanted to challenge myself with a project that combines multiple technologies like Nest.js, Next.js, WebSockets, Kafka, Redis, and FastAPI. It pushed me to learn scalable architecture, real-time communication, and security best practices.

⚙️ Setup Instructions
1. Clone Repository
git clone <your-repo-url>
cd <project-folder>

2. Backend Setup
cd backend
npm install
npm run start:dev

Backend `Environment Variables (.env)`
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
MONGODB_URI=<your-mongodb-uri>
REDIS_URL=<your-redis-url>
FRONTEND_URL=http://localhost:3000
```

3. Frontend Setup
```
cd frontend
npm install
npm run dev
```

Frontend `Environment Variables (.env.local)`
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

🚀 Features Implemented

✅ User authentication (login/register)

✅ Real-time updates (WebSockets)

✅ Python FastAPI service integration

✅ Kafka message streaming implementation

✅ Redis caching and session management

✅ OWASP Top 10 security compliance

✅ Responsive design

✅ TypeScript throughout

✅ REST API with validation

✅ MongoDB integration

✅ Error handling

🔐 Security Measures Implemented (OWASP Compliance)

Input validation and sanitization

Rate limiting and brute-force protection

JWT-based authentication with expiry

CORS and Helmet for secure headers

Encrypted password storage (bcrypt)

Centralized error handling to prevent leakage of sensitive info

Role-based access control (RBAC) for APIs

🔑 Demo Credentials

You can register and login directly to use the app.
(No pre-made credentials provided for security reasons.)

🌐 Live Demo

👉 Talksy - `https://talksyapp.vercel.app/`

❓ Common Questions & Answers

Why did you choose this project?
→ To challenge myself with real-time systems, scalable architecture, and security best practices.

How did you integrate Python FastAPI with your Nest.js backend?
→ By exposing FastAPI endpoints and consuming them from the Nest.js backend via REST integration.

What was your Kafka implementation strategy for message streaming?
→ Used Kafka producers/consumers for handling scalable message pipelines between services.

How did you utilize Redis for caching and session management?
→ Cached frequently accessed data and managed session tokens for fast lookups and reduced DB load.

What OWASP Top 10 security measures did you implement?
→ Input validation, secure JWT auth, rate limiting, helmet headers, and secure storage of secrets.

What was your biggest technical challenge?
→ Orchestrating multiple technologies (Kafka, Redis, FastAPI) into a single scalable system.

What would you improve with more time?
→ Add end-to-end encryption for messages and containerize services with Kubernetes.

Any other you want to mention?
→ The project was a great learning experience in building a production-like scalable chat system.

📜 License

This project is for educational and job task purposes only.
All secrets/credentials in this README are masked for security.
