// Content script - runs on all web pages
console.log('AI Study Tool content script loaded');

let selectedText = '';

// Listen for text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    selectedText = selection.toString().trim();
    console.log('Text selected:', selectedText);
  }
});

// Listen for keyboard shortcuts (optional)
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+E or Cmd+Shift+E to trigger explanation
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    if (selectedText) {
      chrome.runtime.sendMessage({
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
      chrome.runtime.sendMessage({
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
    // Show loading state
    indicator.textContent = '⏳ Generating explanation...';
    indicator.style.background = '#f59e0b';

    chrome.runtime.sendMessage({
      type: 'REQUEST_EXPLANATION',
      text: text,
    }, (response) => {
      indicator.remove();

      if (response && response.success) {
        // Show explanation directly on the page
        showExplanationOverlay(response.data);
      } else {
        // Show error
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
    bottom: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
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

// Show explanation overlay on the page
function showExplanationOverlay(explanation: any) {
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
  defSection.style.cssText = 'margin-bottom: 20px;';
  const defTitle = document.createElement('h3');
  defTitle.textContent = 'Definition';
  defTitle.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  `;
  const defText = document.createElement('p');
  defText.textContent = explanation.definition;
  defText.style.cssText = `
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  `;
  defSection.appendChild(defTitle);
  defSection.appendChild(defText);

  // Examples
  const examplesSection = document.createElement('div');
  examplesSection.style.cssText = 'margin-bottom: 20px;';
  if (explanation.examples && explanation.examples.length > 0) {
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
      color: #4b5563;
      font-size: 14px;
      line-height: 1.6;
    `;
    explanation.examples.forEach((ex: string) => {
      const li = document.createElement('li');
      li.textContent = ex;
      li.style.marginBottom = '4px';
      exList.appendChild(li);
    });
    examplesSection.appendChild(exList);
  }

  // Assemble card
  card.appendChild(closeBtn);
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

        optBtn.addEventListener('mouseenter', () => {
          optBtn.style.background = '#dbeafe';
        });
        optBtn.addEventListener('mouseleave', () => {
          optBtn.style.background = 'white';
        });

        optBtn.addEventListener('click', () => {
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
          }
          optBtn.style.cursor = 'default';
        });

        quizSection.appendChild(optBtn);
      });
    }

    card.appendChild(quizSection);
  }

  overlay.appendChild(card);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  document.body.appendChild(overlay);
}
