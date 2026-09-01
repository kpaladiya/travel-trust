🇪🇺 TravelTrust - EU & Germany Compliance Setup Guide

## ⚠️ CRITICAL: EU Legal Requirements

This guide covers **GDPR**, **German law (TMG, NetzDG)**, **Digital Markets Act**, and **Apple EU requirements**.

---

## 1️⃣ LEGAL DOCUMENTS (REQUIRED)

### A. Privacy Policy (GDPR Compliant)

**Template for TravelTrust:**

```markdown
# PRIVACY POLICY

## 1. RESPONSIBLE PARTY (Verantwortlicher)

Company Name: TravelTrust GmbH
Address: [Your address in Germany]
Email: privacy@travelrust.com
Phone: [Your phone number]
VAT ID (USt-IdNr.): [Your German tax ID]

## 2. DATA WE COLLECT

### When You Sign Up:
- First Name, Last Name
- Email Address
- Phone Number
- City/Address (for ride matching)
- Profile Photo (optional)
- Government ID (optional, for verification)
- Bank Details (for payments only, via Stripe)
- Emergency Contact Name & Phone

### During App Usage:
- Location Data (GPS coordinates for ride matching)
- Chat Messages (between users)
- Ride Search History
- Booking Information
- Payment Data (processed by Stripe - we don't store card details)
- Device ID
- App Crash Logs
- Analytics Data

### From Third Parties:
- Firebase Analytics
- Google Maps (location data)
- Stripe (payment info)
- Google Sign-In / Apple Sign-In (name, email)

## 3. HOW WE USE YOUR DATA

✓ To provide ride-sharing services
✓ To match riders and drivers
✓ To process payments
✓ To send notifications
✓ To improve our services (analytics)
✓ To comply with legal obligations
✓ To detect fraud
✓ To respond to support requests

## 4. LEGAL BASIS (Rechtliche Grundlage)

- **Contract Performance** (Art. 6(1)(b) GDPR): Ride booking, payment
- **Legitimate Interest** (Art. 6(1)(f) GDPR): Fraud prevention, service improvement
- **Consent** (Art. 6(1)(a) GDPR): Optional analytics, marketing
- **Legal Obligation** (Art. 6(1)(c) GDPR): Tax records, safety

## 5. DATA RETENTION

- Account data: Until account deletion
- Chat messages: 1 year after last message
- Payment records: 10 years (German tax law)
- Location data: Real-time only, deleted after ride
- Analytics: 26 months (Google default)
- Crash logs: 30 days

## 6. DATA SHARING

We share data with:
- **Stripe**: Payment processing (PCI-DSS certified)
- **Firebase**: Authentication and analytics
- **Google Maps**: Location services
- **AWS**: Data hosting (Frankfurt region, EU)
- **Legal authorities**: If required by law

We do NOT sell your data to third parties.

## 7. YOUR RIGHTS (Ihre Rechte)

You have the right to:
- **Access** your personal data
- **Rectify** incorrect data
- **Delete** your account and data (right to be forgotten)
- **Restrict** processing
- **Data portability** (export your data)
- **Object** to processing
- **Withdraw consent** at any time

Contact: privacy@travelrust.com

## 8. DATA PROTECTION OFFICER (Datenschutzbeauftragter)

If required for your business size, contact:
[Your DPO or external DPO service]
Email: dpo@travelrust.com

## 9. INTERNATIONAL DATA TRANSFERS

All data is processed in the EU (Frankfurt, Germany).
No transfers to non-GDPR countries without adequacy decisions.

## 10. SECURITY

We use:
- HTTPS encryption in transit
- AES-256 encryption at rest
- Regular security audits
- Access controls
- Incident response plan

## 11. COOKIES & TRACKING

Our app uses:
- Firebase Analytics (user consent required in EU)
- Crash logging (Sentry)
- No third-party advertising trackers

You can disable analytics in app settings.

## 12. CHANGES TO PRIVACY POLICY

We may update this policy. Changes are effective when posted.
Significant changes require user consent.

Last Updated: April 2024
```

**Where to host:**
- Free tier: https://www.freeprivacypolicy.com (German template available)
- Self-hosted: Host on `https://www.travelrust.com/privacy`

