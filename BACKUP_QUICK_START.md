# Google Sheet Backup - Quick Start Checklist

## ✅ What's Been Done

I've created a complete automated backup solution for your Google Sheet containing admission form data. Here are the files:

1. **BACKUP_SCRIPT.gs** - The Google Apps Script code for automatic backups
2. **BACKUP_SETUP_GUIDE.md** - Detailed setup and troubleshooting guide

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Open Your Google Sheet
- Navigate to your Google Sheet with admission form data
- Have it open in a browser tab

### Step 2: Add the Backup Script
1. Click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy all code from `BACKUP_SCRIPT.gs` in this repository
4. Paste into the Apps Script editor
5. Click **Save** (Ctrl+S or Cmd+S)

### Step 3: Authorize Permissions
1. Click the **Run** button (play icon)
2. A permission popup appears
3. Click **Review Permissions** → Select your account → **Allow**
4. Wait for execution to complete (check Executions tab)

### Step 4: Configure Email (Important!)
1. In the script editor, find this line:
   ```javascript
   const ADMIN_EMAIL = 'vishalblackbelt@okicici';
   ```
2. Replace `vishalblackbelt@okicici` with YOUR email address
3. Click **Save**

### Step 5: Set Up Daily Trigger
1. Click the **Triggers** icon (⏰) on the left sidebar
2. Click **Create new trigger**
3. Configure:
   - Function: `backupSheetToGoogleDrive`
   - Event source: `Time-driven`
   - Type: `Day timer`
   - Time: Choose your preferred time (e.g., 2:00 AM)
4. Click **Save**

**✅ Done! Backups will now run automatically daily.**

---

## 📋 What the Backup Does

| Feature | Details |
|---------|---------|
| **Frequency** | Once per day at your scheduled time |
| **Location** | Google Drive > "Admission Form Data Backups" folder |
| **What's backed up** | Complete copy of your entire Google Sheet |
| **Retention** | Last 30 backups (older ones auto-delete) |
| **Notifications** | Email sent to you on success or failure |
| **No manual work** | Completely automated |

---

## 🔍 Verify It's Working

### Immediate Test (After Setup)

1. In Apps Script editor, select `testBackup` from the function dropdown
2. Click **Run**
3. Check **Executions** tab - look for green ✅
4. Check your email for a test backup notification

### After 24 Hours

1. Check **Executions** tab - should show `backupSheetToGoogleDrive` ran
2. Go to Google Drive and look for folder: **"Admission Form Data Backups"**
3. Inside should be timestamped backup copies
4. Check your email for the daily backup notification

---

## 📂 Where to Find Your Backups

1. Go to [Google Drive](https://drive.google.com)
2. Look for folder: **"Admission Form Data Backups"**
3. Inside you'll see:
   ```
   Admission Form - Backup 2026-07-07 02:00:00
   Admission Form - Backup 2026-07-06 02:00:00
   Admission Form - Backup 2026-07-05 02:00:00
   ...and so on
   ```
4. Each is a complete backup of your sheet

---

## 🆘 Need to Restore Data?

### If You Accidentally Deleted Data

1. Go to Google Drive
2. Open **"Admission Form Data Backups"** folder
3. Find the date you need
4. Right-click → **Make a copy**
5. Now you have a copy to restore from

### If the Original Sheet is Gone

1. Go to [Google Drive Trash](https://drive.google.com/drive/trash)
2. Restore the sheet from trash, OR
3. Use the most recent backup from the backups folder

---

## ⚙️ Configuration Options

### Keep Fewer Backups (Save Storage)

In `BACKUP_SCRIPT.gs`, change this line:

```javascript
const MAX_BACKUPS_TO_KEEP = 30;  // Change 30 to smaller number, e.g., 15
```

### Disable Email Notifications

In `BACKUP_SCRIPT.gs`, change this line:

```javascript
const ENABLE_EMAIL_NOTIFICATIONS = false;  // Changes from true to false
```

Then click **Save** in the editor.

### Change Backup Folder Name

In `BACKUP_SCRIPT.gs`, change this line:

```javascript
const BACKUP_FOLDER_NAME = 'Admission Form Data Backups';  // Change to your preferred name
```

Then click **Save**.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Not receiving email notifications** | Check spam folder; verify `ADMIN_EMAIL` is correct; check if Gmail is blocked |
| **Backup not running** | Check Executions tab for errors; verify trigger is enabled; check time zone |
| **Storage filling up** | Reduce `MAX_BACKUPS_TO_KEEP` (e.g., 30 → 15) |
| **Permission denied** | Run `testBackup()` again and re-authorize when prompted |
| **Can't find Apps Script** | Make sure you're in your Google Sheet, not Google Drive |

**For detailed troubleshooting:** See `BACKUP_SETUP_GUIDE.md`

---

## 📊 Storage Impact

**Example Calculation:**
- Your sheet size: 5 MB
- Backups kept: 30
- Total storage used: ~150 MB (5 MB × 30)

**Storage is counted against your Google Drive quota.**

If you have 100 GB of storage:
- 150 MB is negligible (0.15% of quota)

If storage is a concern:
- Reduce `MAX_BACKUPS_TO_KEEP` to 15 or 10
- Example: 5 MB × 10 = only 50 MB

---

## ✨ Advanced Features

### Manual Backup Anytime

In Apps Script editor:
1. Select `testBackup` from function dropdown
2. Click **Run**
3. Creates immediate backup (doesn't wait for scheduled time)

### Check Backup Status

In Apps Script editor:
1. Select `getBackupStatus` from function dropdown
2. Click **Run**
3. Check Execution logs for:
   - Total number of backups
   - List of 5 most recent backups
   - Backup folder location

---

## 📝 After You Complete This

1. ✅ Copy code from `BACKUP_SCRIPT.gs`
2. ✅ Paste into Apps Script editor
3. ✅ Authorize permissions
4. ✅ Update your email address
5. ✅ Create daily trigger
6. ✅ Run test to verify
7. ✅ Check Google Drive for backups folder

**You're done!** Backups will now happen automatically.

---

## 📚 Complete Documentation

For more details, see:
- **BACKUP_SETUP_GUIDE.md** - Full setup guide with screenshots
- **BACKUP_SCRIPT.gs** - The actual backup code (well-commented)

---

## 💡 Key Points to Remember

- ⏰ Backups run once per day (not real-time)
- 📂 All backups stored in Google Drive
- 🔄 Auto-delete old backups (keep last 30)
- 📧 Email notifications on success/failure
- 💾 Counts against your Google Drive storage quota
- 🔐 Uses your existing Google account permissions
- ✨ Completely automatic - no manual work needed

---

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ First execution shows green checkmark in Executions tab
2. ✅ Folder "Admission Form Data Backups" appears in Google Drive
3. ✅ First backup file appears with timestamp
4. ✅ Email notification received
5. ✅ After 24 hours: Second backup created automatically

---

**Status: Ready to Deploy** ✅

All files are in this repository. Follow the Quick Start checklist above to enable backups.

Questions? See `BACKUP_SETUP_GUIDE.md` for comprehensive troubleshooting.
