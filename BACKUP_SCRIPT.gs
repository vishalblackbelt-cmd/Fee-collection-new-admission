/**
 * Google Apps Script - Automatic Backup for Admission Form Data Sheet
 * 
 * This script automatically backs up the main Google Sheet to Google Drive
 * Triggered to run daily at a scheduled time
 * Keeps the last 30 backups to manage storage
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet containing admission data
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this backup.gs file
 * 4. Save the project
 * 5. Click "Run" to test, then authorize permissions
 * 6. Go to Triggers (clock icon) and create a new trigger:
 *    - Function: backupSheetToGoogleDrive
 *    - Deployment: Head
 *    - Event source: Time-driven
 *    - Type of time based trigger: Day timer
 *    - Time of day: Your preferred time (e.g., 2:00 AM)
 *    - Failure notification: Email
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const BACKUP_FOLDER_NAME = 'Admission Form Data Backups';
const MAX_BACKUPS_TO_KEEP = 30; // Keep last 30 backups
const ENABLE_EMAIL_NOTIFICATIONS = true;
const ADMIN_EMAIL = 'vishalblackbelt@okicici'; // Change to actual admin email

// ============================================================================
// MAIN BACKUP FUNCTION
// ============================================================================

/**
 * Main function to backup the current sheet to Google Drive
 * Called daily via Apps Script trigger
 */
function backupSheetToGoogleDrive() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const backupFolderId = getOrCreateBackupFolder();
    
    if (!backupFolderId) {
      throw new Error('Could not create or locate backup folder');
    }
    
    // Create backup copy with timestamp
    const timestamp = new Date();
    const backupName = `${ss.getName()} - Backup ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')}`;
    
    const backupFile = ss.copy(backupName);
    const backupFileId = backupFile.getId();
    
    // Move backup to the designated backup folder
    const file = DriveApp.getFileById(backupFileId);
    file.moveTo(DriveApp.getFolderById(backupFolderId));
    
    // Log backup
    Logger.log(`✓ Backup created successfully: ${backupName}`);
    
    // Clean up old backups (keep only last 30)
    cleanupOldBackups(backupFolderId);
    
    // Send notification email
    if (ENABLE_EMAIL_NOTIFICATIONS) {
      sendBackupNotification(backupName, 'success', backupFileId);
    }
    
    return {
      success: true,
      backupName: backupName,
      backupId: backupFileId,
      timestamp: timestamp.toISOString()
    };
    
  } catch (error) {
    Logger.log(`✗ Backup failed: ${error.message}`);
    
    if (ENABLE_EMAIL_NOTIFICATIONS) {
      sendBackupNotification('', 'error', null, error.message);
    }
    
    throw error;
  }
}

// ============================================================================
// BACKUP FOLDER MANAGEMENT
// ============================================================================

/**
 * Get or create the backup folder in Google Drive
 * @returns {string} Folder ID
 */