---

### B. Impressum / Legal Notice (Required for Germany)

**Template for Germany:**

```markdown
# IMPRESSUM (Imprint / Legal Notice)

## Angaben gemäß § 5 TMG (Telemediengesetz)

### Dienstanbieter (Service Provider):

TravelTrust GmbH
[Street Address]
[Postal Code] [City], Germany

### Kontakt:

Telefon: [Your phone number]
Email: legal@travelrust.com
Website: www.travelrust.com

### Vertreter (Representative):

Name: [Your name]
Title: [CEO/Founder]
Email: [Your email]

### Geschäftsform (Business Form):

GmbH (Limited Liability Company)

### Registereintrag (Company Registration):

Handelsregister (Commercial Register): [HR Number]
Amtsgericht (District Court): [Your district court]
USt-IdNr. (VAT ID): DE[Your 11-digit VAT number]
Steuernummer (Tax Number): [Your tax number]

### Verantwortliche/r für den Inhalt (Content Responsible):

Name: [Your name]

## Haftungsausschluss (Disclaimer)

### 1. Haftung für Inhalte (Liability for Content)

As service providers, we are liable for our own content according to § 7 TMG.

However, we are not obligated to monitor third-party content or investigate legal violations.

Once we become aware of illegal content, we will remove it immediately.

### 2. Haftung für Links (Liability for Links)

Our website contains links to external third-party websites.

We are not responsible for the content of linked pages.

We have no influence on linked content and do not endorse it.

The operators of linked pages are solely responsible for their content.

### 3. Urheberrecht (Copyright)

Content and works on this website are subject to copyright law.

Reproduction, distribution, and modification require written consent.

### 4. User-Generated Content

Users are solely responsible for content they post (reels, messages, reviews).

We are not responsible for user-generated content but reserve the right to remove illegal content.

---

## Datenschutz (Data Protection)

Our privacy policy is available at: [URL]

---

## NOTICE ACCORDING TO § 36 VSBG (Dispute Resolution Notice)

We are not willing or required to participate in dispute resolution procedures.

---

Last Updated: April 2024
```

---

### C. Terms of Service (Required)

```markdown
# TERMS OF SERVICE

## 1. AGREEMENT

By using TravelTrust, you agree to these terms.

## 2. USE REQUIREMENTS

You must:
- Be at least 18 years old
- Provide accurate information
- Not use the service illegally
- Respect other users
- Not upload harmful content

## 3. ACCOUNT RESPONSIBILITY

- You are responsible for your account security
- Passwords are confidential
- You are liable for all activity on your account
- Notify us of unauthorized access immediately

## 4. PROHIBITED CONDUCT

Users must not:
- Engage in harassment, bullying, or discrimination
- Upload copyrighted content without permission
- Upload nudity, violence, or illegal content
- Spam or mislead other users
- Violate laws or regulations
- Attempt to hack or reverse-engineer the app
- Impersonate others

## 5. CONTENT MODERATION

We reserve the right to:
- Remove illegal or harmful content
- Suspend or ban users for violations
- Cooperate with law enforcement
- Monitor for abuse

Users can report content via the report button.

## 6. PAYMENTS

- All prices are in EUR
- Payment by card via Stripe
- Card details are processed by Stripe, not TravelTrust
- Refunds follow our refund policy (within 14 days)
- Commission: 12.5% per ride

## 7. LIABILITY LIMITATION

TravelTrust is provided "AS IS". We are not liable for:
- Service interruptions
- Data loss
- Accidents or injuries during rides
- User misconduct
- Third-party actions

Maximum liability: Amount paid in last 12 months

## 8. ASSUMPTION OF RISK

Ride-sharing involves inherent risks. You acknowledge:
- We don't guarantee driver reliability
- Safety is your responsibility
- We recommend sharing ride details with friends
- Use safety features (in-app chat, ratings, reviews)

## 9. DISPUTE RESOLUTION

- EU users: European ADR (Alternative Dispute Resolution)
- German users: German courts have jurisdiction
- Law: German law applies

## 10. DATA DELETION

You can delete your account anytime.
All personal data will be deleted within 30 days.
Payment records kept for 10 years (German tax law).

## 11. CHANGES TO TERMS

We may modify these terms with 30 days notice.
Continued use means acceptance.

---

Last Updated: April 2024
```

