// Content script - runs on all web pages
import html2canvas from 'html2canvas';

console.log('AI Study Tool content script loaded');

let selectedText = '';

// Check if extension context is valid
function isExtensionContextValid(): boolean {
  try {
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (e) {
    return false;
  }
}

// Safe wrapper for chrome.runtime.sendMessage
function safeSendMessage(message: any, callback?: (response: any) => void): Promise<any> | void {
  if (!isExtensionContextValid()) {
    console.warn('Extension context invalidated. Please refresh the page.');
    showNotification('⚠️ Please refresh this page.', '#f59e0b');
    if (callback) {
      return;
    }
    return Promise.reject(new Error('Extension context invalidated'));
  }

  if (callback) {
    // Callback mode
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Message error:', chrome.runtime.lastError);
          showNotification('⚠️ Please refresh the page to use the extension.', '#f59e0b');
          return;
        }
        callback(response);
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      showNotification('⚠️ Extension context lost. Please refresh the page.', '#ef4444');
    }
  } else {
    // Promise mode
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Message error:', chrome.runtime.lastError);
            showNotification('⚠️ Please refresh the page to use the extension.', '#f59e0b');
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      } catch (error) {
        console.error('Failed to send message:', error);
        showNotification('⚠️ Extension context lost. Please refresh the page.', '#ef4444');
        reject(error);
      }
    });
  }
}

// Listen for text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    selectedText = selection.toString().trim();
  }
});

// Listen for keyboard shortcuts (optional)
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+E or Cmd+Shift+E to trigger explanation
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    if (selectedText) {
      safeSendMessage({
        type: 'REQUEST_EXPLANATION',
        text: selectedText,
      });
    }
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_SELECTED_TEXT') {
    if (selectedText) {
      safeSendMessage({
        type: 'REQUEST_EXPLANATION',
        text: selectedText,
      });
      sendResponse({ success: true, text: selectedText });
    } else {
      sendResponse({ success: false, error: 'No text selected' });
    }
  }
  return true;
});

// Optional: Create a visual indicator for selected text
function showSelectionIndicator(text: string) {
  // Remove existing indicator
  const existing = document.getElementById('ai-study-indicator');
  if (existing) {
    existing.remove();
  }

  // Create new indicator
  const indicator = document.createElement('div');
  indicator.id = 'ai-study-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  indicator.textContent = `📚 Explain: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;

  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.05)';
  });

  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)';
  });

  indicator.addEventListener('click', () => {
    // Remove indicator and show loading overlay immediately
    indicator.remove();
    showLoadingOverlay(text);

    // Send request to background script
    safeSendMessage({
      type: 'REQUEST_EXPLANATION',
      text: text,
    }, (response) => {
      if (response && response.success) {
        // Replace loading overlay with explanation
        showExplanationOverlay(response.data);
      } else {
        // Remove loading and show error
        const loadingOverlay = document.getElementById('ai-study-overlay');
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
        showNotification('✗ Error generating explanation. Try again.', '#ef4444');
      }
    });
  });

  document.body.appendChild(indicator);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (indicator.parentElement) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }, 5000);
}

// Show indicator when text is selected
document.addEventListener('mouseup', () => {
  setTimeout(() => {
    if (selectedText && selectedText.length > 2) {
      showSelectionIndicator(selectedText);
    }
  }, 100);
});

// Show notification message
function showNotification(message: string, bgColor: string) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10001;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Parse text with markdown code blocks
function parseMarkdown(text: string): HTMLElement {
  const container = document.createElement('div');

  // Split by code blocks (```language\ncode\n```)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      const textEl = parseInlineCode(textBefore);
      container.appendChild(textEl);
    }

    // Add code block
    const language = match[1] || 'code';
    const code = match[2];
    const codeBlock = document.createElement('pre');
    codeBlock.style.cssText = `
      background: #1e293b;
      color: #e2e8f0;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 12px 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      position: relative;
    `;

    // Add language label
    const langLabel = document.createElement('div');
    langLabel.style.cssText = `
      position: absolute;
      top: 8px;
      right: 12px;
      background: #334155;
      color: #94a3b8;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
    `;
    langLabel.textContent = language;
    codeBlock.appendChild(langLabel);

    const codeEl = document.createElement('code');
    codeEl.textContent = code.trim();
    codeBlock.appendChild(codeEl);

    container.appendChild(codeBlock);

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    const textEl = parseInlineCode(textAfter);
    container.appendChild(textEl);
  }

  // If no code blocks found, just parse inline code
  if (lastIndex === 0) {
    return parseInlineCode(text);
  }

  return container;
}

