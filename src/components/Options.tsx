import React, { useState, useEffect } from 'react';

const Options: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<'openai' | 'groq'>('openai');
  const [openaiKey, setOpenaiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [savedOpenaiKey, setSavedOpenaiKey] = useState('');
  const [savedGroqKey, setSavedGroqKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);

  useEffect(() => {
    // Load existing settings on mount
    chrome.storage.sync.get(['openaiApiKey', 'groqApiKey', 'selectedApi'], (result) => {
      if (result.openaiApiKey) {
        setSavedOpenaiKey(result.openaiApiKey);
        setOpenaiKey(result.openaiApiKey);
      }
      if (result.groqApiKey) {
        setSavedGroqKey(result.groqApiKey);
        setGroqKey(result.groqApiKey);
      }
      if (result.selectedApi) {
        setSelectedApi(result.selectedApi);
      }
    });
  }, []);

  const handleSave = async () => {
    const currentKey = selectedApi === 'openai' ? openaiKey : groqKey;

    if (!currentKey.trim()) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');

    // Save to Chrome storage
    const storageData: any = {
      selectedApi: selectedApi
    };

    if (selectedApi === 'openai') {
      storageData.openaiApiKey = openaiKey;
    } else {
      storageData.groqApiKey = groqKey;
    }

    chrome.storage.sync.set(storageData, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving settings:', chrome.runtime.lastError);
        setSaveStatus('error');
      } else {
        if (selectedApi === 'openai') {
          setSavedOpenaiKey(openaiKey);
        } else {
          setSavedGroqKey(groqKey);
        }
        setSaveStatus('saved');

        // Reset status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    });
  };

  const handleClear = () => {
    if (selectedApi === 'openai') {
      setOpenaiKey('');
      setSavedOpenaiKey('');
      chrome.storage.sync.remove('openaiApiKey');
    } else {
      setGroqKey('');
      setSavedGroqKey('');
      chrome.storage.sync.remove('groqApiKey');
    }
    setSaveStatus('idle');
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 7) + '•'.repeat(key.length - 11) + key.substring(key.length - 4);
  };

  const currentKey = selectedApi === 'openai' ? openaiKey : groqKey;
  const savedKey = selectedApi === 'openai' ? savedOpenaiKey : savedGroqKey;
  const currentShowKey = selectedApi === 'openai' ? showOpenaiKey : showGroqKey;
  const setCurrentShowKey = selectedApi === 'openai' ? setShowOpenaiKey : setShowGroqKey;
  const setCurrentKey = selectedApi === 'openai' ? setOpenaiKey : setGroqKey;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AI Study Tool Settings
            </h1>
            <p className="text-gray-600">
              Configure your AI API provider and key to enable AI-powered explanations
            </p>
          </div>

          {/* API Provider Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose AI Provider
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedApi('openai')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedApi === 'openai'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">OpenAI</div>
                <div className="text-xs text-gray-600 mt-1">GPT-3.5 Turbo</div>
                <div className="text-xs text-gray-500 mt-1">Best quality, paid</div>
              </button>

              <button
                onClick={() => setSelectedApi('groq')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedApi === 'groq'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">Groq</div>
                <div className="text-xs text-gray-600 mt-1">Llama 3.1</div>
                <div className="text-xs text-green-600 mt-1">✨ FREE & Fast</div>
              </button>
            </div>
          </div>

          {/* Current Status */}
          {savedKey && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">
                    {selectedApi === 'openai' ? 'OpenAI' : 'Groq'} API Key Configured
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Current key: {maskApiKey(savedKey)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* API Key Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {selectedApi === 'openai' ? 'OpenAI' : 'Groq'} API Key
              </label>
              <div className="relative">
                <input
                  type={currentShowKey ? 'text' : 'password'}
                  id="apiKey"
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                  placeholder={selectedApi === 'openai' ? 'sk-...' : 'gsk_...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setCurrentShowKey(!currentShowKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {currentShowKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your API key is stored locally and encrypted by Chrome
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || !currentKey.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved!' : 'Save API Key'}
              </button>

              {savedKey && (
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-700 font-semibold rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {saveStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  Error saving API key. Please try again.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              How to get your {selectedApi === 'openai' ? 'OpenAI' : 'Groq'} API key
            </h2>

            {selectedApi === 'openai' ? (
              <>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      1
                    </span>
                    <span>
                      Visit{' '}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        platform.openai.com/api-keys
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      2
                    </span>
                    <span>Sign in or create an OpenAI account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      3
                    </span>
                    <span>Click "Create new secret key"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      4
                    </span>
                    <span>Copy the key (starts with "sk-") and paste it above</span>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> OpenAI API incurs costs (~$0.001-0.003 per explanation). New accounts get $5 free credit.
                  </p>
                </div>
              </>
            ) : (
              <>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      1
                    </span>
                    <span>
                      Visit{' '}
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        console.groq.com/keys
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      2
                    </span>
                    <span>Sign in with Google or create a Groq account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      3
                    </span>
                    <span>Click "Create API Key"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      4
                    </span>
                    <span>Copy the key (starts with "gsk_") and paste it above</span>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>✨ FREE!</strong> Groq offers free API access with rate limits (~30 requests/minute). Perfect for learning!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>AI Interview Study Tool v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Options;