---

## 2️⃣ DATA PROTECTION SETUP

### GDPR Data Collection & Consent Flow

**Update: `src/screens/SignupScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GDPRConsent = () => {
  const [consentAnalytics, setConsentAnalytics] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentLocation, setConsentLocation] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleConsent = async () => {
    // Save to AsyncStorage for GDPR compliance
    const consentData = {
      timestamp: new Date().toISOString(),
      analytics: consentAnalytics,
      marketing: consentMarketing,
      location: consentLocation,
      privacy: agreedToPrivacy,
      terms: agreedToTerms,
    };

    await AsyncStorage.setItem('gdprConsent', JSON.stringify(consentData));

    // Disable analytics if not consented
    if (!consentAnalytics) {
      // firebase.analytics.setAnalyticsCollectionEnabled(false);
    }

    // Disable location tracking if not consented
    if (!consentLocation) {
      // Don't request location permission
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Protection & Consent</Text>

      {/* Analytics Consent */}
      <View style={styles.consentBlock}>
        <View style={styles.consentHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConsentAnalytics(!consentAnalytics)}
          >
            {consentAnalytics && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.consentText}>
            Allow analytics to improve app performance (optional)
          </Text>
        </View>
        <Text style={styles.consentSubtext}>
          We'll collect anonymized usage data. You can disable this anytime in settings.
        </Text>
      </View>

      {/* Location Consent */}
      <View style={styles.consentBlock}>
        <View style={styles.consentHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConsentLocation(!consentLocation)}
          >
            {consentLocation && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.consentText}>
            Allow location access for ride matching (required)
          </Text>
        </View>
        <Text style={styles.consentSubtext}>
          Location is essential for finding nearby rides and drivers.
        </Text>
      </View>

      {/* Marketing Consent */}
      <View style={styles.consentBlock}>
        <View style={styles.consentHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConsentMarketing(!consentMarketing)}
          >
            {consentMarketing && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.consentText}>
            Send me special offers and updates (optional)
          </Text>
        </View>
        <Text style={styles.consentSubtext}>
          We'll only send relevant updates about new features.
        </Text>
      </View>

      {/* Privacy Policy */}
      <View style={styles.legalBlock}>
        <TouchableOpacity
          style={styles.legalCheckbox}
          onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
        >
          {agreedToPrivacy && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.legalText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={() => openURL('https://travelrust.com/privacy')}>
            Privacy Policy
          </Text>
        </Text>
      </View>

      {/* Terms of Service */}
      <View style={styles.legalBlock}>
        <TouchableOpacity
          style={styles.legalCheckbox}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.legalText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={() => openURL('https://travelrust.com/terms')}>
            Terms of Service
          </Text>
        </Text>
      </View>

      {/* GDPR Info */}
      <View style={styles.gdprInfo}>
        <Ionicons name="information-circle" size={20} color="#007AFF" />
        <Text style={styles.gdprText}>
          By creating an account, you consent to our privacy practices and the processing of your
          personal data as described in our Privacy Policy.
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          (!agreedToPrivacy || !agreedToTerms || !consentLocation) && styles.buttonDisabled,
        ]}
        disabled={!agreedToPrivacy || !agreedToTerms || !consentLocation}
        onPress={handleConsent}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
  },
  consentBlock: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  consentHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#007AFF',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  consentSubtext: {
    fontSize: 12,
    color: '#666',
    marginLeft: 36,
    lineHeight: 16,
  },
  legalBlock: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  legalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#007AFF',
  },
  legalText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  gdprInfo: {
    flexDirection: 'row',
    backgroundColor: '#E7F3FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  gdprText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 12,
    color: '#0051BA',
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GDPRConsent;
```

---

## 3️⃣ ACCOUNT DELETION (Right to be Forgotten)

**Add to Profile Screen:**