function getOrCreateBackupFolder() {
  try {
    const query = `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const folders = DriveApp.searchFolders(query);
    
    if (folders.hasNext()) {
      const folder = folders.next();
      Logger.log(`✓ Using existing backup folder: ${folder.getName()}`);
      return folder.getId();
    }
    
    // Create new backup folder if it doesn't exist
    const newFolder = DriveApp.createFolder(BACKUP_FOLDER_NAME);
    Logger.log(`✓ Created new backup folder: ${newFolder.getName()}`);
    return newFolder.getId();
    
  } catch (error) {
    Logger.log(`✗ Error accessing/creating backup folder: ${error.message}`);
    throw error;
  }
}

/**
 * Delete old backups, keeping only the most recent ones
 * @param {string} backupFolderId - Folder ID containing backups
 */
function cleanupOldBackups(backupFolderId) {
  try {
    const backupFolder = DriveApp.getFolderById(backupFolderId);
    const files = backupFolder.getFiles();
    const filesList = [];
    
    // Collect all files with metadata
    while (files.hasNext()) {
      const file = files.next();
      filesList.push({
        id: file.getId(),
        name: file.getName(),
        dateCreated: file.getDateCreated()
      });
    }
    
    // Sort by creation date (newest first)
    filesList.sort((a, b) => b.dateCreated - a.dateCreated);
    
    // Delete files beyond the retention limit
    if (filesList.length > MAX_BACKUPS_TO_KEEP) {
      const filesToDelete = filesList.slice(MAX_BACKUPS_TO_KEEP);
      
      filesToDelete.forEach((fileData) => {
        DriveApp.getFileById(fileData.id).setTrashed(true);
        Logger.log(`✓ Deleted old backup: ${fileData.name}`);
      });
      
      Logger.log(`✓ Cleanup complete: Deleted ${filesToDelete.length} old backups`);
    }
    
  } catch (error) {
    Logger.log(`✗ Error during cleanup: ${error.message}`);
    // Don't throw - cleanup is secondary to backup success
  }
}

// ============================================================================
// NOTIFICATION & LOGGING
// ============================================================================

/**
 * Send email notification about backup status
 * @param {string} backupName - Name of the backup
 * @param {string} status - 'success' or 'error'
 * @param {string} backupFileId - File ID if successful
 * @param {string} errorMessage - Error message if failed
 */
function sendBackupNotification(backupName, status, backupFileId, errorMessage = '') {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    
    let subject, htmlBody;
    
    if (status === 'success') {
      subject = `✓ Google Sheet Backup Successful - ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'MMM dd, yyyy HH:mm')}`;
      
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">✓ Backup Successful</h2>
          <p><strong>Spreadsheet:</strong> ${ss.getName()}</p>
          <p><strong>Backup Name:</strong> ${backupName}</p>
          <p><strong>Backup Time:</strong> ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'MMMM dd, yyyy HH:mm:ss zzz')}</p>
          <p><strong>Location:</strong> Google Drive > ${BACKUP_FOLDER_NAME}</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated backup notification. Your admission form data has been safely backed up to Google Drive.
          </p>
        </div>
      `;
    } else {
      subject = `✗ Google Sheet Backup Failed - ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'MMM dd, yyyy HH:mm')}`;
      
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c62828;">✗ Backup Failed</h2>
          <p><strong>Spreadsheet:</strong> ${ss.getName()}</p>
          <p><strong>Failed Time:</strong> ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'MMMM dd, yyyy HH:mm:ss zzz')}</p>
          <p><strong>Error:</strong> <span style="color: #c62828;">${errorMessage}</span></p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Please investigate immediately. Check the Apps Script execution logs for more details.
          </p>
        </div>
      `;
    }
    
    // Send email to admin
    if (ADMIN_EMAIL) {
      GmailApp.sendEmail(ADMIN_EMAIL, subject, '', {htmlBody: htmlBody});
      Logger.log(`✓ Notification email sent to ${ADMIN_EMAIL}`);
    }
    
  } catch (error) {
    Logger.log(`✗ Error sending notification: ${error.message}`);
    // Don't throw - notification failure shouldn't block backup
  }
}

// ============================================================================
// MANUAL & TEST FUNCTIONS
// ============================================================================

/**
 * Get backup folder status and list recent backups
 * Useful for checking backup health
 */
function getBackupStatus() {
  try {
    const backupFolderId = getOrCreateBackupFolder();
    const backupFolder = DriveApp.getFolderById(backupFolderId);
    const files = backupFolder.getFiles();
    
    const filesList = [];
    while (files.hasNext()) {
      const file = files.next();
      filesList.push({
        name: file.getName(),
        size: `${(file.getSize() / 1024 / 1024).toFixed(2)} MB`,
        dateCreated: file.getDateCreated().toISOString(),
        url: file.getUrl()
      });
    }
    
    // Sort by date (newest first)
    filesList.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    
    const status = {
      backupFolderName: backupFolder.getName(),
      backupFolderId: backupFolderId,
      backupFolderUrl: backupFolder.getUrl(),
      totalBackups: filesList.length,
      recentBackups: filesList.slice(0, 5)
    };
    
    Logger.log(JSON.stringify(status, null, 2));
    return status;
    
  } catch (error) {
    Logger.log(`Error getting backup status: ${error.message}`);
    throw error;
  }
}

/**
 * Manual test function to verify backup works
 * Call from the Apps Script editor for testing
 */
function testBackup() {
  Logger.log('Starting manual backup test...');
  const result = backupSheetToGoogleDrive();
  Logger.log(`Backup test result: ${JSON.stringify(result, null, 2)}`);
  console.log('Manual backup test completed. Check Execution logs for details.');
}
