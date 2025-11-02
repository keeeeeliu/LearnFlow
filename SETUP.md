# AI Interview Study Extension - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Chrome browser
- OpenAI API key (get one at https://platform.openai.com/api-keys)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

   For development with auto-reload:
   ```bash
   npm run watch
   ```

3. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Configuration

### Set up OpenAI API Key

The extension needs an OpenAI API key to generate explanations:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Store it using Chrome's storage API (you can add a settings page, or temporarily set it via console in the background script)

**Temporary method (for testing):**
- Open the extension popup
- Open Chrome DevTools (right-click → Inspect)
- In the console, run:
  ```javascript
  chrome.runtime.sendMessage({
    type: 'SET_API_KEY',
    apiKey: 'your-api-key-here'
  });
  ```

## Usage

### Method 1: Extension Popup
1. Highlight any text on a webpage
2. Click the extension icon in the toolbar
3. Click "Explain Selected Text"
4. View the AI-generated explanation, examples, and quiz

### Method 2: Keyboard Shortcut
1. Highlight any text on a webpage
2. Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
3. The extension will automatically generate an explanation

### Method 3: Context Menu
1. Highlight any text on a webpage
2. Right-click on the selected text
3. Click "Explain [selected text] with AI"

### Method 4: Visual Indicator
- After selecting text, a blue indicator will appear in the bottom-right corner
- Click it to get an explanation
- It auto-disappears after 5 seconds

## Features

- **AI-Powered Explanations**: Get detailed definitions and explanations of technical terms
- **Code Examples**: See practical examples of concepts
- **Interactive Quizzes**: Test your understanding with AI-generated questions
- **Topic Saving**: Save topics you've learned for future reference
- **Multiple Trigger Methods**: Use popup, keyboard shortcuts, or context menu

## Development

### Project Structure

```
studytoolDev/
├── public/
│   ├── manifest.json      # Chrome extension manifest
│   └── icons/             # Extension icons (add your own)
├── src/
│   ├── components/
│   │   └── Popup.tsx      # Main popup React component
│   ├── scripts/
│   │   ├── background.ts  # Background service worker
│   │   └── content.ts     # Content script for web pages
│   ├── styles/
│   │   └── index.css      # Global styles with Tailwind
│   └── popup.tsx          # Popup entry point
├── popup.html             # Popup HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start Vite dev server (for testing components)
- `npm run build` - Build the extension for production
- `npm run watch` - Build in watch mode (auto-rebuild on changes)
- `npm run preview` - Preview the production build

### Making Changes

1. Make your changes to the source files
2. Run `npm run build` or `npm run watch`
3. Reload the extension in Chrome (`chrome://extensions/` → click reload icon)
4. Test your changes

## Customization

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **API Integration**: Modify `src/scripts/background.ts`
3. **UI Styling**: Edit Tailwind classes in components or add custom CSS to `src/styles/index.css`

### Changing AI Model

In `src/scripts/background.ts`, modify the model parameter:
```typescript
model: 'gpt-4', // or 'gpt-3.5-turbo', 'gpt-4-turbo', etc.
```

## Troubleshooting

### Extension not loading
- Make sure you built the project (`npm run build`)
- Check that you're loading the `dist` folder, not the root folder
- Look for errors in Chrome's extension page

### API errors
- Verify your OpenAI API key is valid
- Check your API usage limits and billing
- Look at the background service worker console for error messages

### Content script not working
- Check the browser console on the webpage for errors
- Verify the content script is listed in the manifest
- Try reloading the extension

## Next Steps

- Add a settings page for API key configuration
- Implement local storage for conversation history
- Add visual diagrams generation
- Integrate with LeetCode/GeeksforGeeks
- Add "Explain this code" mode with syntax highlighting

## Security Notes

- Never commit your API keys to version control
- Store API keys securely using Chrome's storage API
- Consider using environment variables for development
- For production, implement a backend proxy to hide API keys

## License

MIT