// Parse inline code (`code`)
function parseInlineCode(text: string): HTMLElement {
  const container = document.createElement('span');
  const inlineCodeRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineCodeRegex.exec(text)) !== null) {
    // Add text before inline code
    if (match.index > lastIndex) {
      const textNode = document.createTextNode(text.substring(lastIndex, match.index));
      container.appendChild(textNode);
    }

    // Add inline code
    const codeEl = document.createElement('code');
    codeEl.style.cssText = `
      background: #f1f5f9;
      color: #e11d48;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    `;
    codeEl.textContent = match[1];
    container.appendChild(codeEl);

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textNode = document.createTextNode(text.substring(lastIndex));
    container.appendChild(textNode);
  }

  // If no inline code found, just return text
  if (lastIndex === 0) {
    container.textContent = text;
  }

  return container;
}

// Show loading overlay with animation
function showLoadingOverlay(term: string) {
  // Remove existing overlay
  const existing = document.getElementById('ai-study-overlay');
  if (existing) {
    existing.remove();
  }

  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.id = 'ai-study-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  // Create loading card
  const card = document.createElement('div');
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 48px;
    text-align: center;
    min-width: 320px;
  `;

  // Create animated spinner
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    border: 4px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
  `;
  document.head.appendChild(style);

  // Loading text
  const loadingText = document.createElement('div');
  loadingText.style.cssText = `
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  `;
  loadingText.textContent = 'Generating explanation';

  // Animated dots
  const dots = document.createElement('span');
  dots.style.cssText = `
    display: inline-block;
    width: 20px;
    text-align: left;
  `;
  dots.textContent = '...';
  loadingText.appendChild(dots);

  // Animate dots
  let dotCount = 0;
  const dotsInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    dots.textContent = '.'.repeat(dotCount);
  }, 500);

  // Store interval on overlay for cleanup
  (overlay as any).dotsInterval = dotsInterval;

  // Subtitle
  const subtitle = document.createElement('div');
  subtitle.style.cssText = `
    font-size: 14px;
    color: #6b7280;
  `;
  subtitle.textContent = `Learning about "${term}"`;

  card.appendChild(spinner);
  card.appendChild(loadingText);
  card.appendChild(subtitle);
  overlay.appendChild(card);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      clearInterval(dotsInterval);
      overlay.remove();
      style.remove();
    }
  });

  document.body.appendChild(overlay);
}

