# TravelTrust - Complete Setup, Build & App Store Submission Guide

## ⚡ QUICK START (5 MINUTES)

### Step 1: Install Node.js & Expo CLI
```bash
# Install Node.js from https://nodejs.org (LTS version)
# Then install Expo CLI globally
npm install -g eas-cli expo-cli

# Verify installation
eas --version
expo --version
```

### Step 2: Clone/Setup Project
```bash
# Copy all the app files to a directory
mkdir ~/travelrust-app
cd ~/travelrust-app

# Install dependencies
npm install

# Test locally
expo start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

---

## 🏗️ PROJECT SETUP INSTRUCTIONS

### File Structure You Need to Create:
```
travelrust-app/
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx (Login)
│   │   ├── register.tsx (Sign up)
│   │   └── verify-phone.tsx (stub)
│   └── (app)/
│       ├── _layout.tsx
│       ├── (rides)/
│       │   ├── _layout.tsx
│       │   ├── index.tsx (Home screen)
│       │   ├── [id].tsx (Ride details - stub)
│       │   └── post.tsx (Post ride - stub)
│       ├── (travel)/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── (chat)/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── (bookings)/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       └── (profile)/
│           ├── _layout.tsx
│           └── index.tsx
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── firebase.ts
│   ├── data/
│   │   └── demo-rides.ts
│   ├── hooks/ (optional, placeholders for now)
│   ├── components/ (optional)
│   └── types/
├── assets/
│   ├── icon.png (1024x1024)
│   ├── splash.png (1242x2436)
│   ├── adaptive-icon.png (108x108)
│   └── notification-icon.png (96x96)
├── app.json
├── package.json
├── tsconfig.json
├── .gitignore
├── eas.json
└── google-services.json (Android only)
```

### Creating Assets (Icons & Splash Screen):

**Option 1: Use Online Generator (RECOMMENDED)**
1. Go to https://www.appicon.co/
2. Upload a 1024x1024px image
3. Download iOS & Android icon packs
4. Place files in `assets/` folder

**Option 2: Create Using Figma**
1. Create a 1024x1024 canvas in Figma
2. Design your logo/icon
3. Export as PNG
4. Use AppIcon.co to generate all sizes

**Simple Icon (Text-based):**
If you don't have a design, create a simple 1024x1024 PNG with:
- Background: #007AFF (TravelTrust blue)
- Text: "TT" or car emoji
- Use https://www.canva.com (free tier works)

---

## 🔧 IMPORTANT: Firebase Setup (Required)

### Step 1: Create Firebase Project
1. Go to https://firebase.google.com
2. Click "Get Started" → "Add Project"
3. Project name: "travelrust"
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Register iOS App
1. In Firebase Console: Project Settings → Add App → iOS
2. Bundle ID: `com.travelrust.app`
3. App nickname: "TravelTrust iOS"
4. Download `GoogleService-Info.plist`
5. **Important**: Don't add this to Xcode (Expo handles it)

### Step 3: Register Android App
1. In Firebase Console: Project Settings → Add App → Android
2. Package name: `com.travelrust.app`
3. SHA-1 fingerprint: (leave blank for now, get after building)
4. Download `google-services.json`
5. Place in project root: `google-services.json`

### Step 4: Enable Authentication
1. Firebase Console → Authentication
2. Enable: Email/Password, Google, Apple Sign-In
3. Add test user if needed

### Step 5: Update app.json with Your Firebase Keys
```json
{
  "extra": {
    "firebaseConfig": {
      "apiKey": "YOUR_API_KEY_FROM_FIREBASE",
      "authDomain": "travelrust.firebaseapp.com",
      "projectId": "travelrust",
      "storageBucket": "travelrust.appspot.com",
      "messagingSenderId": "YOUR_SENDER_ID",
      "appId": "YOUR_APP_ID"
    }
  }
}
```

---

## 📱 BUILD FOR iOS (App Store)

### Step 1: Create EAS Account
```bash
# Login/Create account
eas login

# Enter email and password
# Or create at https://expo.dev
```

### Step 2: Create EAS Configuration
Create `eas.json` in project root:
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "node": "18.13.0",
      "ios": {
        "image": "latest",
        "resourceClass": "m1-medium"
      },
      "android": {
        "image": "latest",
        "resourceClass": "large"
      }
    },
    "preview": {
      "ios": {
        "image": "latest",
        "resourceClass": "m1-medium"
      },
      "android": {
        "image": "latest",
        "resourceClass": "large"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@example.com",
        "ascAppId": "YOUR_APP_ID_FROM_APP_STORE_CONNECT",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccount": "service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 3: Build iOS App
```bash
# Build for App Store (managed credentials by EAS)
eas build --platform ios

# Choose:
# - Managed: EAS manages signing (RECOMMENDED for first time)
# - Local: You manage signing certificates

# Wait for build to complete (15-30 minutes)
# Download .ipa file when ready
```

### Step 4: Set Up Apple Developer Account
1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Create App ID in "Identifiers": `com.travelrust.app`
4. Create provisioning profiles (EAS can help with this)

### Step 5: Submit to App Store
```bash
# Option 1: Automatic (recommended)
eas submit --platform ios

