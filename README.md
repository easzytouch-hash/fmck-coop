# FMCK MultiPurpose Cooperative Society - Registration Portal

Welcome to the registration portal repository for the **Federal Medical Center, Kumo (FMCK) MultiPurpose Cooperative Society**.

---

## 📁 Repository Structure

```
fmck-coop/
├── .gitignore              # Configured to ignore code.gs from git commits
├── code.gs                 # Google Apps Script for Form creation & Sheet connection
├── index.html              # Leaf Green & White Frontend Registration Portal
├── styles.css              # Custom design system & responsive styling
├── script.js               # Form validation, preview modal, receipt generation & API integration
├── assets/
│   └── logo.png            # FMC Kumo official logo asset
└── README.md               # Setup and deployment instructions
```

---

## ⚙️ 1. Setting Up Google Apps Script (`code.gs`)

1. Open [Google Apps Script Editor](https://script.google.com/).
2. Click **+ New project**.
3. Replace the default code with the contents of [`code.gs`](file:///c:/Users/user/Documents/desktop/Halimafactor%202025/FMC%20KUMO%20STAFF%20DATABASE%20INFO/fmck-coop/code.gs).
4. Target Sheet ID is pre-configured as:
   `17U6ENg_2pwhJrYcgLPtQ29y3vxXwf111iWM_SmGYrzA`
5. Select the function `createAndConnectForm` from the dropdown and click **Run**.
6. Grant permissions when prompted. The script will:
   - Programmatically create the Google Form with all 9 required fields.
   - Automatically link form responses to Google Sheet `17U6ENg_2pwhJrYcgLPtQ29y3vxXwf111iWM_SmGYrzA`.
   - Log the Google Form view and edit URLs in the Execution Log.

### Optional: Web App Endpoint for Direct Front-End Submissions
If you wish to submit directly from this frontend web application into the Google Sheet:
1. In Apps Script Editor, click **Deploy > New deployment**.
2. Select **Web app**.
3. Set **Execute as**: *Me*.
4. Set **Who has access**: *Anyone*.
5. Click **Deploy**, copy the generated Web App URL.
6. Open `script.js` and paste your URL into line 8:
   ```javascript
   const APPS_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/.../exec";
   ```

---

## 🌐 2. Hosting Frontend on GitHub Pages

1. Commit and push your local files to GitHub (note: `code.gs` is automatically ignored via `.gitignore`):
   ```bash
   git add .
   git commit -m "Initial commit - FMCK Cooperative Registration Portal"
   git push origin main
   ```
2. Go to your repository **Settings** on GitHub.
3. Select **Pages** from the sidebar menu.
4. Under **Build and deployment > Branch**, select `main` (or `master`) and `/root`.
5. Click **Save**. GitHub Pages will publish your site within 1–2 minutes!

---

## 📋 The 9 Registration Questions Included

1. **NAME** (Surname First Name Middle Name)
2. **Staff ID / File No.**
3. **DEPARTMENT**
4. **Unit**
5. **IPPIS NO.**
6. **PHONE NO.**
7. **MONTHLY SAVINGS Amount**
8. **Next of Kin**
9. **Declaration & Consent Checkbox**

---
*Developed for Federal Medical Center, Kumo (FMCK)*
