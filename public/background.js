// Background service worker for LearnFlow Chrome extension
console.log('LearnFlow background service worker loaded');

// ============================================================================
// MESSAGE LISTENER - Entry point for all extension messages
// ============================================================================

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
    chrome.storage.sync.set({ openaiApiKey: message.apiKey });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'CHAT_MESSAGE') {
    handleChatMessage(message.question, message.context)
      .then((answer) => {
        sendResponse({ success: true, answer: answer });
      })
      .catch((error) => {
        console.error('Error handling chat message:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// ============================================================================
// EXPLANATION REQUEST HANDLER
// ============================================================================

async function handleExplanationRequest(text) {
  // Load API settings from storage each time (service workers don't maintain state)
  const result = await chrome.storage.sync.get(['openaiApiKey', 'groqApiKey', 'selectedApi']);

  // ========== DETERMINE WHICH API TO USE ==========
  const selectedApi = result.selectedApi || 'openai'; // Default to OpenAI
  const apiKey = selectedApi === 'groq' ? result.groqApiKey : result.openaiApiKey;

  // Debug logging
  console.log('[LearnFlow] Selected API:', selectedApi);
  console.log('[LearnFlow] API Key exists:', !!apiKey);

  if (!apiKey) {
    const apiName = selectedApi === 'groq' ? 'Groq' : 'OpenAI';
    throw new Error(`${apiName} API key not set. Please configure it in the extension settings.`);
  }

  const prompt = `You are a computer science tutor helping students learn technical concepts.

A student has highlighted the following term: "${text}"

Please provide a comprehensive explanation in the following JSON format:
{
  "term": "the term or concept",
  "definition": "clear, concise definition (2-3 sentences). Use markdown code formatting for any code: inline code with \`code\` and code blocks with \`\`\`language\\ncode\\n\`\`\`",
  "examples": ["example 1 with code examples using markdown format", "example 2", "example 3"],
  "quizQuestion": "a multiple choice question to test understanding",
  "quizOptions": ["option 1", "option 2", "option 3", "option 4"],
  "quizAnswer": 0 (index of correct answer, 0-3)
}

IMPORTANT: When including code examples, use markdown code blocks like this:
- Inline code: \`variableName\`
- Code blocks: \`\`\`python\\ncode here\\n\`\`\`

Focus on technical interview and computer science concepts. Make explanations clear and beginner-friendly.`;

  // ========== CONFIGURE API ENDPOINT AND MODEL ==========
  // This is where we switch between Groq and OpenAI based on user selection
  const apiConfig = selectedApi === 'groq'
    ? {
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',  // Groq: Latest free model
        provider: 'Groq'
      }
    : {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',  // OpenAI: Paid model
        provider: 'OpenAI'
      };

  console.log(`[LearnFlow] Using ${apiConfig.provider} API`);
  console.log('[LearnFlow] Endpoint:', apiConfig.endpoint);
  console.log('[LearnFlow] Model:', apiConfig.model);

  try {
    // ========== MAKE API CALL ==========
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiConfig.model,
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
    const apiName = selectedApi === 'groq' ? 'Groq' : 'OpenAI';
    console.error(`[LearnFlow] Error calling ${apiName} API:`, error);
    console.error('[LearnFlow] API Config:', apiConfig);
    console.error('[LearnFlow] Full error details:', error.message);

    // Return a fallback explanation with specific error info
    return {
      term: text,
      definition: `Error: API request failed. Check console for details. Selected API: ${apiName}. Error: ${error.message}`,
      examples: [
        `Error 1: ${apiName} API call failed`,
        `Error 2: Check service worker console for details`,
        `Error 3: Verify your ${apiName} API key is correct`,
      ],
      quizQuestion: `Is your ${apiName} API key configured correctly?`,
      quizOptions: ['Yes', 'No', 'Not sure', 'Need to check'],
      quizAnswer: 0,
    };
  }
}

// ============================================================================
// CHAT MESSAGE HANDLER
// ============================================================================

async function handleChatMessage(question, context) {
  // Load API settings from storage
  const result = await chrome.storage.sync.get(['openaiApiKey', 'groqApiKey', 'selectedApi']);

  // ========== DETERMINE WHICH API TO USE ==========
  const selectedApi = result.selectedApi || 'openai';
  const apiKey = selectedApi === 'groq' ? result.groqApiKey : result.openaiApiKey;

  if (!apiKey) {
    const apiName = selectedApi === 'groq' ? 'Groq' : 'OpenAI';
    throw new Error(`${apiName} API key not set. Please configure it in the extension settings.`);
  }

  // ========== CONFIGURE API ENDPOINT AND MODEL ==========
  // This is where we switch between Groq and OpenAI based on user selection
  const apiConfig = selectedApi === 'groq'
    ? {
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',  // Groq: Latest free model
        provider: 'Groq'
      }
    : {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',  // OpenAI: Paid model
        provider: 'OpenAI'
      };

  try {
    // ========== MAKE API CALL ==========
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          {
            role: 'system',
            content: `You are a helpful computer science tutor. The user is learning about "${context}". Answer their follow-up questions clearly and concisely. Use markdown formatting for code: inline code with \`code\` and code blocks with \`\`\`language\\ncode\\n\`\`\`.`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return answer;
  } catch (error) {
    console.error(`Error calling ${apiConfig.provider} API for chat:`, error);
    throw error;
  }
}

// Context menu feature removed for stability
// You can use the popup or content script indicator instead