// Show explanation overlay on the page
function showExplanationOverlay(explanation: any) {
  // Remove existing overlay (and clean up loading animation if present)
  const existing = document.getElementById('ai-study-overlay');
  if (existing) {
    const dotsInterval = (existing as any).dotsInterval;
    if (dotsInterval) {
      clearInterval(dotsInterval);
    }
    existing.remove();
  }

  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.id = 'ai-study-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  // Create content card
  const card = document.createElement('div');
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 24px;
    position: relative;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
  `;
  closeBtn.addEventListener('click', () => overlay.remove());

  // Save as Image button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾 Save as Image';
  saveBtn.style.cssText = `
    position: absolute;
    top: 16px;
    right: 60px;
    background: #3b82f6;
    color: white;
    border: none;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  `;
  saveBtn.addEventListener('mouseenter', () => {
    saveBtn.style.background = '#2563eb';
  });
  saveBtn.addEventListener('mouseleave', () => {
    saveBtn.style.background = '#3b82f6';
  });
  saveBtn.addEventListener('click', async () => {
    saveBtn.textContent = '⏳ Saving...';
    saveBtn.style.pointerEvents = 'none';

    try {
      // Create a clone of the card for capturing
      const cloneCard = card.cloneNode(true) as HTMLElement;

      // Style the clone to show full content without restrictions
      cloneCard.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        padding: 24px;
        position: absolute;
        top: -10000px;
        left: -10000px;
        max-height: none;
        overflow: visible;
        height: auto;
      `;

      // Remove buttons from clone
      const cloneCloseBtn = cloneCard.querySelector('button:first-of-type');
      const cloneSaveBtn = cloneCard.querySelectorAll('button')[1];
      if (cloneCloseBtn) cloneCloseBtn.remove();
      if (cloneSaveBtn) cloneSaveBtn.remove();

      // Expand chat messages container to show all messages
      const chatMessagesContainer = cloneCard.querySelector('#ai-chat-messages') as HTMLElement;
      if (chatMessagesContainer) {
        chatMessagesContainer.style.maxHeight = 'none';
        chatMessagesContainer.style.overflowY = 'visible';
      }

      // Add clone to body
      document.body.appendChild(cloneCard);

      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the clone
      const canvas = await html2canvas(cloneCard, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Remove the clone
      cloneCard.remove();

      // Show buttons again
      saveBtn.textContent = '💾 Save as Image';
      saveBtn.style.pointerEvents = 'auto';

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${explanation.term.replace(/[^a-z0-9]/gi, '_')}_explanation.png`;
          a.click();
          URL.revokeObjectURL(url);

          // Save topic to saved topics
          chrome.storage.local.get(['savedTopics'], (result) => {
            const savedTopics = result.savedTopics || [];
            if (!savedTopics.includes(explanation.term)) {
              savedTopics.push(explanation.term);
              chrome.storage.local.set({ savedTopics: savedTopics });
            }
          });

          // Show success notification
          showNotification('✓ Image saved successfully!', '#10b981');
        }
      });
    } catch (error) {
      console.error('Error saving image:', error);
      saveBtn.textContent = '💾 Save as Image';
      saveBtn.style.pointerEvents = 'auto';
      showNotification('✗ Failed to save image', '#ef4444');
    }
  });

  // Title
  const title = document.createElement('h2');
  title.textContent = explanation.term;
  title.style.cssText = `
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 16px 0;
  `;

  // Definition
  const defSection = document.createElement('div');
  defSection.style.cssText = `
    background: #eff6ff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
  `;
  const defTitle = document.createElement('h3');
  defTitle.textContent = 'Definition';
  defTitle.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  `;
  const defText = document.createElement('div');
  const parsedDef = parseMarkdown(explanation.definition);
  defText.appendChild(parsedDef);
  defText.style.cssText = `
    font-size: 14px;
    color: #000000;
    line-height: 1.6;
    margin: 0;
  `;
  defSection.appendChild(defTitle);
  defSection.appendChild(defText);

  // Examples
  const examplesSection = document.createElement('div');
  if (explanation.examples && explanation.examples.length > 0) {
    examplesSection.style.cssText = `
      background: #eff6ff;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    `;
    const exTitle = document.createElement('h3');
    exTitle.textContent = 'Examples';
    exTitle.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 8px 0;
    `;
    examplesSection.appendChild(exTitle);

    const exList = document.createElement('ul');
    exList.style.cssText = `
      margin: 0;
      padding-left: 20px;
      color: #000000;
      font-size: 14px;
      line-height: 1.6;
    `;
    explanation.examples.forEach((ex: string) => {
      const li = document.createElement('li');
      const parsedEx = parseMarkdown(ex);
      li.appendChild(parsedEx);
      li.style.marginBottom = '8px';
      exList.appendChild(li);
    });
    examplesSection.appendChild(exList);
  }

  // Assemble card
  card.appendChild(closeBtn);
  card.appendChild(saveBtn);
  card.appendChild(title);
  card.appendChild(defSection);
  card.appendChild(examplesSection);

  // Quiz section
  if (explanation.quizQuestion) {
    const quizSection = document.createElement('div');
    quizSection.style.cssText = `
      background: #eff6ff;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    `;

    const quizTitle = document.createElement('h3');
    quizTitle.textContent = 'Quick Quiz';
    quizTitle.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
      margin: 0 0 12px 0;
    `;

    const quizQ = document.createElement('p');
    quizQ.textContent = explanation.quizQuestion;
    quizQ.style.cssText = `
      font-size: 14px;
      color: #1e3a8a;
      margin: 0 0 12px 0;
    `;

    quizSection.appendChild(quizTitle);
    quizSection.appendChild(quizQ);

    // Quiz options
    if (explanation.quizOptions) {
      const allButtons: HTMLButtonElement[] = [];

      explanation.quizOptions.forEach((option: string, index: number) => {
        const optBtn = document.createElement('button');
        optBtn.textContent = option;
        optBtn.style.cssText = `
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          margin-bottom: 8px;
          background: white;
          border: 2px solid #dbeafe;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #1e40af;
          transition: all 0.2s;
        `;

        let isClicked = false;

        const hoverIn = () => {
          if (!isClicked) {
            optBtn.style.background = '#dbeafe';
          }
        };
        const hoverOut = () => {
          if (!isClicked) {
            optBtn.style.background = 'white';
          }
        };

        optBtn.addEventListener('mouseenter', hoverIn);
        optBtn.addEventListener('mouseleave', hoverOut);

        optBtn.addEventListener('click', () => {
          // Prevent clicking if already answered
          if (isClicked) return;

          isClicked = true;

          // Disable all buttons and remove hover effects
          allButtons.forEach(btn => {
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';
          });

          // Show result
          if (index === explanation.quizAnswer) {
            optBtn.style.background = '#10b981';
            optBtn.style.color = 'white';
            optBtn.style.borderColor = '#10b981';
            optBtn.textContent = '✓ ' + option;
          } else {
            optBtn.style.background = '#ef4444';
            optBtn.style.color = 'white';
            optBtn.style.borderColor = '#ef4444';
            optBtn.textContent = '✗ ' + option;

            // Also highlight the correct answer
            const correctBtn = allButtons[explanation.quizAnswer];
            if (correctBtn) {
              correctBtn.style.background = '#10b981';
              correctBtn.style.color = 'white';
              correctBtn.style.borderColor = '#10b981';
              correctBtn.textContent = '✓ ' + explanation.quizOptions[explanation.quizAnswer];
            }
          }
        });

        allButtons.push(optBtn);
        quizSection.appendChild(optBtn);
      });
    }

    card.appendChild(quizSection);
  }

  // Chat section
  const chatSection = document.createElement('div');
  chatSection.style.cssText = `
    margin-top: 20px;
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
  `;

  const chatTitle = document.createElement('h3');
  chatTitle.textContent = '💬 Ask Follow-up Questions';
  chatTitle.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 12px 0;
  `;

  // Chat messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'ai-chat-messages';
  messagesContainer.style.cssText = `
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
    padding: 8px;
    background: #f9fafb;
    border-radius: 6px;
  `;

  // Initial system message
  const initialMsg = document.createElement('div');
  initialMsg.style.cssText = `
    padding: 8px 12px;
    background: #e0f2fe;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #0c4a6e;
  `;
  initialMsg.textContent = `I'm here to help! Ask me anything about "${explanation.term}"`;
  messagesContainer.appendChild(initialMsg);

  // Chat input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = `
    display: flex;
    gap: 8px;
  `;

  const chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Ask a follow-up question...';
  chatInput.style.cssText = `
    flex: 1;
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  `;
  chatInput.addEventListener('focus', () => {
    chatInput.style.borderColor = '#3b82f6';
  });
  chatInput.addEventListener('blur', () => {
    chatInput.style.borderColor = '#e5e7eb';
  });

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.style.cssText = `
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  sendBtn.addEventListener('mouseenter', () => {
    sendBtn.style.background = '#2563eb';
  });
  sendBtn.addEventListener('mouseleave', () => {
    sendBtn.style.background = '#3b82f6';
  });

  // Handle sending messages
  const sendMessage = async () => {
    const question = chatInput.value.trim();
    if (!question) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.style.cssText = `
      padding: 8px 12px;
      background: #dbeafe;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #1e40af;
      text-align: right;
    `;
    userMsg.textContent = `You: ${question}`;
    messagesContainer.appendChild(userMsg);

    // Clear input
    chatInput.value = '';

    // Add loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = `
      padding: 8px 12px;
      background: #f3f4f6;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #6b7280;
      font-style: italic;
    `;
    loadingMsg.textContent = 'AI is thinking...';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Send to background script
    try {
      const response = await safeSendMessage({
        type: 'CHAT_MESSAGE',
        question: question,
        context: explanation.term,
      });

      // Remove loading message
      loadingMsg.remove();

      if (response && response.success) {
        // Add AI response
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = `
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #000000;
          line-height: 1.5;
        `;
        const aiLabel = document.createElement('strong');
        aiLabel.textContent = 'AI: ';
        aiLabel.style.color = '#2563eb';
        aiMsg.appendChild(aiLabel);
        const parsedAnswer = parseMarkdown(response.answer);
        aiMsg.appendChild(parsedAnswer);
        messagesContainer.appendChild(aiMsg);
      } else {
        // Show error
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          padding: 8px 12px;
          background: #fee2e2;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #991b1b;
        `;
        errorMsg.textContent = 'Error: Could not get response. Please try again.';
        messagesContainer.appendChild(errorMsg);
      }

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      loadingMsg.remove();
      console.error('Chat error:', error);
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  inputContainer.appendChild(chatInput);
  inputContainer.appendChild(sendBtn);

  chatSection.appendChild(chatTitle);
  chatSection.appendChild(messagesContainer);
  chatSection.appendChild(inputContainer);

  card.appendChild(chatSection);

  overlay.appendChild(card);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  document.body.appendChild(overlay);
}
