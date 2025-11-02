import React, { useState, useEffect } from 'react';

interface Explanation {
  term: string;
  definition: string;
  examples: string[];
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswer?: number;
}

const Popup: React.FC = () => {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);

  useEffect(() => {
    // Load saved topics and last explanation from storage
    chrome.storage.local.get(['savedTopics', 'lastExplanation', 'lastExplanationTime'], (result) => {
      if (result.savedTopics) {
        setSavedTopics(result.savedTopics);
      }

      // Load last explanation if it's recent (within last 5 minutes)
      if (result.lastExplanation && result.lastExplanationTime) {
        const timeSinceExplanation = Date.now() - result.lastExplanationTime;
        if (timeSinceExplanation < 5 * 60 * 1000) { // 5 minutes
          setExplanation(result.lastExplanation);
        }
      }
    });

    // Listen for messages from content script
    const messageListener = (message: any) => {
      if (message.type === 'EXPLANATION_GENERATED') {
        setExplanation(message.data);
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleGetExplanation = async () => {
    setLoading(true);

    // Get selected text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTED_TEXT' });
    }
  };

  const handleSaveTopic = () => {
    if (explanation && !savedTopics.includes(explanation.term)) {
      const updated = [...savedTopics, explanation.term];
      setSavedTopics(updated);
      chrome.storage.local.set({ savedTopics: updated });
    }
  };

  const handleQuizSubmit = () => {
    setShowResult(true);
  };

  return (
    <div className="w-96 h-[600px] bg-gray-50 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          AI Study Tool
        </h1>
        <p className="text-sm text-gray-600">
          Highlight any term on a webpage to get AI-powered explanations
        </p>
      </div>

      <button
        onClick={handleGetExplanation}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Loading...' : 'Explain Selected Text'}
      </button>

      {explanation && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800">{explanation.term}</h2>
            <button
              onClick={handleSaveTopic}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {savedTopics.includes(explanation.term) ? '✓ Saved' : 'Save'}
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Definition</h3>
            <p className="text-gray-600">{explanation.definition}</p>
          </div>

          {explanation.examples && explanation.examples.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Examples</h3>
              <ul className="list-disc list-inside space-y-1">
                {explanation.examples.map((example, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {explanation.quizQuestion && explanation.quizOptions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Quick Quiz</h3>
              <p className="text-gray-800 mb-3">{explanation.quizQuestion}</p>

              <div className="space-y-2">
                {explanation.quizOptions.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                      selectedAnswer === index
                        ? 'bg-blue-200'
                        : 'bg-white hover:bg-blue-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => {
                        setSelectedAnswer(index);
                        setShowResult(false);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>

              {!showResult && selectedAnswer !== null && (
                <button
                  onClick={handleQuizSubmit}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
                >
                  Submit Answer
                </button>
              )}

              {showResult && selectedAnswer !== null && (
                <div
                  className={`mt-3 p-3 rounded ${
                    selectedAnswer === explanation.quizAnswer
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedAnswer === explanation.quizAnswer
                    ? '✓ Correct! Well done!'
                    : `✗ Incorrect. The correct answer is: ${
                        explanation.quizOptions[explanation.quizAnswer!]
                      }`}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {savedTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Saved Topics</h3>
          <div className="flex flex-wrap gap-2">
            {savedTopics.map((topic, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
