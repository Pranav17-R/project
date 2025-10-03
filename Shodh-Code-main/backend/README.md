# Shodhcode Backend (Express + MongoDB)

Backend API for Shodhcode: track coding journey, solved problems, recommendations, and progress.

## Stack
- Node.js 18+
- Express 4
- MongoDB (Mongoose)
- JWT auth
- Validation: express-validator
- Security: helmet, CORS

## Setup
1. Go to backend folder:
```
cd backend
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file (copy from env.example below):
```
MONGO_URI=mongodb://localhost:27017/shodhcode
JWT_SECRET=change_this_secret
PORT=5000
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```
4. Seed sample problems (and optional admin user):
```
npm run seed
```
5. Start the server:
```
npm run dev
```
API runs at `http://localhost:5000`.

## Project Structure
```
backend/
  src/
    server.js        # bootstraps server
    app.js           # express app & routes
    config/db.js     # mongoose connection
    models/          # User, Problem, SolvedProblem
    controllers/     # route handlers
    routes/          # route definitions
    middlewares/     # auth, roles, validation, error
  scripts/seed.js    # seed sample problems
  package.json
  README.md
```

## Auth
- Register: `POST /api/auth/register` { username, email, password }
- Login: `POST /api/auth/login` { email, password }
- Logout: `POST /api/auth/logout`
- Use `Authorization: Bearer <token>` for protected routes

## Users
- Get me: `GET /api/users/me`
- Update me: `PUT /api/users/me` { username?, email? }
- Change password: `POST /api/users/me/password` { currentPassword, newPassword }

## Problems
- List: `GET /api/problems?tags=a,b&difficulty=Easy|Medium|Hard&platform=LeetCode&limit=50&page=1&q=two`
- Create (admin): `POST /api/problems` { problemId, title, tags[], difficulty, platform }

## Solved Problems
- Add solved: `POST /api/solved` { problemId, title, tags[], dateSolved?, difficulty, platform }
- List mine: `GET /api/solved?tags=a,b&difficulty=Easy|Medium|Hard&limit=50&page=1`

## Recommendations
- Next suggestions: `GET /api/recommendations/next`

## Progress
- Summary: `GET /api/progress/summary`
- Timeline: `GET /api/progress/timeline?days=90`

## Notes
- Passwords hashed with bcrypt.
- JWT expires in 7 days.
- Roles: `user`, `admin` (env ADMIN_EMAIL gets admin role on registration).
- All inputs are validated; errors return 422 with details.






