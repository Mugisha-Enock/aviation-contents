# Aviation Contents API

Node.js + Express + MongoDB (Mongoose) + Socket.IO backend for the Aviation Contents React frontend.

## Run
    cp .env.example .env      # set MONGODB_URI and a long random JWT_SECRET
    npm install
    npm run seed              # optional demo data (admin@example.com / Password123!)
    npm run dev               # http://localhost:5000

Frontend `.env`: `VITE_API_URL=http://localhost:5000/api`, `VITE_SOCKET_URL=http://localhost:5000`.

## Structure
    src/config       env + database connection
    src/models       User, Story, Magazine, Report
    src/controllers  auth, story, user, media, magazine, report, dashboard
    src/routes       all /api routes in one place
    src/middleware   auth + roles, zod validation, uploads, error handling
    src/sockets      Socket.IO server and broadcastNewStory()
    src/utils        sanitizing, slugs, tokens, error helpers
    src/scripts      seed.js

## Endpoints (prefix /api)
| Method | Path | Access |
|---|---|---|
| POST | /auth/register, /auth/login, /auth/logout | public |
| GET | /auth/me | signed in |
| GET | /stories?q=&type=&category=&author=&sort=&page=&limit= | public (published only) |
| GET | /stories/mine?status= | signed in (own stories only) |
| GET | /stories/:slug | public if published; owner/staff otherwise |
| POST / PUT / DELETE | /stories, /stories/:id | signed in; edit = owner or staff; delete = owner or admin |
| PATCH | /stories/:id/status | editor, admin |
| GET / PATCH | /users/:username, /users/me | public / signed in |
| POST | /media (multipart field `files`, up to 10) | signed in |
| GET / POST | /magazines, /magazines/:slug | public / staff to create |
| POST / GET / PATCH | /reports | signed in / staff / staff |
| GET | /dashboard/stats, /dashboard/content | editor, admin |

## Publishing + real time
The author ID and publish time are set on the server from the session cookie; any `author` in the
request body is ignored. When a story becomes published the server emits `story:new` (full story JSON
with `id`) to all Socket.IO clients; clients dedupe by `id`. Set `REQUIRE_REVIEW=true` to make regular
users' stories `pending` until an editor publishes them.

## Notes for the frontend
- Responses use `id` (not `_id`). `author` is populated as `{id, displayName, username, avatarUrl}`; the
  React mock data uses an author id string, so map accordingly.
- Auth is an httpOnly cookie, so fetch with `credentials:'include'` (already in `services/api/client.js`).
- Story bodies are stored as sanitized HTML (small allow-list). Render with a sanitizer or the same allow-list.
- Uploads go to `uploads/` on local disk for development. For production, switch `middleware/upload.js`
  to S3/Cloudinary and store the returned URLs; never store media bytes in MongoDB.
- Set `NODE_ENV=production` behind HTTPS so cookies are `Secure` and `SameSite=None`.