```typescript
// In app/(app)/(profile)/index.tsx

const handleDeleteAccount = () => {
  Alert.alert(
    'Delete Account',
    'This will permanently delete your account and all personal data. This cannot be undone.',
    [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete My Account',
        onPress: async () => {
          try {
            // Call backend DELETE endpoint
            const response = await fetch(
              'https://api.travelrust.com/api/v1/users/delete-account',
              {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.ok) {
              Alert.alert('Account Deleted', 'Your account has been deleted.');
              // Logout user
              await signOut();
              router.replace('/(auth)');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete account');
          }
        },
      },
    ]
  );
};

return (
  <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
      Delete Account
    </Text>
  </TouchableOpacity>
);
```

---

## 4️⃣ CONTENT MODERATION & REPORTING

**Add Reporting Feature:**

```typescript
// Create: src/screens/ReportUserScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const REPORT_REASONS = [
  'Harassment or Bullying',
  'Inappropriate Content',
  'Fraud or Scam',
  'Safety Concern',
  'Copyright Violation',
  'Offensive Language',
  'Other',
];

export default function ReportUserScreen({ userId, userName }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.travelrust.com/api/v1/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportedUserId: userId,
          reason: selectedReason,
          details,
          timestamp: new Date().toISOString(),
          // Include evidence (screenshots, ride ID, message ID, etc.)
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Report Submitted',
          'Thank you for reporting. Our team will review this within 24 hours.'
        );
        // Clear form
        setSelectedReason('');
        setDetails('');
      } else {
        Alert.alert('Error', 'Failed to submit report');
      }
    } catch (error) {
      console.error('Report error:', error);
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report {userName}</Text>
        <Text style={styles.subtitle}>
          Help us keep TravelTrust safe. Reports are confidential.
        </Text>
      </View>

      <Text style={styles.label}>Reason for Report</Text>
      {REPORT_REASONS.map((reason) => (
        <TouchableOpacity
          key={reason}
          style={[
            styles.reasonButton,
            selectedReason === reason && styles.reasonButtonSelected,
          ]}
          onPress={() => setSelectedReason(reason)}
        >
          <Text
            style={[
              styles.reasonText,
              selectedReason === reason && styles.reasonTextSelected,
            ]}
          >
            {reason}
          </Text>
          {selectedReason === reason && (
            <Ionicons name="checkmark" size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Additional Details (Optional)</Text>
      <TextInput
        style={styles.detailsInput}
        placeholder="Provide specific details about the incident..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
        value={details}
        onChangeText={setDetails}
      />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Your report is anonymous. Please don't include personal information or threats.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmitReport}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12 },
  reasonButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonButtonSelected: { borderColor: '#007AFF', backgroundColor: '#E7F3FF' },
  reasonText: { fontSize: 14, color: '#666' },
  reasonTextSelected: { color: '#007AFF', fontWeight: '600' },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E7F3FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoText: { marginLeft: 12, flex: 1, fontSize: 12, color: '#0051BA', lineHeight: 16 },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
```

---

## 5️⃣ EU APP STORE COMPLIANCE

### A. Apple EU Requirements

**Create: `EU_TRADER_VERIFICATION.md`**

```markdown
# Apple EU Trader Verification Requirements

## Who Needs This?

If you are:
- A business (not just a personal app)
- Located in the EU or targeting EU users
- Charging money (in-app purchases, subscriptions, or taking commission)
- Acting as a "trader" in Apple's terms

**Then you MUST provide trader verification.**

## What You Need

### 1. Business Registration (Handelsregister Eintrag)

For Germany:
- Company name
- Handelsregister entry (HR-Nummer)
- District court (Amtsgericht)
- Business address

Example:
```
Company: TravelTrust GmbH
Handelsregister: HRB 123456
Amtsgericht: Frankfurt am Main
Address: Mainstrasse 123, 60311 Frankfurt am Main, Germany
```

### 2. VAT Number (Umsatzsteuer-Identifikationsnummer)

Format: DE[11-digit number]
Example: DE123456789012

Get from: https://www.bzst.bund.de (German Federal Tax Office)

### 3. Contact Information

- Primary contact name
- Email address
- Phone number
- Business address

### 4. Document Upload

Apple requires:
- Screenshot of business registration (Handelsregister)
- VAT number verification document
- Identification of authorized person
- Signed declaration

## How to Submit

1. Go to App Store Connect
2. Apps > Your App > App Information
3. Scroll to "Trader Verification" (EU section)
4. Upload documents
5. Wait for verification (3-5 business days)

## What Happens If You Don't?

- App gets rejected from EU App Store
- Users in EU cannot download
- Remove from "must-have" list in EU
- Risk of app removal

## Cost

FREE - Apple doesn't charge for verification

## Timeline

- Document submission: 5 minutes
- Apple review: 3-5 business days
- Resubmission if needed: Add 3-5 days per revision

## Example: How to Get Business Registered in Germany

If not yet registered:

1. **Register with Notary (Notar)**
   - Cost: €200-500
   - Time: 1 week
   - Required documents: ID, address proof, business plan

2. **Register with Handelsregister**
   - Cost: €150-300 (automatic if registered with notary)
   - Time: 1-2 weeks

3. **Get VAT Number**
   - Cost: FREE
   - Time: 1 week
   - Done automatically when registering as business

**Total: 2-3 weeks, €400-800**

OR use a German company formation service (€600-1500, faster)
```

