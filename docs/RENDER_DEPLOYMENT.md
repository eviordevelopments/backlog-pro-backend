# Render Deployment Guide

Deploy **Backlog Pro Backend** to [Render](https://render.com) using Docker images from DockerHub, with a native PostgreSQL database. This guide replaces Supabase + Netlify with a fully managed Render stack.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: GitHub Secrets Setup](#step-1-github-secrets-setup)
3. [Step 2: DockerHub Setup](#step-2-dockerhub-setup)
4. [Step 3: Render PostgreSQL Database](#step-3-render-postgresql-database)
5. [Step 4: Render Docker Service](#step-4-render-docker-service)
6. [Step 5: Environment Variables](#step-5-environment-variables)
7. [Step 6: Verify Deployment](#step-6-verify-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Updating the Application](#updating-the-application)

---

## Prerequisites

- **GitHub Account** with the backlog-pro-backend repository
- **DockerHub Account** (free tier available at hub.docker.com)
- **Render Account** (free tier available at render.com)
- Git installed locally

---

## Step 1: GitHub Secrets Setup

GitHub Actions uses secrets to securely store your DockerHub credentials. These are required for the CI/CD workflow to automatically publish images.

### 1.1 Generate DockerHub Access Token

1. Log in to [DockerHub](https://hub.docker.com)
2. Click your profile icon → **Account Settings**
3. Go to **Security** tab
4. Click **New Access Token**
5. Enter token name (e.g., `github-actions`)
6. Select **Read, Write** permissions
7. Click **Generate**
8. **Copy the token** (you won't see it again)

### 1.2 Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/eviordevelopments/backlog-pro-backend`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

   **Secret 1: DOCKERHUB_USERNAME**
   - Name: `DOCKERHUB_USERNAME`
   - Value: Your DockerHub username

   **Secret 2: DOCKERHUB_TOKEN**
   - Name: `DOCKERHUB_TOKEN`
   - Value: The access token you copied above

5. Click **Add secret** for each

✅ **Result:** GitHub Actions can now authenticate with DockerHub.

---

## Step 2: DockerHub Setup

### 2.1 Create DockerHub Repository

1. Log in to [DockerHub](https://hub.docker.com)
2. Click **Create Repository**
3. Fill in:
   - **Name:** `backlog-pro-backend`
   - **Description:** (optional) "Backlog Pro Backend – Project & Team Management API"
   - **Visibility:** Public (or Private if preferred)
4. Click **Create**

### 2.2 Verify Repository URL

Your image URL will be: `YOUR_DOCKERHUB_USERNAME/backlog-pro-backend`

Example: `octocat/backlog-pro-backend`

You'll use this URL in Render configuration (see Step 4).

### 2.3 Trigger First Build

Ensure GitHub Actions workflow publishes the first image:

```bash
# From your local repo, update package.json version
# (if not already done)
npm version patch  # Updates version in package.json

# Commit and push to main
git add package.json
git commit -m "chore: bump version for Docker build"
git push origin main
```

Go to **GitHub Actions** tab in your repo to watch the workflow execute. Once complete, check DockerHub to confirm the image was published.

---

## Step 3: Render PostgreSQL Database

### 3.1 Create PostgreSQL Database in Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name:** `backlog-pro-db`
   - **Database:** `backlog_pro` (or your preference)
   - **User:** `postgres` (default)
   - **Region:** Choose region closest to your users (e.g., `Oregon`, `Frankfurt`)
   - **PostgreSQL Version:** `15`
   - **Plan:** `Free` or `Starter`
4. Click **Create Database**

### 3.2 Retrieve Database Credentials

Once the database is created (may take 1-2 minutes), you'll see connection details:

- **Internal Connection URL:** `postgresql://postgres:PASSWORD@HOST:5432/backlog_pro`
- **Host:** `HOST`
- **Port:** `5432`
- **Database:** `backlog_pro`
- **Username:** `postgres`
- **Password:** (shown in dashboard)

⚠️ **Important:** Render provides an **internal URL** that works only from services in the same Render environment. Use this URL in your application, not the external URL.

---

## Step 4: Render Docker Service

### 4.1 Create Docker Web Service

1. In Render Dashboard, click **New +** → **Web Service**
2. Choose **Docker** (not "Deploy from a repository")
3. Fill in:
   - **Name:** `backlog-pro-backend`
   - **Docker Image URL:** `YOUR_DOCKERHUB_USERNAME/backlog-pro-backend:latest`
     - Example: `octocat/backlog-pro-backend:latest`
   - **Port:** `3000`
4. Click **Create Web Service**

### 4.2 Configure Health Check

1. Go to your service settings
2. Find **Health Check** section
3. Set:
   - **Path:** `/graphql`
   - **Poll interval:** `30s` (default)
   - **Timeout:** `10s` (default)

### 4.3 Enable Auto-Deploy (Optional but Recommended)

1. Go to service settings
2. Find **Docker Repository** section
3. Click **Connect Docker Registry** (if not already connected)
4. Select your DockerHub account
5. Enable **Auto-Deploy** to automatically redeploy when new images are pushed

---

## Step 5: Environment Variables

### 5.1 Add Environment Variables in Render

1. In your Render service dashboard, scroll to **Environment** section
2. Click **Add Environment Variable** for each variable below
3. Fill in the values (see table)

| Variable      | Example Value            | Description                         |
| ------------- | ------------------------ | ----------------------------------- |
| `NODE_ENV`    | `production`             | Node environment                    |
| `PORT`        | `3000`                   | Application port                    |
| `DB_HOST`     | (from Step 3.2)          | Render PostgreSQL internal URL host |
| `DB_PORT`     | `5432`                   | PostgreSQL port                     |
| `DB_USERNAME` | `postgres`               | PostgreSQL user                     |
| `DB_PASSWORD` | (from Step 3.2)          | PostgreSQL password                 |
| `DB_DATABASE` | `backlog_pro`            | Database name                       |
| `DB_SSL`      | `true`                   | Enable SSL for database connection  |
| `JWT_SECRET`  | (generate strong secret) | JWT signing secret                  |

### 5.2 Generate JWT_SECRET

Generate a secure random string (minimum 32 characters):

**Option 1: Using Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**

```bash
openssl rand -hex 32
```

**Option 3: Online Generator** (less secure for production)
Use an online random string generator and copy a 32+ character hex string.

Copy the generated string and paste it into Render as the `JWT_SECRET` value.

### 5.3 Database Connection String (Alternative)

If your Render PostgreSQL provides a `DATABASE_URL` environment variable, you can use:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/backlog_pro
```

The application will use this if provided, otherwise it falls back to individual `DB_*` variables.

---

## Step 6: Verify Deployment

### 6.1 Monitor Deployment Logs

1. In Render service dashboard, click **Logs** tab
2. Watch for startup messages
3. You should see:
   ```
   TypeORM connected to PostgreSQL
   GraphQL server running on port 3000
   ```

### 6.2 Test GraphQL Endpoint

Once deployment completes:

1. Get your service URL from Render (format: `https://backlog-pro-backend-xxxx.onrender.com`)
2. Open in browser: `https://backlog-pro-backend-xxxx.onrender.com/graphql`
3. Apollo Sandbox should load
4. Try a simple query:
   ```graphql
   query {
     __typename
   }
   ```

### 6.3 Check Database Connection

In Apollo Sandbox, run:

```graphql
query {
  health {
    status
    database
  }
}
```

If using a health endpoint (if implemented), verify the response indicates database is connected.

### 6.4 Verify Service Status

- Green checkmark in Render dashboard = service is running
- Logs show no errors
- GraphQL endpoint responds

✅ **Deployment successful!**

---

## Troubleshooting

### Issue: "Image pull failed" or "Cannot connect to DockerHub"

**Cause:** Invalid DockerHub credentials or image URL

**Solution:**

1. Verify `DOCKERHUB_USERNAME` secret in GitHub is correct
2. Verify DockerHub image URL in Render is: `USERNAME/backlog-pro-backend:latest`
3. Check image exists in DockerHub (go to hub.docker.com/r/YOUR_USERNAME/backlog-pro-backend)
4. Re-run GitHub Actions workflow to republish image

**Command to check locally:**

```bash
docker pull your-username/backlog-pro-backend:latest
```

---

### Issue: "Failed to connect to database" or "ECONNREFUSED"

**Cause:** Incorrect database credentials or wrong connection URL

**Solution:**

1. Verify `DB_HOST` is the **internal** Render PostgreSQL URL (not external)
2. Verify `DB_PASSWORD`, `DB_USERNAME`, `DB_PORT` match Render database settings
3. Verify `DB_DATABASE` matches the database name created in Render
4. In Render dashboard, go to your PostgreSQL database service and confirm it's running (green status)

**Test connection locally:**

```bash
psql -h YOUR_DB_HOST -U postgres -d backlog_pro -W
# Enter password when prompted
# If prompt appears, connection is valid
```

---

### Issue: "Service keeps crashing" or "Deployment never completes"

**Cause:** Application error during startup

**Solution:**

1. Click **Logs** in Render service dashboard
2. Look for error messages
3. Common causes:
   - Missing environment variables → Add all variables from Step 5.1
   - Database migration failed → Manually run migrations or check DB state
   - Port already in use → Verify PORT=3000 is set
   - Wrong Node version → Ensure `package.json` uses Node 18+

**To manually run migrations in Render:**

If you have shell access to the service, run:

```bash
npm run migration:run
```

Or rebuild the service:

```bash
# In Render dashboard, click "Clear Build Cache" then "Trigger Redeploy"
```

---

### Issue: "Health check failing"

**Cause:** GraphQL endpoint not responding or service unhealthy

**Solution:**

1. Verify application is running: Check logs for startup messages
2. Verify port is correct: Should be 3000
3. Verify health check path: Should be `/graphql` or `/health`
4. Manually test: Open GraphQL endpoint in browser
5. If still failing, increase timeout in Render health check settings (10s → 30s)

---

### Issue: "JWT_SECRET not set" or "Authentication failing"

**Cause:** JWT_SECRET environment variable missing

**Solution:**

1. Generate a new secret (see Step 5.2)
2. Add `JWT_SECRET` environment variable in Render
3. Restart service (or manually trigger redeploy)

---

### Issue: "Port already in use" or "Cannot bind to port 3000"

**Cause:** Another process using port 3000, or PORT env var wrong

**Solution:**

1. Verify `PORT` environment variable is set to `3000`
2. Verify no other services are using port 3000
3. Restart service in Render dashboard

---

## Updating the Application

### Workflow for Deploying Updates

1. **Make code changes** in your local repo
2. **Update version** in `package.json` (optional but recommended):
   ```bash
   npm version patch  # Bumps 1.0.0 → 1.0.1
   ```
3. **Commit and push** to `main` branch:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
4. **GitHub Actions runs** automatically:
   - Runs tests
   - Builds Docker image
   - Publishes to DockerHub with new tag
5. **Render auto-deploys** (if enabled):
   - Pulls new image
   - Stops old container
   - Starts new container
   - Runs health check

### Manual Redeploy in Render

If auto-deploy is disabled or you want to force a redeploy:

1. Go to Render service dashboard
2. Click **Manual Redeploy** button
3. Render will pull the latest `:latest` image and restart

---

## Database Migrations in Render

If you need to run migrations in the production database:

### Option 1: One-off Commands

Render allows running one-off commands in a service. From the Render dashboard:

1. Click **Shell** tab in your service
2. Run:
   ```bash
   npm run migration:run
   ```

### Option 2: Via Docker Locally (safer)

Run migrations against Render's database from your local machine:

```bash
# Set environment to point to Render database
export DB_HOST=your-render-db-host.onrender.com
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=your-render-password
export DB_DATABASE=backlog_pro
export DB_SSL=true

# Run migrations
npm run migration:run
```

⚠️ **Always backup your database before running migrations in production!**

---

## Scaling & Performance Tips

1. **Database Plan:** Start with Free, upgrade to Starter or Standard as traffic grows
2. **Service Plan:** Render free tier includes 750 compute hours/month. Upgrade to paid for production
3. **Connection Pooling:** TypeORM is configured with connection pooling
4. **Caching:** Consider Redis for caching (add as another Render service)
5. **Monitoring:** Enable Render metrics to monitor CPU, memory, and disk usage

---

## Security Best Practices

1. ✅ Use environment variables for all secrets (never hardcode)
2. ✅ Enable DB_SSL=true for encrypted database connections
3. ✅ Use strong JWT_SECRET (32+ characters, random)
4. ✅ Keep DockerHub token safe (use GitHub Secrets)
5. ✅ Don't commit `.env` files to Git
6. ✅ Regularly rotate JWT_SECRET and DB_PASSWORD
7. ✅ Use HTTPS for your Render domain (Render provides free SSL)
8. ✅ Enable rate limiting if handling high traffic

---

## Support & Additional Resources

- **Render Docs:** https://render.com/docs
- **Render PostgreSQL:** https://render.com/docs/databases
- **Render Docker:** https://render.com/docs/docker
- **Docker Hub:** https://hub.docker.com
- **GitHub Actions:** https://docs.github.com/en/actions
- **Project Repo:** https://github.com/eviordevelopments/backlog-pro-backend

---

**Last Updated:** November 26, 2025
