# GOLO Backend - Render Environment Setup

## Critical: Update CORS_ORIGINS on Render Dashboard

You must update the `CORS_ORIGINS` environment variable on Render to allow requests from your Vercel frontend.

### Steps to Fix CORS Error:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your service**: `golo-backend`
3. **Click "Environment"**
4. **Find or add `CORS_ORIGINS` variable** and set it to:
   ```
   https://golo-frontend.vercel.app,http://localhost:3000
   ```
5. **Save and redeploy**: Render will automatically restart the service

### Current CORS Configuration:

The backend accepts comma-separated origins in the `CORS_ORIGINS` environment variable:

```env
CORS_ORIGINS=https://golo-frontend.vercel.app,http://localhost:3000
```

### All Required Environment Variables:

These should already be set on Render, but verify they exist:

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `3002` | Backend server port |
| `NODE_ENV` | `production` | Environment mode |
| `CORS_ORIGINS` | `https://golo-frontend.vercel.app,http://localhost:3000` | **CRITICAL: Frontend URL** |
| `MONGODB_URI` | `mongodb+srv://atharvapugade83:...` | Database connection |
| `ENABLE_KAFKA` | `false` | Kafka disabled |
| `JWT_SECRET` | `supersecret123` | JWT signing key |
| `JWT_REFRESH_SECRET` | `superrefreshsecret123` | Refresh token key |
| `JWT_EXPIRATION` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRATION` | `7d` | Refresh token lifetime |

### Verify the Fix:

After updating on Render, you should see:
- ✅ API calls working from https://golo-frontend.vercel.app
- ✅ No CORS errors in browser console
- ✅ Ads loading on the homepage
- ✅ Login/Registration working

### Local Development:

Your `.env` file locally already has this configured for development.
