// Background service worker for Chrome extension
console.log('AI Study Tool background service worker loaded');

// Store API key (you should store this securely in chrome.storage)
let apiKey = '';

// Load API key from storage on startup
chrome.storage.sync.get(['openaiApiKey'], (result) => {
  if (result.openaiApiKey) {
    apiKey = result.openaiApiKey;
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'REQUEST_EXPLANATION') {
    handleExplanationRequest(message.text)
      .then((explanation) => {
        sendResponse({ success: true, data: explanation });

        // Store in chrome.storage for popup to retrieve
        chrome.storage.local.set({
          lastExplanation: explanation,
          lastExplanationTime: Date.now()
        });

        // Send to popup if it's open
        chrome.runtime.sendMessage({
          type: 'EXPLANATION_GENERATED',
          data: explanation,
        }).catch(() => {
          // Popup might not be open, that's ok
        });
      })
      .catch((error) => {
        console.error('Error generating explanation:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }

  if (message.type === 'SET_API_KEY') {
    apiKey = message.apiKey;
    chrome.storage.sync.set({ openaiApiKey: message.apiKey });
    sendResponse({ success: true });
    return true;
  }
});

// Function to generate explanation using OpenAI API
async function handleExplanationRequest(text: string) {
  if (!apiKey) {
    throw new Error('OpenAI API key not set. Please configure it in the extension settings.');
  }

  const prompt = `You are a computer science tutor helping students learn technical concepts.

A student has highlighted the following term: "${text}"

Please provide a comprehensive explanation in the following JSON format:
{
  "term": "the term or concept",
  "definition": "clear, concise definition (2-3 sentences)",
  "examples": ["example 1", "example 2", "example 3"],
  "quizQuestion": "a multiple choice question to test understanding",
  "quizOptions": ["option 1", "option 2", "option 3", "option 4"],
  "quizAnswer": 0 (index of correct answer, 0-3)
}

Focus on technical interview and computer science concepts. Make explanations clear and beginner-friendly.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful computer science tutor. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON response
    const explanation = JSON.parse(content);
    return explanation;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    // Return a fallback explanation for testing
    return {
      term: text,
      definition: `This is a placeholder explanation for "${text}". To get AI-generated explanations, please set your OpenAI API key in the extension settings.`,
      examples: [
        'Example 1: Please configure your API key',
        'Example 2: Go to extension settings',
        'Example 3: Enter your OpenAI API key',
      ],
      quizQuestion: 'Have you configured your API key?',
      quizOptions: ['Yes', 'No', 'Not yet', 'What API key?'],
      quizAnswer: 0,
    };
  }
}

// Optional: Add context menu item for quick explanations
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'explainTerm',
    title: 'Explain "%s" with AI',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === 'explainTerm' && info.selectionText) {
    handleExplanationRequest(info.selectionText)
      .then((explanation) => {
        chrome.runtime.sendMessage({
          type: 'EXPLANATION_GENERATED',
          data: explanation,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});
