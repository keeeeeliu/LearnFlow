# LearnFlow - Chrome Extension

> Keep your learning in flow

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📖 The Problem

You're deep into reading a technical article. The concepts are clicking. Your mind is racing. Then you hit it—**"binary search tree"**. Wait, what's that again?

You open a new tab. Google it. Skim Stack Overflow. Maybe watch a YouTube video. Ten minutes later, you've lost your place, your train of thought, and your momentum.

**Learning shouldn't break your flow.**

## 💡 The Solution

LearnFlow keeps you in the zone. Simply select any unfamiliar term, get an instant AI-powered explanation right where you are, and continue reading—all without breaking stride. No context switching. No tab juggling. Just seamless learning that moves at the speed of your curiosity.

**Your learning flow, uninterrupted.**

Perfect for students grinding LeetCode, developers exploring new tech stacks, or anyone learning computer science concepts.

---

## 📚 Documentation

**New users:** See the complete [**User Guide →**](./USER_GUIDE.md) for installation, setup, and usage instructions.

**Developers:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical architecture details.

---

## ✨ Features

### 🎯 Core Features

- **Smart Text Selection** - Highlight any term on any webpage to get instant explanations
- **AI-Powered Explanations** - Comprehensive definitions with context and clarity
- **Code Examples** - Markdown-formatted code blocks with syntax highlighting
- **Interactive Quizzes** - Test your understanding with multiple-choice questions
- **Follow-up Chat** - Ask additional questions to deepen your understanding
- **Save as Image** - Export complete explanations (including chat history) as PNG images for offline study
- **Topic Tracking** - Automatically saves topics when you export images
- **Context Validation** - Smart error handling with user-friendly notifications
- **Multiple AI Providers** - Choose between OpenAI (premium) or Groq (free)

### 🛠️ Technical Features

- **Manifest v3** - Latest Chrome extension architecture
- **Service Worker** - Efficient background processing
- **Chrome Storage API** - Encrypted local storage for API keys
- **Message Passing** - Seamless communication between components
- **Responsive Design** - Beautiful UI built with Tailwind CSS
- **Error Recovery** - Graceful handling of extension context invalidation

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/learnflow-extension.git
cd learnflow-extension

# Install dependencies
npm install

# Build the extension
npm run build
```

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `dist/` folder

### 3. Configure API Key

1. Click the LearnFlow icon in Chrome toolbar
2. Click **Options**
3. Choose your AI provider:
   - **Groq (FREE)**: Get free API key from [console.groq.com/keys](https://console.groq.com/keys)
   - **OpenAI (Paid)**: Get API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Paste and save your key
5. Start learning!

📖 **Detailed instructions:** See the [User Guide](./USER_GUIDE.md) for complete setup and usage documentation.

---

## 💡 How It Works

1. **Select Text** - Highlight any technical term on a webpage
2. **Get Explanation** - Click the blue indicator that appears
3. **Learn Interactively** - View definition, examples, and quiz
4. **Ask Questions** - Use the built-in chat for follow-ups
5. **Save for Later** - Export as image to your local device

---

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - UI components and state management
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Tailwind CSS 3.4.17** - Utility-first styling
- **html2canvas 1.4.1** - Image export functionality

### Build Tools
- **Vite 5.4.11** - Fast bundler and dev server
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript Compiler** - Type checking and compilation

### Chrome Extension APIs
- **Manifest v3** - Modern extension architecture
- **Content Scripts** - DOM manipulation and text detection
- **Service Workers** - Background API communication
- **Storage API** - Encrypted local data storage
- **Runtime API** - Message passing between components

### External APIs
- **OpenAI GPT-3.5 Turbo** - Premium AI explanations (paid)
- **Groq (Llama 3.3)** - Fast, free AI alternative

---

## 🏗️ Project Structure

```
studytoolDev/
├── public/
│   ├── background.js          # Service worker (plain JS)
│   ├── manifest.json           # Extension configuration
│   └── icons/                  # Extension icons (48, 128)
│
├── src/
│   ├── components/
│   │   ├── Popup.tsx          # Main popup component
│   │   └── Options.tsx        # Settings page component
│   │
│   ├── scripts/
│   │   └── content.ts         # Content script (webpage injection)
│   │
│   ├── styles/
│   │   └── index.css          # Tailwind CSS
│   │
│   ├── popup.tsx              # Popup entry point
│   └── options.tsx            # Options entry point
│
├── dist/                       # Build output (load this in Chrome)
├── USER_GUIDE.md               # Complete user documentation
└── ARCHITECTURE.md             # Technical architecture docs
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start Vite dev server (for component testing)
npm run build    # Production build
npm run watch    # Development build with watch mode
npm run preview  # Preview production build
```

### Build Process

1. TypeScript compilation (`tsc`)
2. Vite bundling (React components)
3. Tailwind CSS compilation
4. Copy static files (background.js, manifest.json, icons)
5. Output to `dist/` folder

### Adding Features

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation on:
- Component structure
- Message passing
- Chrome API usage
- Adding new features

---

## 💰 Cost & Free Options

### **Groq (Recommended - FREE)**
- ✨ **Completely FREE** with rate limits
- Fast inference with Llama 3.3 model
- ~30 requests per minute
- Perfect for learning and studying
- Get free API key: [console.groq.com/keys](https://console.groq.com/keys)

### **OpenAI (Premium Option)**
- Premium quality with GPT-3.5 Turbo
- **Explanation request**: ~$0.001 - $0.003 per request
- **Chat message**: ~$0.0005 - $0.001 per message
- New accounts get $5 free credit (~5000 explanations)
- Monitor usage: [platform.openai.com/usage](https://platform.openai.com/usage)

---

## 🔐 Privacy & Security

- **API Keys**: Stored locally in Chrome's encrypted storage, never sent to any server except OpenAI/Groq
- **No Tracking**: No analytics, no data collection
- **Local Storage**: All saved topics stored on your device
- **Open Source**: Fully transparent codebase
- **User Control**: Users provide their own API keys and pay for their own usage

---

## ⚠️ Known Limitations

- **PDF Support**: Chrome's built-in PDF viewer blocks content script injection
  - **Workaround**: Copy text from PDF and paste into a webpage, or use web-based PDF viewers
- **Extension Context**: If extension updates while page is open, refresh the page to restore functionality
  - LearnFlow will show an orange warning when this happens

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- OpenAI for the GPT-3.5 Turbo API
- Groq for the free Llama 3.3 API
- Chrome Extensions documentation and community
- React, TypeScript, and Tailwind CSS teams

---

## 📧 Contact

Project Link: [https://github.com/keeeeeliu/LearnFlow](https://github.com/keeeeeliu/LearnFlow)

---

**Made with ❤️ for learners everywhere**
