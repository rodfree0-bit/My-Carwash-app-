# Landing Page Deployment

This landing page is configured to deploy to a **SEPARATE** Firebase project from the main app.

## Setup

1. Create a new Firebase project for the landing page (e.g., `mycarwashla-landing`)
2. Initialize Firebase in this directory:
   ```bash
   cd landing
   firebase init hosting
   ```
3. Select the NEW landing project (NOT the main app project)

## Deploy

From the `landing/` directory:

```bash
firebase deploy
```

## Important Notes

- ✅ This landing page has its own `firebase.json` configuration
- ✅ It serves files directly from the `landing/` directory
- ✅ MIME types are properly configured for JS and CSS files
- ⚠️ **DO NOT deploy this to the main app's Firebase project**

## Files Structure

```
landing/
├── firebase.json       # Firebase config (separate from main app)
├── index.html         # Landing page HTML
├── styles.css         # Landing page styles
├── script.js          # Landing page JavaScript
└── README.md          # This file
```

## Fixing MIME Type Errors

The previous MIME type errors were caused by:
1. Firebase rewrites redirecting ALL requests to index.html
2. JS/CSS files being served as HTML instead of their proper MIME types

This is now fixed with proper Content-Type headers in firebase.json.
