# Privacy Policy for LearnFlow

**Last Updated: November 4, 2024**

## Introduction

LearnFlow ("we," "our," or "the extension") is a Chrome browser extension designed to help users learn technical concepts directly on any webpage. We are committed to protecting your privacy and being transparent about how we handle your data.

This Privacy Policy explains what information LearnFlow collects, how it's used, and your rights regarding your data.

---

## Information We Collect

### Data Stored Locally

LearnFlow stores the following information **locally on your device** using Chrome's encrypted storage API:

1. **API Keys**
   - OpenAI API key (if you choose OpenAI as your provider)
   - Groq API key (if you choose Groq as your provider)
   - Selected AI provider preference (OpenAI or Groq)
   - **Storage Location**: `chrome.storage.sync` (encrypted by Chrome, synced across your Chrome browsers)

2. **Learning History**
   - Most recent explanation (term, definition, examples, quiz)
   - Timestamp of last explanation
   - List of saved topic names (from exported images)
   - **Storage Location**: `chrome.storage.local` (local to your device only)

### Data Transmitted to Third Parties

When you request an explanation or ask a follow-up question, LearnFlow sends the following to your selected AI provider:

**To OpenAI (if selected):**
- The text you highlighted on a webpage
- Your follow-up questions (if any)
- **API Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Transmitted via**: HTTPS secure connection
- **Controlled by**: Your API key (you maintain the account relationship)

**To Groq (if selected):**
- The text you highlighted on a webpage
- Your follow-up questions (if any)
- **API Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Transmitted via**: HTTPS secure connection
- **Controlled by**: Your API key (you maintain the account relationship)

---

## What We Do NOT Collect

- ❌ We do not collect or store your personal information
- ❌ We do not track your browsing history
- ❌ We do not use analytics or telemetry
- ❌ We do not share your data with advertisers
- ❌ We do not sell your data to anyone
- ❌ We do not have a central server that stores your data
- ❌ We do not require account creation with us

---

## How We Use Your Information

### API Keys
- **Purpose**: To authenticate your requests to OpenAI or Groq APIs
- **Storage**: Encrypted by Chrome in `chrome.storage.sync`
- **Access**: Only LearnFlow extension can access these keys
- **Transmission**: Sent only to the selected AI provider (OpenAI or Groq) via secure HTTPS

### Selected Text
- **Purpose**: To generate AI-powered explanations of technical concepts
- **Storage**: Not permanently stored
- **Transmission**: Sent to your selected AI provider (OpenAI or Groq) to generate explanations
- **Processing**: Processed by AI provider and response returned to your browser

### Learning History
- **Purpose**: To show recent explanations and track saved topics
- **Storage**: Stored locally on your device in `chrome.storage.local`
- **Retention**: Stored until you clear extension data or delete topics manually

---

## Third-Party Services

LearnFlow integrates with the following third-party AI services based on your selection:

