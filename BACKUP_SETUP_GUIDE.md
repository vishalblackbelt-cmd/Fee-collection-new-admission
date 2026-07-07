# Google Sheet Backup Setup Guide

## Overview

This guide explains how to set up automatic daily backups of your Google Sheet (containing admission form data) to Google Drive using Google Apps Script.

**Key Features:**
- ✅ Automatic daily backups with timestamps
- ✅ Keeps last 30 backups (automatic cleanup)
- ✅ Email notifications on success/failure
- ✅ No manual intervention required
- ✅ Stores backups in dedicated Google Drive folder
- ✅ Easy recovery if data is accidentally deleted

---

## Step-by-Step Setup

### Step 1: Access Your Google Sheet

1. Open your Google Sheet with admission form data
2. Note the sheet name (you'll see it in the browser tab)

### Step 2: Open Google Apps Script Editor

1. In your Google Sheet, click **Extensions** (top menu)
2. Select **Apps Script**
3. A new tab will open with the Apps Script editor

### Step 3: Add the Backup Code

1. In the Apps Script editor, delete the default `function myFunction() {}` code
2. Copy the entire contents of `BACKUP_SCRIPT.gs` from this repository
3. Paste it into the editor
4. Click **Save** (Ctrl+S or Cmd+S)

### Step 4: Authorize the Script

1. Click the **Run** button (play icon) in the toolbar
2. A popup will appear asking for authorization
3. Click **Review Permissions**
4. Select your Google account
5. Click **Allow** to grant permissions

**Why these permissions?**
- **View and manage your Google Drive files** - to create and manage backup copies
- **Send emails on your behalf** - to send backup notification emails
- **View and manage spreadsheets** - to copy your data

### Step 5: Configure Settings (Optional)

Edit these lines in the script if needed:

```javascript
const BACKUP_FOLDER_NAME = 'Admission Form Data Backups'; // Change folder name if desired
const MAX_BACKUPS_TO_KEEP = 30; // Change retention (30 = keep last 30 backups)
const ENABLE_EMAIL_NOTIFICATIONS = true; // Set to false to disable emails
const ADMIN_EMAIL = 'vishalblackbelt@okicici'; // CHANGE THIS TO YOUR EMAIL
```

### Step 6: Set Up Daily Backup Trigger

1. In the Apps Script editor, click the **Triggers** icon (⏰ clock icon on left sidebar)
2. Click **Create new trigger** (bottom right)
3. Configure the trigger:
   - **Choose which function to run:** `backupSheetToGoogleDrive`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `Time-driven`
   - **Select type of time based trigger:** `Day timer`
   - **Select time of day:** Choose your preferred time (e.g., 2:00 AM for midnight backups)
   - **Select failure notification settings:** `Notify me immediately`

4. Click **Save**

✅ Your backup is now scheduled!

---

## Verifying Your Setup

### Check if First Backup Worked

1. In the Apps Script editor, click **Executions** (on left sidebar)
2. Look for the most recent execution of `backupSheetToGoogleDrive`
3. If green checkmark ✅ - backup succeeded
4. If red X ❌ - click to see error details

### Manual Backup Test

1. In the Apps Script editor, select `testBackup` from the function dropdown (top center)
2. Click **Run**
3. Check **Executions** tab for results
4. Check your email for notification

### View Your Backups

1. Go to [Google Drive](https://drive.google.com)
2. Look for folder named **"Admission Form Data Backups"**
3. Inside you'll see timestamped backup copies of your sheet

---

## How Backups Work

### Daily Automatic Backup Process

```
Scheduled Time (e.g., 2:00 AM)
        ↓
    Trigger fires
        ↓
    Google Apps Script runs
        ↓
    Creates full copy of your Sheet
        ↓
    Moves copy to "Admission Form Data Backups" folder
        ↓
    Deletes backups older than 30 days
        ↓
    Sends email notification to admin
        ↓
    ✅ Backup complete
```

### Backup File Naming

Each backup is named with a timestamp:
```
Admission Form - Backup 2026-07-07 02:00:00
Admission Form - Backup 2026-07-06 02:00:00
Admission Form - Backup 2026-07-05 02:00:00
... and so on (keeps last 30)
```

### Storage Location

- **Location:** Google Drive > "Admission Form Data Backups" folder
- **Each backup size:** Same as your current sheet
- **Total storage:** ~Size of sheet × 30 backups
- **Example:** If sheet is 5MB, backups use ~150MB total storage

---

## Recovery: How to Restore from Backup

### If You Need to Recover Data

1. Go to [Google Drive](https://drive.google.com)
2. Open **"Admission Form Data Backups"** folder
3. Find the backup date you need
4. Right-click the backup file
5. Select **Make a copy**
6. The copy will appear in your main Google Drive
7. Rename it and use it as needed

### If Sheet Was Permanently Deleted

1. Go to [Google Drive Trash](https://drive.google.com/drive/trash)
2. Look for the original sheet
3. Right-click and **Restore**

**OR**

1. Open **"Admission Form Data Backups"** folder
2. Find the most recent backup
3. Make a copy and rename it

---

## Monitoring & Troubleshooting

### Check Backup Status

1. Go to Apps Script editor
2. Click **Executions** tab
3. Look for `backupSheetToGoogleDrive` function
4. Recent green checkmarks = all working ✅

### Email Notifications

**Success Email:**
- Contains: Backup name, time, location link
- Sent to: `ADMIN_EMAIL` setting

**Failure Email:**
- Contains: Error message
- Sent to: `ADMIN_EMAIL` setting
- Check if it landed in spam folder

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **Not receiving emails** | Check spam/promotions folder; verify `ADMIN_EMAIL` is correct |
| **Backup not running** | Check Apps Script Executions tab for errors; verify trigger is enabled |
| **Backups filling storage** | Reduce `MAX_BACKUPS_TO_KEEP` value (e.g., change 30 to 15) |
| **Permission denied errors** | Re-run `testBackup()` and re-authorize when prompted |

### Check Execution Logs

1. Click **Executions** tab in Apps Script
2. Click on any execution to see detailed logs
3. Look for ✓ or ✗ indicators
4. Scroll through logs to see what happened

---

## Important Notes

⚠️ **Important:**

1. **Backup is NOT real-time** - happens once per day at scheduled time
2. **Backup is NOT a replacement for Google Drive sync** - Drive keeps your current sheet synced
3. **Storage is counted against your Google Drive quota** - Each backup counts as a file
4. **Email notifications require Gmail** - If disabled in Google Workspace, notifications won't send
5. **Retention is automatic** - Old backups are automatically deleted after 30 days

---

## Advanced: Manual Backup Functions

### Trigger a Manual Backup Now

```javascript
// In Apps Script editor:
// 1. Select testBackup from function dropdown
// 2. Click Run
// Creates immediate backup + email notification
```

### Check Backup Status

```javascript
// In Apps Script editor:
// 1. Select getBackupStatus from function dropdown
// 2. Click Run
// Shows: Total backups, recent backups, folder location
// Output in Execution logs
```

### Disable Email Notifications

Edit this line in `BACKUP_SCRIPT.gs`:

```javascript
const ENABLE_EMAIL_NOTIFICATIONS = false; // Disable emails
```

Then Save and the script will still backup but won't send emails.

---

## Support & Questions

**For detailed info on Google Apps Script:**
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [DriveApp API Reference](https://developers.google.com/apps-script/reference/drive/drive-app)

**For this specific setup:**
- Check this repository's README or documentation
- Review execution logs in Apps Script editor
- Contact your technical administrator

---

## Backup Configuration Reference

```javascript
// File: BACKUP_SCRIPT.gs

// === CONFIGURABLE SETTINGS ===

// Name of the backup folder in Google Drive
const BACKUP_FOLDER_NAME = 'Admission Form Data Backups';

// How many backups to keep (oldest are automatically deleted)
const MAX_BACKUPS_TO_KEEP = 30;

// Enable/disable email notifications
const ENABLE_EMAIL_NOTIFICATIONS = true;

// Admin email to receive notifications
const ADMIN_EMAIL = 'vishalblackbelt@okicici'; // ← CHANGE THIS

// === FUNCTIONS ===

backupSheetToGoogleDrive()    // Main backup function (scheduled daily)
getOrCreateBackupFolder()      // Creates backup folder if needed
cleanupOldBackups()            // Deletes backups beyond retention
sendBackupNotification()       // Sends email on success/failure
getBackupStatus()              // Check status (run manually)
testBackup()                   // Test backup (run manually)
```

---

**Last Updated:** July 2026  
**Version:** 1.0  
**Compatibility:** Google Sheet, Google Drive, Google Apps Script
