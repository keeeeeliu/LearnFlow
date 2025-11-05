# LearnFlow User Guide

Welcome to **LearnFlow** - your AI-powered study companion for learning technical concepts directly on any webpage!

---

## Table of Contents

1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [How to Use LearnFlow](#how-to-use-learnflow)
4. [Features Guide](#features-guide)
5. [Tips & Best Practices](#tips--best-practices)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Installation

### Step 1: Download the Extension

1. Download or clone the LearnFlow extension folder
2. Locate the `dist/` folder inside the extension directory

### Step 2: Load in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `dist/` folder from the LearnFlow directory
6. The LearnFlow icon should now appear in your Chrome toolbar!

---

## Initial Setup

Before you can start learning, you need to configure an AI API provider.

### Choose Your AI Provider

LearnFlow supports two AI providers:

| Provider | Cost | Speed | Best For |
|----------|------|-------|----------|
| **Groq** | FREE | Very Fast | Students, learners (Recommended!) |
| **OpenAI** | Paid (~$0.001-0.003/explanation) | Fast | Premium quality responses |

### Configure Groq (FREE - Recommended)

1. **Get your free API key:**
   - Visit [console.groq.com/keys](https://console.groq.com/keys)
   - Sign in with Google or create a free account
   - Click "Create API Key"
   - Copy the key (starts with `gsk_`)

2. **Add key to LearnFlow:**
   - Click the LearnFlow icon in your Chrome toolbar
   - Click **Options** at the bottom of the popup
   - Select **Groq** as your AI provider
   - Paste your API key in the field
   - Click **Save API Key**
   - You'll see a green confirmation: "Groq API Key Configured"

### Configure OpenAI (Premium)

1. **Get your API key:**
   - Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Sign in or create an OpenAI account
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)
   - (Make sure you have enough credit balance)

2. **Add key to LearnFlow:**
   - Click the LearnFlow icon in your Chrome toolbar
   - Click **Options**
   - Select **OpenAI** as your AI provider
   - Paste your API key
   - Click **Save API Key**

---

## How to Use LearnFlow

1. **Browse any webpage** with technical content (blog posts, documentation, articles, etc.)
2. **Select a term** you want to learn about (e.g., "binary search tree")
3. **Click the blue indicator** that appears next to your selection
4. **View the AI explanation** with definition, examples, and quiz
5. **Ask follow-up questions** in the chat interface
6. **Save as image** for offline study (optional), chat history is included in the image. The term is automatically added to your "Saved Topics" list
7. **Note:** Saved topics are stored locally on your device and sync across Chrome on the same computer.


---

## Tips & Best Practices

### Getting the Best Explanations

1. **Select specific terms:** Instead of selecting full sentences, select the key term
   - ✓ Good: "binary search tree"
   - ✗ Too broad: "what is a binary search tree and how does it work"

2. **Use technical terms:** LearnFlow is designed for computer science and technical concepts
   - Works great: "Big O notation", "RESTful API", "closures"
   - Also works: General programming concepts

3. **Ask specific follow-up questions:** Be clear about what you want to learn
   - ✓ Good: "Show me how to implement this in JavaScript"
   - ✗ Vague: "Tell me more"

### Maximizing Your Learning

1. **Take the quiz first:** Test yourself before asking questions
2. **Save important concepts:** Export as image for later review
3. **Build a collection:** Create a folder for all your LearnFlow images organized by topic
4. **Use on documentation:** Great for reading official docs, tutorials, and technical articles
5. **Combine with note-taking:** Use LearnFlow images in your digital notes (Notion, Obsidian, etc.)

### Efficient Studying

**For interview prep:**
- Use LearnFlow while reading LeetCode problem descriptions
- Save explanations for algorithms and data structures
- Build a visual reference library of all key concepts

**For learning new technologies:**
- Use while reading documentation
- Ask "How is this different from [familiar concept]?"
- Request examples in your preferred programming language

**For coursework:**
- Use while reading textbooks or papers
- Save complex concepts as images
- Review saved images before exams

---

## Troubleshooting

### Extension Not Working

**Problem:** Blue indicator doesn't appear when selecting text.

**Solutions:**
1. Refresh the webpage
2. Check that the extension is enabled: `chrome://extensions/`
3. Verify you're on a regular webpage (doesn't work on Chrome internal pages)

---

**Problem:** "Extension context invalidated" error appears.

**Solution:**
- This happens when the extension updates while the page is open
- Simply refresh the page to restore functionality
- Orange warning will appear telling you to refresh

---

**Problem:** Extension icon doesn't open popup.

**Solutions:**
1. Remove and reload the extension
2. Check browser console for errors
3. Make sure you loaded the `dist/` folder (not the root folder)

### API Issues

**Problem:** "API key not set" error.

**Solutions:**
1. Open Options page and verify API key is saved
2. Check you've selected the correct provider (Groq or OpenAI)
3. Make sure the key format is correct:
   - Groq keys start with `gsk_`
   - OpenAI keys start with `sk-`

---

**Problem:** "API request failed" error.

**Groq-specific:**
- Check your Groq account hasn't hit rate limits (~30 requests/minute)
- Verify the API key is still valid at [console.groq.com/keys](https://console.groq.com/keys)
- Wait 1 minute and try again

**OpenAI-specific:**
- Check you have available credit: [platform.openai.com/usage](https://platform.openai.com/usage)
- Verify billing is set up (OpenAI requires payment info even with free credits)
- Check if the key was revoked

---

**Problem:** "Model has been decommissioned" error.

**Solution:**
- Report this issue - the extension needs updating
- The model version hardcoded in the extension may be outdated
- Switch to the other AI provider temporarily

### Image Export Issues

**Problem:** Saved image is cropped or missing content.

**Solution:**
- This has been fixed in the latest version
- Make sure you're using the most recent build
- All chat messages should be included in the export

---

**Problem:** Can't find saved images.

**Solution:**
- Check your Downloads folder
- Look for files named `LearnFlow_[Term]_[Timestamp].png`
- On Chrome, click the Downloads icon (bottom-left) to see recent downloads

### PDF Support

**Problem:** Extension doesn't work on PDF files.

**Explanation:**
- Chrome's built-in PDF viewer blocks content scripts
- This is a Chrome security limitation, not a LearnFlow bug

**Workarounds:**
1. Copy text from the PDF and paste into a text editor or webpage
2. Use web-based PDF viewers (like ArXiv.org for research papers)
3. Convert PDF to HTML using online tools

---

## FAQ

### General Questions

**Q: Is LearnFlow free to use?**

A: The extension itself is free. API costs depend on your provider:
- **Groq:** Completely FREE with rate limits
- **OpenAI:** ~$0.001-0.003 per explanation (new users get $5 free credit)

---

**Q: Does LearnFlow collect my data?**

A: No! LearnFlow:
- Stores API keys locally (encrypted by Chrome)
- Stores saved topics locally on your device
- Doesn't send any data to servers except AI API calls
- Has no analytics or tracking
- Is fully open source

---

**Q: Can I use LearnFlow offline?**

A: No, LearnFlow requires internet to call AI APIs. However:
- You can save explanations as images for offline study
- Saved topics list works offline

---

**Q: What websites does LearnFlow work on?**

A: LearnFlow works on almost all websites:
- ✓ Blog posts, articles, documentation
- ✓ Wikipedia, Medium, Dev.to
- ✓ GitHub READMEs and code files
- ✓ Online courses and tutorials
- ✗ Chrome internal pages (chrome://, edge://)
- ✗ Chrome Web Store pages
- ✗ Built-in PDF viewer (see workarounds above)

---

**Q: Can I use both Groq and OpenAI?**

A: Yes! You can:
- Save both API keys in Options
- Switch between providers anytime
- Only one can be active at a time

---

**Q: How many explanations can I generate?**

A: Depends on your API provider:
- **Groq:** ~30 requests per minute (plenty for studying)
- **OpenAI:** Unlimited (as long as you have credit)

---

### Feature Questions

**Q: Can I customize the explanation format?**

A: Currently no, but the format is optimized for learning:
- Clear definition
- Code examples with syntax highlighting
- Real-world use cases
- Interactive quiz

---

**Q: Can I export explanations as text/PDF instead of images?**

A: Currently only PNG image export is supported. You can:
- Use the images in documents
- Convert PNG to PDF using online tools
- Take screenshots with more context

---

**Q: Can I edit saved topics names?**

A: Not currently. Topics are saved with the exact term from the explanation.

---

**Q: Does the chat remember previous conversations?**

A: Only within the same explanation card. Each new term starts a fresh conversation. However:
- Chat history is preserved in saved images
- The AI remembers context about the current term

---

**Q: Can I share my API key with friends?**

A: Not recommended:
- Groq keys are free - everyone should get their own
- OpenAI charges your account - sharing means paying for others' usage
- API keys are like passwords - keep them private

---

### Technical Questions

**Q: Why does it take a few seconds to load?**

A: LearnFlow:
1. Sends your text to the AI API
2. AI generates a comprehensive explanation
3. Parses the response and formats it
4. This typically takes 2-5 seconds depending on API speed

Groq is generally faster than OpenAI.

---

**Q: Can I use LearnFlow for non-CS topics?**

A: Yes, but it's optimized for technical/CS concepts. It may work for:
- Math, physics, engineering
- Business/finance terms
- Scientific concepts

It's not ideal for:
- Creative writing
- Translations
- General questions (use ChatGPT instead)

---

**Q: What programming languages does it support?**

A: LearnFlow can provide examples in most languages:
- Python, JavaScript, Java, C++, C#
- Go, Rust, Swift, Kotlin
- SQL, HTML, CSS
- And many more!

You can ask for specific languages in follow-up questions.

---

**Q: How do I update LearnFlow?**

A: Since it's loaded as an unpacked extension:
1. Download the new version
2. Replace the old `dist/` folder
3. Go to `chrome://extensions/`
4. Click the refresh icon on LearnFlow
5. Your settings and saved topics are preserved

---

**Q: Can I use LearnFlow on mobile?**

A: Not directly (Chrome extensions don't work on mobile Chrome). However:
- Save explanations as images on desktop
- View/study those images on mobile
- Sync images via Google Drive, iCloud, etc.

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the README:** See `README.md` for technical details
2. **Open browser console:**
   - Press F12 → Console tab
   - Look for error messages starting with `[LearnFlow]`
3. **Report issues:** Contact the developer or open a GitHub issue

---

## Quick Reference Card

| Action | How To |
|--------|--------|
| Get explanation | Select text → Click blue indicator |
| Ask question | Type in chat box → Press Enter |
| Save for later | Click "💾 Save as Image" |
| Delete topic | Open popup → Click ✕ on topic |
| Change API | Click Options → Select provider → Save key |
| Refresh extension | chrome://extensions/ → Click 🔄 |

---

**Happy Learning with LearnFlow!** 🚀

Made with ❤️ for learners everywhere
