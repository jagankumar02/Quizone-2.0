# QuizOne: AI-Powered Smart Exam Preparation Platform
**Tagline:** Learn Smarter. Practice Better. Improve Faster.

## 🚀 Project Overview
QuizOne is a student-focused, AI-powered educational SaaS platform designed to transform how students prepare for examinations. By leveraging generative AI, it replaces static question banks with dynamic, personalized quiz generation, an intelligent study assistant, and data-driven performance analytics.

## 💡 Problem Statement
Students struggle with rigid study materials, a lack of personalized practice questions for niche academic topics, and difficulty identifying their specific weak points before examinations. Traditional platforms offer generic tests that do not adapt to a student's specific syllabus or difficulty needs.

## ✅ The Solution
QuizOne utilizes Google's Gemini AI to instantly generate highly specific MCQ quizzes based on any subject, topic, and difficulty level. It features a completely private, authenticated environment where students can track their accuracy, receive step-by-step AI explanations for difficult concepts, and follow a structured study planner.

## 🛠 Technology Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript, Chart.js, Lucide Icons, Plus Jakarta Sans.
*   **Backend:** Python, Flask, REST APIs.
*   **AI Integration:** Google Gemini API (gemini-1.5-pro).
*   **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth).

## ⚙️ Installation & Configuration
1. Clone the repository and navigate to the project directory.
2. Install Python dependencies: `pip install -r requirements.txt`
3. Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key