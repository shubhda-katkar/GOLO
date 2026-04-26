# Admin Reports Debug Guide

## Issue Detected
The admin reports page shows **"Failed to load reports"** because:
1. **Frontend API URL mismatch** - Frontend was configured for production (`https://golo-backend.onrender.com`) instead of local backend (`http://localhost:3002`)
2. **No test data** - Database might not have any reports to display

---

## ✅ Solution Steps

### Step 1: Update Frontend Environment
A new `.env.local` file has been created at `GOLO_Frontend/.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_API_BASE=http://localhost:3002
```

**Verify it exists:**
```bash
cat GOLO_Frontend/.env.local
```

### Step 2: Restart Frontend Development Server
```bash
cd GOLO_Frontend
npm run dev
# OR with pnpm
pnpm dev
```
> Wait for build to complete, then refresh browser

### Step 3: Verify Backend is Running
Check if backend is running on port 3002:
```bash
# In PowerShell (if backend is running in another terminal)
netstat -ano | findstr :3002
# You should see LISTENING status

# OR test the endpoint directly
curl -X GET http://localhost:3002/ads/reports \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Step 4: Create Sample Reports for Testing
Run the test data script:
```bash
cd GOLO_Backend
node scripts/create-test-reports.js
```

**Expected output:**
```
✅ Connected to MongoDB
🧹 Cleared existing test reports
✅ Created test ad: test-ad-xxx
  ✅ Created report 1/5: spam
  ✅ Created report 2/5: inappropriate
  ✅ Created report 3/5: fraud
  ✅ Created report 4/5: duplicate
  ✅ Created report 5/5: other
✅ Updated ad report count: 5

✨ Test data created successfully!

📊 Summary:
  - Test Ad ID: test-ad-xxx
  - Total Reports: 5
  - Reasons: spam, inappropriate, fraud, duplicate, other

🔗 Visit: http://localhost:3000/admin/reports
   You should see 5 new reports in the admin queue
```

---

## 🔍 Debugging Checklist

### Check Frontend Logs
Open **Browser DevTools (F12)** → **Console** tab:
- ✅ Should see: `📥 Fetching reports from API...`
- ✅ Should see: `✅ API Response: { success: true, data: [...], count: N }`
- ❌ If error: `❌ API returned unsuccessful:` or connection failed

### Check Backend Logs
Look for these messages in backend terminal:
```
✅ Admin fetching all reports queue
📊 Total reports in database: 5
✅ Successfully fetched 5 reports with ad details
```

### Network Request in DevTools
1. Open DevTools → **Network** tab
2. Click "Refresh" on admin reports page
3. Look for request to: `GET /ads/reports`
4. Should see:
   - **Status: 200** (success)
   - **Response:** JSON with reports data

---

## 🎯 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Status 401 Unauthorized** | JWT token expired. Log out and log back in as admin |
| **Status 403 Forbidden** | User is not admin. Check `user.role === 'admin'` in AuthContext |
| **CORS Error** | Backend CORS not allowing localhost:3000. Check `.env` CORS_ORIGINS |
| **No data returned** | Database has no reports. Run `create-test-reports.js` script |
| **Empty array** | Reports exist but not linked to ads. Check ad IDs match |

---

## 📝 Endpoint Details

### GET /ads/reports
- **Requires:** JWT token + Admin role
- **Returns:** All reports with ad details (loaded via MongoDB lookup)
- **Response format:**
```json
{
  "success": true,
  "data": [
    {
      "reportId": "uuid",
      "adId": "ad-uuid",
      "reportedBy": "user-id",
      "reason": "spam|inappropriate|fraud|duplicate|other",
      "description": "Report description",
      "status": "pending|reviewed|action_taken",
      "adminNotes": "Admin notes",
      "createdAt": "2026-03-13T...",
      "ad": {
        "title": "Ad title",
        "status": "active",
        "reportCount": 5
      }
    }
  ],
  "count": 1,
  "timestamp": "2026-03-13T..."
}
```

---

## 🚀 Production Deployment Notes

**Frontend (.env.production):**
```
NEXT_PUBLIC_API_URL=https://golo-backend.onrender.com
```

**Backend (PORT: 3002):**
- CORS_ORIGINS includes production frontend URL
- JWT_SECRET should be strong secret in production
- MongoDB should be production cluster

---

## 📧 Still Having Issues?

1. **Check MongoDB connection:** `mongosh "mongodb+srv://..."`
2. **Verify admin user role:** Check user document in `users` collection
3. **Check Kafka status:** If ENABLE_KAFKA=true, ensure Kafka is running
4. **Review backend logs:** Look for error stack traces

---

## ✨ Expected Behavior After Fix

1. ✅ Admin logs in and navigates to `/admin/reports`
2. ✅ Page shows "All Reports Queue" with real-time connection indicator
3. ✅ Lists all reports from database with:
   - Ad title and ID
   - Report reason (spam, inappropriate, fraud, etc.)
   - Status (pending, reviewed, action_taken)
   - Reporter ID and date
   - Action buttons (Review)
4. ✅ Reports update in real-time when new reports are submitted
5. ✅ Auto-refresh every 30 seconds as fallback
