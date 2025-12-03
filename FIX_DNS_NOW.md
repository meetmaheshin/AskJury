# URGENT: Fix askjury.com DNS Configuration

## Problem:
Your domain `askjury.com` is pointing to recourseai.com's server instead of your Hostinger hosting.

## NOT HACKED - Just Wrong DNS Configuration

This is a DNS misconfiguration. Your domain registrar has the wrong DNS records.

---

## SOLUTION: Update DNS Records

### Step 1: Get Your Hostinger IP Address

1. **Login to Hostinger hPanel**: https://hpanel.hostinger.com
2. Go to **"Hosting"** or **"Websites"**
3. Click on your hosting plan
4. Look for **"Server IP"** or **"IP Address"**
5. Copy this IP address (something like `123.45.67.89`)

---

### Step 2: Login to Your Domain Registrar

Where did you buy `askjury.com`? Common options:
- GoDaddy
- Namecheap
- Google Domains
- Hostinger (if you bought domain there too)
- Other registrar

**Login to that website** where you purchased the domain.

---

### Step 3: Go to DNS Management

Different registrars have different interfaces:

**GoDaddy:**
1. My Products → Domains → askjury.com
2. Click "Manage DNS"

**Namecheap:**
1. Domain List → Manage
2. Advanced DNS tab

**Google Domains:**
1. My Domains → askjury.com
2. DNS settings

**Hostinger:**
1. Domains → askjury.com
2. DNS / Nameservers

---

### Step 4: Update DNS Records

Look for **A Records** (Address Records)

**Delete or Update:**

Find the A record for:
- Host: `@` or blank or `askjury.com`
- Currently pointing to: (some IP that belongs to recourseai.com)

**Change it to:**
- Type: `A Record`
- Host: `@` (or blank)
- Points to: `[Your Hostinger IP from Step 1]`
- TTL: `3600` or `Auto`

**Also add/update www:**
- Type: `CNAME`
- Host: `www`
- Points to: `askjury.com`
- TTL: `3600`

---

### Step 5: Save and Wait

1. Click **"Save"** or **"Save Changes"**
2. DNS changes take **5-60 minutes** to propagate
3. Sometimes up to 24 hours (rare)

---

## Alternative: Use Hostinger Nameservers (Easier)

If you're having trouble with DNS records, you can point your entire domain to Hostinger's nameservers:

### In Your Domain Registrar:

1. Find **"Nameservers"** or **"DNS Servers"** setting
2. Change from current nameservers to Hostinger's:
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```
   (Or check Hostinger for their exact nameservers)

3. Save changes
4. Then manage all DNS in Hostinger hPanel

---

## How to Check if DNS is Fixed:

### Option 1: Wait and Visit
Wait 30 minutes, then visit `https://askjury.com` in **incognito mode**

### Option 2: Check DNS Now
Use this website: https://dnschecker.org/
- Enter: `askjury.com`
- Check what IP it resolves to
- Should match your Hostinger IP

---

## Summary:

**Current State:**
- askjury.com → Points to recourseai.com server ❌
- www.askjury.com → Points to Hostinger ✅

**After Fix:**
- askjury.com → Points to Hostinger ✅
- www.askjury.com → Points to Hostinger ✅

---

## Need Your Hostinger IP?

If you can't find it in hPanel, try:
1. Go to hPanel → Hosting
2. Look for "Server Information" or "IP Address"
3. Or contact Hostinger support for your server IP

---

## Still Stuck?

Take screenshots of:
1. Your domain registrar's DNS management page
2. Your Hostinger hosting details page (with IP)

Then I can give you specific instructions!