# Option 2: Manual via Transporter
# 1. Download Transporter from App Store
# 2. Sign in with Apple ID
# 3. Drag & drop .ipa file
# 4. Submit

# Or use Xcode (requires Mac):
# xcrun altool --upload-app -f app.ipa -t ios -u apple-id@example.com -p app-specific-password
```

---

## 🤖 BUILD FOR ANDROID (Google Play)

### Step 1: Generate Upload Key
```bash
# First time only - generates keystore for signing
eas build --platform android

# Choose: "Generate new Android Keystore"
# EAS will securely store this
```

### Step 2: Create Google Play Developer Account
1. Go to https://play.google.com/apps/publish
2. Pay $25 one-time developer fee
3. Create new app: "TravelTrust"
4. Fill in store listing

### Step 3: Build Android App
```bash
# Build release APK/AAB
eas build --platform android

# Wait for completion (20-40 minutes)
# This creates an Android App Bundle (.aab)
```

### Step 4: Upload to Google Play
```bash
# Automatic (recommended)
eas submit --platform android

# Manual:
# 1. Go to Google Play Console
# 2. Your app → "Internal testing" → "Releases"
# 3. Upload .aab file
# 4. Review and submit to production
```

---

## 📋 APP STORE SUBMISSION CHECKLIST

### iOS App Store

#### Before Submitting:
- [ ] Apple Developer Account created
- [ ] App ID created (`com.travelrust.app`)
- [ ] All assets ready:
  - [ ] App icon (1024x1024)
  - [ ] Screenshots (5 minimum, 1242x2208)
  - [ ] Preview video (optional, 30 seconds)
  - [ ] 170x170 logo (optional)
- [ ] Privacy Policy URL ready
- [ ] Terms of Service URL ready
- [ ] Contact email: `support@travelrust.com`
- [ ] Support URL: `https://travelrust.com/support`

#### In App Store Connect:
```
1. Go to https://appstoreconnect.apple.com
2. My Apps → + Create App
3. Fill in:
   - App Name: "TravelTrust"
   - Bundle ID: "com.travelrust.app"
   - SKU: "travelrust-001"
   - User Access: "Full Access"

4. App Information:
   - Category: "Social Networking"
   - Privacy Policy URL: https://travelrust.com/privacy
   - License Agreement: Standard

5. App Preview and Screenshots:
   - Upload screenshots showing:
     1. Login screen
     2. Search rides
     3. Ride details
     4. Chat feature
     5. User profile

6. App Description:
"TravelTrust connects the Indian community in Europe for safe, affordable ride sharing and travel assistance.

KEY FEATURES:
✓ Smart ride matching & search
✓ Secure in-app payments
✓ Real-time chat messaging
✓ User verification & ratings
✓ Travel companion network
✓ Emergency contact features

Perfect for airport transfers, city-to-city travel, and helping newly arrived family members.

SAFE & SECURE:
• Email & phone verification
• Stripe payment processing
• No cash transactions
• Report & block features
• Emergency assistance"

7. Keywords: "ride sharing, carpooling, travel, community, Indian, Europe"

8. Build:
   - Select iOS build from EAS
   - Set as "Default" build

9. Version Release:
   - "Automatic release after approval"

10. Content Rating:
    - Answer questionnaire
    - Rating: "4+" (general audiences)

11. App Review Information:
    - Demo account (if needed):
      Email: demo@travelrust.com
      Password: Demo123456
    - Contact info for questions

12. Click "Submit for Review"
```

#### Expected Review Time:
- Initial review: 24-48 hours
- Rejection/resubmission: Usually faster (1-2 cycles)
- Common rejection reasons:
  - Missing privacy policy
  - Incomplete screenshots
  - Misleading app description
  - Payment issues not disclosed

---

### Google Play Store

#### Before Submitting:
- [ ] Google Play Developer Account created ($25)
- [ ] App Store listing prepared:
  - [ ] App icon (512x512 PNG)
  - [ ] Feature graphics (1024x500)
  - [ ] Screenshots (2-8, 1080x1920 PNG)
  - [ ] App name & description
  - [ ] Privacy policy URL
  - [ ] Content rating questionnaire
- [ ] Google Play Services file (`google-services.json`) ready

#### In Google Play Console:
```
1. Go to https://play.google.com/console
2. Create app:
   - Name: "TravelTrust"
   - Default language: English (US)
   - App type: "App"
   - Free/Paid: "Free"
   - Target audience: "Teens and up"

3. Store Listing:
   - Short description: "Safe ride sharing & travel help"
   - Full description: (same as iOS)
   - Screenshots: 4-8 screenshots
   - Feature graphic: 1024x500px banner
   - App icon: 512x512px

4. Content Rating:
   - Complete questionnaire
   - Rating: "Everyone" or "Teens"

5. Data Safety:
   - Personal info: Name, email, phone
   - Location: GPS data (ride matching)
   - Payment info: Stripe (handled securely)
   - Encryption: Yes, in transit and at rest
   - Data deletion: Yes, on request
   - Data retention: 1 year after last use

6. Pricing:
   - Price: "Free"
   - Distribution: "Available in all countries"

7. Upload:
   - Go to "Internal testing" → "Releases"
   - Upload .aab file
   - Review details
   - Click "Submit to production"

8. Rollout:
   - Start with 10% rollout
   - Monitor crash rate
   - Gradually increase to 100%
```

