# Railway OAuth Environment Variables Setup

## The Issue
You're getting "Internal server error" when clicking "Continue with Google" because Railway doesn't have the OAuth credentials yet.

## Solution: Add Environment Variables to Railway

### Step 1: Open Railway Dashboard
1. Go to https://railway.app/
2. Login to your account
3. Click on your "askjury-production" project

### Step 2: Access Variables Tab
1. Click on your **backend service** (the one running your Node.js API)
2. Click on the **Variables** tab in the top navigation

### Step 3: Add These 7 Variables

Click "Add Variable" and add each of these one by one:

#### Google OAuth Variables
```
Variable Name: GOOGLE_CLIENT_ID
Value: 1068469373710-lhjrannl7htqkkgao9e7742lcievflrc.apps.googleusercontent.com
```

```
Variable Name: GOOGLE_CLIENT_SECRET
Value: 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
```

```
Variable Name: GOOGLE_CALLBACK_URL
Value: https://askjury-production.up.railway.app/api/auth/google/callback
```

#### GitHub OAuth Variables
```
Variable Name: GITHUB_CLIENT_ID
Value: Ov23l1Lj3pFMZTZdTS5V
```

```
Variable Name: GITHUB_CLIENT_SECRET
Value: 12cdda1ea680bef85cad25d77c7efce3886d668d
```

```
Variable Name: GITHUB_CALLBACK_URL
Value: https://askjury-production.up.railway.app/api/auth/github/callback
```

#### Frontend URL Variable
```
Variable Name: FRONTEND_URL
Value: https://askjury.com
```

### Step 4: Wait for Automatic Redeploy
- Railway will automatically redeploy your backend service after you add the variables
- This takes 1-2 minutes
- You'll see the deployment status in the Deployments tab

### Step 5: Test OAuth Again
1. Go to https://askjury.com/login
2. Click "Continue with Google"
3. Grant permissions
4. You should now be redirected back and logged in successfully!

## What This Fixes

Before: Passport.js strategies were not initialized (conditional check failed)
After: Passport.js will detect the environment variables and initialize Google/GitHub OAuth strategies
Result: OAuth callbacks will work properly and generate JWT tokens

## Verification

After Railway redeploys, you can verify it's working by checking the Railway logs:
- You should see: "Server running on port XXXX"
- You should NOT see: "⚠️  Google OAuth credentials not configured"
- You SHOULD see Passport initialization without errors

## Need Help?

If you still get errors after adding the variables:
1. Check Railway deployment logs for any error messages
2. Verify all 7 variables are set correctly (no extra spaces, correct values)
3. Make sure you added them to the BACKEND service, not the frontend
4. Wait for the full deployment to complete (green checkmark in Deployments tab)
