# Security Documentation : MzansiBuilds

## Philosophy

Security was treated as a first-class concern from the start of
development, not added as an afterthought. Every feature was designed
with potential attack vectors in mind.

---

## Authentication Security

### JWT Tokens
- Supabase Auth issues signed JWT tokens on successful login
- Tokens are stored in browser memory by Supabase, not localStorage
- Tokens expire automatically and are refreshed by the Supabase client
- Every API request to the database includes the JWT in the header

### Password Security
- Passwords are hashed by Supabase using bcrypt before storage
- Plain text passwords are never stored or logged anywhere
- Minimum password length of 6 characters enforced client-side
  and server-side

### Google OAuth
- Implemented via Supabase Auth OAuth flow
- Credentials never pass through the application server
- Redirect URI is registered and validated by Google

---

## Authorisation Security — Row Level Security

Row Level Security (RLS) is enabled on every table. This means
even if someone bypasses the frontend, the database itself
enforces ownership rules.

### Policies implemented

**profiles**
- Anyone can read profiles (public)
- Only the owner can update their own profile

**projects**
- Anyone can read projects (public feed)
- Only authenticated users can create projects
- Only the project owner can update or delete their project

**comments**
- Anyone can read comments
- Only authenticated users can post comments
- A user can only post as themselves (user_id = auth.uid())

**collaboration_requests**
- Only the sender and the project owner can see a request
- Only authenticated users can send requests
- Only the project owner can update the status

**milestones**
- Anyone can read milestones
- Only the project owner can add milestones

**celebration_wall**
- Anyone can read the wall (public)
- Entries are created automatically by a database trigger

---

## Input Validation Security

All user inputs are validated before reaching the database.

### Client-side validation (src/utils/validation.js)
- Name: required, 3-100 characters
- Description: required, minimum 10 characters
- Stage: must be one of the allowed enum values
- Email: regex format check
- Password: minimum 6 characters
- Username: minimum 3 characters

### Database-level validation
- Stage column uses a CHECK constraint, only allowed values
  can be inserted
- status column on collaboration_requests uses a CHECK constraint
- Foreign key constraints prevent orphaned records

### SQL Injection Prevention
- All database queries use the Supabase client which uses
  parameterised queries under the hood
- No raw SQL string concatenation anywhere in the codebase

---

## Environment Security

### Secrets Management
- Supabase URL and anon key stored in .env file
- .env is in .gitignore — never committed to version control
- .env.example committed with placeholder values to show
  what variables are required
- Production secrets stored as GitHub Secrets for CI/CD pipeline
- Secrets injected as environment variables at build time,
  never hardcoded

---

## Storage Security

### Avatar Uploads
- Only authenticated users can upload files
- Storage policy restricts each user to their own folder
  (folder name = user ID)
- File size limited to 2MB client-side
- Only image file types accepted (image/*)
- Files are served via public URLs — no sensitive data in storage

---

## Frontend Security

### Protected Routes
- A ProtectedRoute component wraps all authenticated pages
- Unauthenticated users are redirected to /login immediately
- isOwner checks on ProjectDetail and EditProject prevent
  non-owners from seeing owner-only actions

### Sensitive Data
- User email is shown read-only in EditProfile — cannot be
  changed through the app interface
- No sensitive user data is logged to the console in production

---

## Known Limitations

- Email confirmation is disabled in development — should be
  enabled before a production deployment
- Rate limiting is not implemented on the client — Supabase
  provides basic rate limiting at the API level
- No CAPTCHA on registration — acceptable for a developer
  community platform at this scale