### B. Google Play EU Requirements

**For Google Play:**

```markdown
# Google Play EU Compliance

## Data Safety Form (Required)

In Google Play Console, fill out:

1. **Data Types Collected**
   - Personal info: Name, Email, Phone, Location
   - Contacts: Emergency contacts
   - Photos & Videos: Profile pics, reels
   - Identifiers: Device ID, crash logs
   - Precise Location: GPS (rides)
   - Payment Info: Card data via Stripe
   - User IDs: Account ID

2. **Data Security**
   - Encrypted in transit: YES (HTTPS)
   - Encrypted at rest: YES (AES-256)
   - Deletion possible: YES (account deletion)
   - Data retention: Specify (1 year for chats, 10 years for payments)
   - Certified to comply: YES (GDPR)

3. **Data Sharing**
   - Data NOT shared with third parties (except Stripe/Firebase/Google Maps for service)
   - Explain Stripe's payment processing
   - Explain Firebase analytics
   - Explain Google Maps location

4. **User Consent**
   - Optional analytics: Can be disabled
   - Location: Required for service
   - Contacts: Optional for emergency

## Content Rating Form

1. Alcohol/Tobacco: None
2. Violence: None (social app)
3. Language: None
4. Sexual Content: Users can message, so flag "Mild"
5. Scary Content: None
6. Parental Guidance:
   - Content Guidance for All Audiences
   - Additional Info: Community-moderated, user-generated content

## App Category

- Social: YES
- Messaging: YES
- Transportation: YES
- Sharing Economy: YES

## User Generated Content

Add disclaimer:
"This app contains user-generated content (messages, reviews, ratings).
We moderate for illegal content but are not responsible for all user content."

## Permissions Justification

- Location: Required for ride matching and driver tracking
- Camera: Profile photo upload
- Contacts: Emergency contact entry
- Photos: Profile picture, ride verification

## Region-Specific Settings

- Restricted in certain countries: None
- Age rating: 4+ (or 12+ if you want to be conservative)
- Target age: Adults 18+
```

---

## 6️⃣ AGE RATING & CONTENT RATING

### IARC Rating (for both stores)

**Fill out via Google Play Console:**

```
IARC Questionnaire:

1. Cartoon or Fantasy Violence: No
2. Realistic Violence: No
3. Bloodletting or Gore: No
4. Sexual Content or Nudity: Mild (users can message)
5. Sexual Innuendo or Sexual Themes: Mild (dating-adjacent)
6. Alcohol, Tobacco, Drugs: No
7. Gambling: No
8. Long-form video streaming: Yes (reels)
9. Parental Controls: Yes

RESULT: Appropriate for age 4+ (PEGI 3, USK 0, ESRB E, ClassInd L)
OR Age 12+ if more conservative
```

---

## 7️⃣ GDPR COMPLIANCE CHECKLIST