#### Expected Review Time:
- Initial review: 2-4 hours
- Instant approval often happens
- Rejections are rare if following guidelines

---

## ✅ FINAL DEPLOYMENT STEPS

### Step 1: Test Thoroughly
```bash
# Before submitting, test on real devices:

# iOS:
eas build --platform ios --profile preview
# Download to TestFlight via:
# https://testflight.apple.com (invite users)

# Android:
eas build --platform android --profile preview
# Share APK/AAB with beta testers

# Test these scenarios:
- Login with email
- Sign up new account
- Search for rides
- View ride details
- Navigate all tabs
- Check notifications
- Test on different devices (iPhone/Android)
- Test on different iOS versions (13+)
- Test on different Android versions (8+)
```

### Step 2: Create Privacy Policy
Use https://www.freeprivacypolicy.com:
```
Include:
- Data collection (name, email, phone, location, payment info)
- How data is used
- Third-party services (Firebase, Stripe, Google Maps)
- User rights (deletion, export)
- Contact email for privacy questions
```

### Step 3: Create Terms of Service
Use https://www.termsfeed.com:
```
Include:
- User responsibilities
- Acceptable use
- Liability disclaimers
- Dispute resolution
- Changes to terms
```

### Step 4: Monitor After Launch
```bash
# Track performance:
- Crash rate (should be < 1%)
- Performance metrics
- User reviews & ratings
- Feature requests

# Tools:
- Firebase Console (errors, performance)
- App Store Connect (reviews, crashes)
- Google Play Console (reviews, crashes)

# Respond to reviews:
- Reply to negative reviews
- Thank users for positive reviews
- Fix issues quickly
- Release updates regularly
```

---

## 🚀 PUBLISHING UPDATES

### When You Make Changes:
```bash
# 1. Update version in app.json:
{
  "version": "1.0.1"  // was "1.0.0"
}

# 2. Build new version:
eas build --platform all

# 3. Submit to stores:
eas submit --platform all

# 4. (Optional) Auto-submit with updates:
# Create automatic deployment workflow in GitHub Actions
```

---

## ⚙️ CONFIGURATION REFERENCE

### app.json - Key Fields:
```json
{
  "expo": {
    "name": "TravelTrust",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.travelrust.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.travelrust.app",
      "versionCode": 1
    }
  }
}
```

### Version Numbers:
- iOS: `bundleIdentifier` (format: `com.travelrust.app`)
- Android: `package` (format: `com.travelrust.app`)
- App version: Increment with each release (1.0.0 → 1.0.1)
- Build number: Internal version number for app stores

### eas.json - For Automated Builds:
```json
{
  "build": {
    "production": {
      "node": "18.13.0",
      "ios": {
        "image": "latest"
      },
      "android": {
        "image": "latest"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com"
      }
    }
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Build Fails on iOS:
```bash
# Clear cache
rm -rf node_modules .expo dist
npm install

# Rebuild
eas build --platform ios --clean

# Check logs for specific error
```

### Build Fails on Android:
```bash
# Same as iOS
rm -rf node_modules .expo dist
npm install
eas build --platform android --clean
```

### App Won't Start:
- Check console logs: `expo start` and look for errors
- Verify all imports are correct
- Check that Demo data file exists: `src/data/demo-rides.ts`
- Clear AsyncStorage: `expo start --clear`

### Firebase Connection Issues:
- Verify Firebase config in `app.json`
- Check Firebase project is created
- Enable required authentication methods
- Check bundle IDs match exactly

### App Store Rejection:
- Read rejection reason carefully
- Check https://developer.apple.com/app-store/review/guidelines/
- Most common: missing privacy policy, misleading metadata
- Resubmit with corrections

---

## 📊 MONITORING & ANALYTICS

### After Launch:
1. **App Store Connect**: Reviews, ratings, downloads, crashes
2. **Google Play Console**: Similar metrics
3. **Firebase Console**: User analytics, errors, performance
4. **TestFlight** (iOS): Beta testing before full release

### Key Metrics:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Crash-free users percentage
- Session length
- Feature usage

---

## 🎯 NEXT STEPS AFTER LAUNCH

1. **Week 1**: Monitor crashes, respond to reviews
2. **Week 2-3**: Gather user feedback, plan v1.0.1
3. **Month 2**: Add new features (chat improvements, more rides)
4. **Month 3**: Plan premium features, partnerships

---

## 📞 GETTING HELP

- **Expo Community**: https://forums.expo.dev
- **Stack Overflow**: Tag `react-native` + `expo`
- **App Store Review**: Apple Support (in App Store Connect)
- **Google Play Support**: https://support.google.com/googleplay

---

**You're now ready to build and publish TravelTrust!**

Good luck! 🚀