# Deployment and Environment Variables Guide

This guide explains how to configure environment variables for **Render** (Backend) and **Vercel** (Frontend) to ensure seamless communication, Supabase database connection, and CORS verification.

---

## 🛠️ Summary of Automatic Fixes Made
1. **`postgres://` to `postgresql://` Normalization**: SQLAlchemy requires the connection string scheme to start with `postgresql://`. If you paste a Supabase URI that starts with `postgres://`, the backend will automatically rewrite it to `postgresql://` on startup to prevent crash.
2. **SQLite Fallback Protection**: In local development, the app falls back to SQLite if Supabase is unreachable. In production (`APP_ENV=production`), this fallback is now **disabled** to prevent silent data loss on Render's ephemeral filesystem. If the database connection fails, the app will throw a visible error immediately.

---

## 1. Render Environment Variables (Backend)

On Render, navigate to your service settings, go to the **Environment** tab, and add the following variables.

| Key | Example Value | Description |
|---|---|---|
| `APP_ENV` | `production` | Sets the application mode to production. This disables auto-seeding and SQLite fallback. |
| `DATABASE_URL` | `postgresql://postgres:[password]@db.hfavyoxmupbyzryznkgr.supabase.co:5432/postgres` | Your Supabase connection string. Both `postgres://` and `postgresql://` formats are supported. |
| `JWT_SECRET` | *[Generate a secure random string]* | Key used to sign user JWTs. Generate a strong key (e.g., via `openssl rand -hex 32`). |
| `JWT_ALGORITHM` | `HS256` | The algorithm used for JWT token signing. |
| `FRONTEND_URL` | `https://online-courses-azure.vercel.app` | **CRITICAL**: The URL of your Vercel frontend. *Do not include a trailing slash.* Used for Stripe redirect URL generation. |
| `CORS_ORIGINS` | `https://online-courses-azure.vercel.app` | **CRITICAL**: Comma-separated list of allowed origins. Must contain your exact Vercel frontend URL. |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Your Stripe secret API key. If left as `sk_test_mock_key` or blank, the app will automatically use a mock checkout flow. |

---

## 2. Vercel Environment Variables (Frontend)

On Vercel, navigate to your project dashboard, go to **Settings** -> **Environment Variables**, and add the following variable.

> [!IMPORTANT]
> Because the frontend is built using **Vite**, any environment variable that needs to be accessed by the React app **must** be prefixed with `VITE_`. Vite will silently ignore any variables that do not start with `VITE_`.

| Key | Example Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://your-backend-service.onrender.com/api` | **CRITICAL**: The URL of your Render backend API. **Must end with `/api`**. |

---

## 🔄 Cross-Reference Connection Checklist

To ensure your frontend and backend talk to each other correctly:

```mermaid
graph LR
    Vercel[Vercel Frontend] -- "VITE_API_URL" --> Render[Render Backend]
    Render -- "CORS_ORIGINS" --> Vercel
    Render -- "DATABASE_URL" --> Supabase[(Supabase Database)]
```

### 1. Frontend-to-Backend Connection
- **Vercel** needs `VITE_API_URL`.
- If your Render URL is `https://learni-api.onrender.com`, then in Vercel set:
  `VITE_API_URL=https://learni-api.onrender.com/api`
- Make sure there is no trailing slash after `/api`.

### 2. Backend-to-Frontend Connection (CORS & Stripe Redirects)
- **Render** needs `CORS_ORIGINS` and `FRONTEND_URL`.
- If your Vercel URL is `https://online-courses-azure.vercel.app`, then in Render set:
  - `FRONTEND_URL=https://online-courses-azure.vercel.app`
  - `CORS_ORIGINS=https://online-courses-azure.vercel.app`
- If you have custom domains or want to test locally as well, separate them with a comma:
  `CORS_ORIGINS=https://online-courses-azure.vercel.app,http://localhost:5173`

### 3. Supabase Connection
- In Render, check the `DATABASE_URL` matches the connection string from your Supabase Dashboard (**Project Settings** -> **Database** -> **Connection string** -> **URI**).
- Ensure your database password does not contain special characters that are not URL-encoded (like `@`, `:`, `/`). If your password contains these, URL-encode them or change the password in Supabase to be alphanumeric.