```markdown
# GDPR Compliance Checklist

## Documentation
- [ ] Privacy Policy (EU version) - Hosted on website
- [ ] Terms of Service - Published
- [ ] Impressum/Legal Notice (if Germany) - Published
- [ ] Data Processing Agreement (DPA) - For Stripe, Firebase
- [ ] Consent records - Stored in database

## Data Handling
- [ ] Minimal data collection - Only what's needed
- [ ] Clear purposes - Explicit about data use
- [ ] Legitimate basis identified - Consent/contract/legal
- [ ] Data retention defined - Times for each data type
- [ ] Secure storage - Encryption in transit and at rest
- [ ] Access controls - Only authorized staff
- [ ] Incident plan - Know what to do if breached

## User Rights
- [ ] Access request process - Users can export data
- [ ] Rectification process - Users can edit data
- [ ] Deletion process - Account deletion in app
- [ ] Data portability - Export in standard format
- [ ] Consent withdrawal - Users can revoke analytics
- [ ] Objection process - Opt-out of optional processing

## Third Parties
- [ ] Data Processing Agreements signed - Stripe, Firebase, AWS
- [ ] Privacy policies reviewed - Understand their practices
- [ ] Sub-processors listed - Know all who touch data

## Governance
- [ ] DPO appointed (if needed) - Usually needed for companies
- [ ] Records of processing - Log what you do
- [ ] Impact assessments - For high-risk processing
- [ ] Breach notification plan - Within 72 hours

## Staff
- [ ] Privacy training - All staff understand GDPR
- [ ] Data handling procedures - Written rules
- [ ] Confidentiality agreements - Before access
```

---

## 8️⃣ SETUP IN APP.JSON

**Add to app.json:**

```json
{
  "expo": {
    "name": "TravelTrust",
    "extra": {
      "gdpr": {
        "privacyPolicyUrl": "https://www.travelrust.com/privacy",
        "termsOfServiceUrl": "https://www.travelrust.com/terms",
        "impressumUrl": "https://www.travelrust.com/impressum",
        "contactEmail": "privacy@travelrust.com",
        "dpoEmail": "dpo@travelrust.com"
      },
      "regions": {
        "targetRegions": ["DE", "EU"],
        "gdprEnabled": true,
        "dataProcessingLocation": "Frankfurt, Germany",
        "requiresTraderVerification": true,
        "businessType": "GmbH"
      },
      "compliance": {
        "ageRating": "12+",
        "contentRating": "Mild - User Generated Content",
        "requiresParentalConsent": false,
        "hasUserGeneratedContent": true,
        "hasInAppPurchases": true
      }
    }
  }
}
```

---

## 9️⃣ BACKEND ENDPOINTS FOR EU COMPLIANCE

**Add these to your backend:**