### OpenAI
- **Service**: OpenAI API (GPT-3.5 Turbo)
- **Data Sent**: Selected text, follow-up questions
- **Privacy Policy**: [https://openai.com/policies/privacy-policy](https://openai.com/policies/privacy-policy)
- **Your Relationship**: You maintain a direct account relationship with OpenAI
- **Note**: OpenAI is a paid service (~$0.001-0.003 per explanation)

### Groq
- **Service**: Groq API (Llama 3.3)
- **Data Sent**: Selected text, follow-up questions
- **Privacy Policy**: [https://groq.com/privacy-policy/](https://groq.com/privacy-policy/)
- **Your Relationship**: You maintain a direct account relationship with Groq
- **Note**: Groq is a free service with rate limits

**Important**: By using LearnFlow, you agree to the privacy policies and terms of service of your chosen AI provider (OpenAI or Groq). We recommend reviewing their policies before using the extension.

---

## Data Security

### Local Storage Security
- API keys are stored using Chrome's encrypted storage (`chrome.storage.sync`)
- Chrome encrypts this data at the OS level
- Only LearnFlow extension can access this storage

### Network Security
- All API communications use HTTPS encryption
- API keys are transmitted securely in HTTP Authorization headers
- No data is sent to servers controlled by LearnFlow (we have no servers)

### Extension Permissions
LearnFlow requests the following Chrome permissions:
- **storage**: To save API keys and learning history locally
- **activeTab**: To detect text selection on the current webpage
- **scripting**: To inject the explanation overlay into webpages
- **host_permissions (https://*/*)**: To work on any HTTPS webpage you're reading

These permissions are the minimum required for LearnFlow to function. We do not use these permissions for any purpose other than the core functionality described in this policy.

---

## Your Rights and Control

### You Have Full Control Over Your Data

1. **Delete API Keys**
   - Go to LearnFlow Options → Click "Clear" button
   - API keys are immediately deleted from storage

2. **Delete Saved Topics**
   - Open LearnFlow popup → Click "✕" next to any saved topic
   - Topics are immediately removed from storage

3. **Delete All Extension Data**
   - Right-click extension icon → "Remove from Chrome"
   - All locally stored data is permanently deleted

4. **Change AI Provider**
   - Go to LearnFlow Options → Select different provider (OpenAI or Groq)
   - Previous provider's API key remains stored unless you clear it

5. **Review Data Sent to AI Providers**
   - Only the text you explicitly select is sent
   - You control when explanations are generated (by clicking the indicator)
   - You can review AI provider API logs in your OpenAI/Groq dashboard

### Data Portability
- Saved topics are stored as plain text in `chrome.storage.local`
- You can manually copy your saved topics from the popup
- Exported images (PNG format) are saved to your Downloads folder

---

## Data Retention

### Local Data
- **API Keys**: Stored until you remove them or uninstall the extension
- **Last Explanation**: Stored for convenience, expires after 5 minutes in popup view
- **Saved Topics**: Stored until you manually delete them or uninstall the extension

### Third-Party Data
- **OpenAI/Groq**: Refer to their privacy policies for data retention practices
- **Your Control**: You can delete your data through OpenAI/Groq account settings

---

## Children's Privacy

LearnFlow is not directed at children under 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has used LearnFlow, please contact us at the email below.

---

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last Updated" date at the top of this policy.

**How You'll Be Notified:**
- Updated policy will be posted in the GitHub repository
- Major changes will be noted in extension update notes
- Continued use of LearnFlow after changes constitutes acceptance

We encourage you to review this policy periodically.

---

## Open Source Transparency

LearnFlow is open source. You can review the complete source code to verify our privacy practices:

**GitHub Repository**: [https://github.com/keeeeeliu/LearnFlow](https://github.com/keeeeeliu/LearnFlow)

All data handling is transparent and auditable in the source code.

---

## Contact Information

If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact:

**Email**: [elkaliuke@gmail.com]
**GitHub Issues**: [https://github.com/keeeeeliu/LearnFlow/issues](https://github.com/keeeeeliu/LearnFlow/issues)

We will respond to privacy inquiries within 7 business days.

---

## Summary (TL;DR)

✅ **We store**: API keys and learning history **locally** on your device (encrypted)
✅ **We send**: Selected text to your chosen AI provider (OpenAI or Groq)
❌ **We DON'T**: Track you, collect personal data, or have central servers
🔐 **You control**: All your data, can delete anytime
📖 **Open source**: Fully transparent, auditable code

---

## Legal Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) - EU users have rights under GDPR
- California Consumer Privacy Act (CCPA) - California users have rights under CCPA
- Chrome Extension Privacy Requirements

**Your Rights Under GDPR/CCPA:**
- Right to access your data
- Right to delete your data
- Right to data portability
- Right to opt-out of data processing

Since all data is stored locally on your device and you control it, you can exercise these rights directly through the extension interface.

---

**By installing and using LearnFlow, you acknowledge that you have read and understood this Privacy Policy.**