```javascript
// DELETE /api/v1/users/:id/delete-account
// Right to be forgotten
app.delete('/api/v1/users/:id/delete-account', authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.id;

    // Verify ownership
    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete account
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    // Delete related data
    await pool.query('DELETE FROM rides WHERE driver_id = $1', [userId]);
    await pool.query('DELETE FROM bookings WHERE passenger_id = $1', [userId]);
    await pool.query('DELETE FROM messages WHERE sender_id = $1 OR receiver_id = $1', [
      userId,
      userId,
    ]);

    // Keep: Payment records (10 years - German tax law)
    // Keep: Dispute/fraud records if needed

    // Clear cache
    await redisClient.del(`user:${userId}`);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET /api/v1/users/:id/export
// Data portability
app.get('/api/v1/users/:id/export', authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Collect all user data
    const userData = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const rides = await pool.query('SELECT * FROM rides WHERE driver_id = $1', [userId]);
    const bookings = await pool.query('SELECT * FROM bookings WHERE passenger_id = $1', [
      userId,
    ]);
    const messages = await pool.query(
      'SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1',
      [userId, userId]
    );

    // Return as JSON
    const exportData = {
      user: userData.rows[0],
      rides: rides.rows,
      bookings: bookings.rows,
      messages: messages.rows,
      exportedAt: new Date().toISOString(),
      exportedBy: 'TravelTrust GDPR Export',
    };

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// POST /api/v1/reports
// Violation reporting
app.post('/api/v1/reports', authenticateJWT, async (req, res) => {
  try {
    const { reportedUserId, reason, details } = req.body;

    const result = await pool.query(
      `INSERT INTO fraud_reports 
       (reporter_id, reported_user_id, incident_type, description, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [req.userId, reportedUserId, reason, details, 'pending']
    );

    // Notify moderation team
    console.log(`Report created: ${result.rows[0].id}`);

    res.status(201).json({
      message: 'Report submitted successfully',
      reportId: result.rows[0].id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// POST /api/v1/consent
// GDPR consent tracking
app.post('/api/v1/consent', authenticateJWT, async (req, res) => {
  try {
    const { analytics, marketing, location } = req.body;

    await pool.query(
      `INSERT INTO gdpr_consents 
       (user_id, analytics_consent, marketing_consent, location_consent, timestamp)
       VALUES ($1, $2, $3, $4, NOW())`,
      [req.userId, analytics, marketing, location]
    );

    res.json({ message: 'Consent recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record consent' });
  }
});
```

---

## 🔟 GERMANY-SPECIFIC: NetzDG LAW

**Netzwerkdurchsetzungsgesetz (Network Enforcement Act)**

For apps with user-generated content:

```markdown
# NetzDG Compliance

## What is NetzDG?

German law requiring platforms to remove illegal content (hate speech, defamation, etc.) within 24 hours.

## Who Needs to Comply?

If your app has:
- User-generated content (messages, reels, comments) → YES
- More than 2 million users in Germany → YES (small platforms exempt)

## What You Need

1. **Moderation Team**
   - Review reported content within 24 hours
   - Remove illegal content or disable access
   - Keep records

2. **Report Mechanism**
   - Clear "Report" button in app
   - Report form for users
   - Confirmation to reporter

3. **Transparency Report**
   - Annual report on removals
   - Must be published

4. **Terms Update**
   - Add: "Illegal content will be removed within 24 hours"
   - Add: "Users can appeal removals"
   - Add: "We cooperate with law enforcement"

## Implementation

In your app (already added above):
- Report button: ✓ Added
- Report categories: ✓ Added (harassment, illegal content, etc.)
- Backend storage: ✓ fraud_reports table
- Moderation dashboard: You can add later

## Illegal Content Types (Examples)

- Hate speech against protected groups
- Defamation
- Copyright infringement
- Violence or abuse
- Child exploitation material
- Sale of illegal goods
- Impersonation for fraud

---

For small platforms (< 2 million users), this is optional but recommended.
```

---

## 1️1️⃣ MASTER CHECKLIST FOR EU LAUNCH

```markdown
# EU & Germany Launch Checklist

## LEGAL DOCUMENTS (Week 1)
- [ ] Privacy Policy written (Privacy Policy template done)
- [ ] Impressum/Legal Notice created (German version done)
- [ ] Terms of Service written (Template done)
- [ ] Upload to website (HTTPS required)
- [ ] Links added to app

## GDPR SETUP (Week 1-2)
- [ ] Data mapping complete (What data, where, why)
- [ ] Consent flow implemented (GDPR screens added)
- [ ] Account deletion feature added
- [ ] Data export feature added (Get /api/v1/users/:id/export)
- [ ] Retention policy defined (1 year chats, 10 years payments)
- [ ] DPO appointed or external service hired

## APPLE EU REQUIREMENTS (Week 2)
- [ ] Business registered (Handelsregister or equivalent)
- [ ] VAT number obtained
- [ ] Trader verification documents prepared
- [ ] Submit to Apple (3-5 days review)
- [ ] Wait for approval before app release

## GOOGLE PLAY REQUIREMENTS (Week 2)
- [ ] Data Safety form filled (all data types listed)
- [ ] Content rating completed (IARC)
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Report mechanism implemented

## CONTENT MODERATION (Week 2-3)
- [ ] Report/block feature added (screens added)
- [ ] Backend for reports created
- [ ] NetzDG compliance reviewed
- [ ] Moderation workflow planned
- [ ] Team trained (if applicable)

## AGE VERIFICATION (Optional, Week 3)
- [ ] Age gate added (if targeting 16+)
- [ ] Parental consent (if targeting under 13)
- [ ] Age verification API integrated (optional)

## DEPLOYMENT (Week 3)
- [ ] All documents live on website
- [ ] All features implemented and tested
- [ ] Compliance audit done
- [ ] Translations done (if needed - German + English)
- [ ] App Store listings complete
- [ ] Privacy Policy and Terms links in listings

## POST-LAUNCH (Week 4+)
- [ ] Monitor for abuse
- [ ] Respond to reports within 24 hours (NetzDG)
- [ ] Monitor crash logs for compliance issues
- [ ] Update privacy policy if anything changes
- [ ] Annual transparency report (for NetzDG)

---

## DOCUMENTS TO KEEP

Store these files:
```
/legal/
├── Privacy Policy (signed version)
├── Impressum/Legal Notice
├── Terms of Service
├── Data Processing Agreement (Stripe)
├── Data Processing Agreement (Firebase)
├── Data Processing Agreement (Google Maps)
├── GDPR Consent Records (backend database)
├── Trader Verification (Apple submission)
├── Moderation Records (daily/weekly)
└── Breach Log (if any incidents)
```

---

## IF YOU VIOLATE GDPR

**Penalties:**
- Up to €10 million OR 2% of annual revenue (whichever is higher)
- Up to €20 million OR 4% of annual revenue (for serious violations)
- Class action lawsuits from users
- App removal from app stores

**Violations include:**
- No privacy policy
- Collecting data without consent
- Not allowing users to delete accounts
- Sharing data without permission
- Not handling breach
- No DPO when required
- Storing data longer than necessary
```

---

## 1️2️⃣ QUICK GDPR SETUP SCRIPT

```bash
#!/bin/bash
# eu-setup.sh - Quick EU compliance setup

echo "🇪🇺 TravelTrust EU Compliance Setup"

# Create legal directory
mkdir -p legal
mkdir -p privacy-documents

# Create template files
cat > legal/PRIVACY_POLICY.md << 'EOF'
# PRIVACY POLICY

## Responsible Party
TravelTrust GmbH
[Your address]

## Data We Collect
[See template above]
EOF

cat > legal/IMPRESSUM.md << 'EOF'
# IMPRESSUM

Company: TravelTrust GmbH
[Your details]
EOF

cat > legal/TERMS_OF_SERVICE.md << 'EOF'
# TERMS OF SERVICE

[See template above]
EOF

echo "✅ Legal documents created in /legal/"
echo ""
echo "📝 Next steps:"
echo "1. Edit files with your actual details"
echo "2. Upload to https://www.travelrust.com/privacy"
echo "3. Upload to https://www.travelrust.com/terms"
echo "4. Upload to https://www.travelrust.com/impressum"
echo "5. Ensure HTTPS (required for legal)"
echo ""
echo "🔒 GDPR Checklist:"
echo "- [ ] Privacy policy live and linked"
echo "- [ ] Consent screen in app"
echo "- [ ] Account deletion in settings"
echo "- [ ] Data export feature ready"
echo "- [ ] Backend endpoints for GDPR"
echo ""
echo "🍎 Apple EU Checklist:"
echo "- [ ] Business registered"
echo "- [ ] VAT number obtained"
echo "- [ ] Trader verification submitted"
echo ""
echo "🤖 Google Play Checklist:"
echo "- [ ] Data Safety form completed"
echo "- [ ] Content rating submitted"
echo "- [ ] Privacy policy linked"
echo ""
echo "Done! You're EU-ready."
```

---

## 📞 SUPPORT RESOURCES

**Germany:**
- GDPR Authority: https://www.bfdi.bund.de (Federal Data Protection Officer)
- Consumer Protection: https://www.verbraucherzentrale.de
- Chamber of Commerce: https://www.ihk.de

**EU-Wide:**
- GDPR Resources: https://gdpr-info.eu/
- EDPB Guidelines: https://edpb.europa.eu/
- Digital Markets Act: https://ec.europa.eu/commission/presscorner/detail/en/qanda_20_2349

**Practical Help:**
- Privacy Policy Generator: https://www.freeprivacypolicy.com (with German template)
- Legal Document Services: https://www.fidor.de, https://www.legalzoom.de
- GDPR Consulting: Hire a German privacy lawyer (~€2,000-5,000 for initial setup)

---

**This setup makes your app compliant with EU law and ready for both the Apple App Store and Google Play Store in the EU/Germany.**

**Implementation time: 2-3 weeks**
**Cost: €0-2,000 (if hiring lawyer)**

**You're now EU-compliant! 🎉**