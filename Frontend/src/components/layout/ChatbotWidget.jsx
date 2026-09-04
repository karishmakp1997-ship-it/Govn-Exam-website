import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import './ChatbotWidget.css';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChatLog((prev) => [
      ...prev,
      { from: 'user', text: userMessage }
    ]);

    setMessage('');

    try {
      const res = await axiosClient.post('/api/ai-coach/chat/', {
        message: userMessage
      });

      setChatLog((prev) => [
        ...prev,
        { from: 'bot', text: res.data.reply }
      ]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, something went wrong. Please try again.'
        }
      ]);
    }
  };

  return (
    <div className="vetri-chatbot">

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="vetri-chat-window">

          {/* Header */}
          <div className="vetri-chat-header">
            <div className="vetri-chat-header-left">
              <div className="vetri-mini-robot">
                <img src="/images/robo.png" alt="Vetri AI" />
              </div>

              <div>
                <div className="vetri-chat-title">
                  Ask Vetri AI
                </div>

                <div className="vetri-chat-status">
                  <span></span>
                  AI Coach is online
                </div>
              </div>
            </div>

            <button
              className="vetri-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="vetri-chat-messages">

            {chatLog.length === 0 && (
              <div className="vetri-welcome">
                <div className="vetri-welcome-robot">
                  <img src="/images/robot.png" alt="Vetri AI" />
                </div>

                <h3>Hi! I'm Vetri AI 👋</h3>

                <p>
                  Ask me anything about your exam preparation,
                  subjects, study plans, or doubts.
                </p>

                <div className="vetri-suggestions">
                  <button
                    onClick={() =>
                      setMessage('Create a study plan for me')
                    }
                  >
                    📚 Create a study plan
                  </button>

                  <button
                    onClick={() =>
                      setMessage('Help me with my exam preparation')
                    }
                  >
                    🎯 Exam preparation
                  </button>
                </div>
              </div>
            )}

            {chatLog.map((entry, i) => (
              <div
                key={i}
                className={`vetri-message-row ${
                  entry.from === 'user'
                    ? 'user-message'
                    : 'bot-message'
                }`}
              >
                {entry.from === 'bot' && (
                  <div className="vetri-message-avatar">
                    <img src="/images/robot.png" alt="AI" />
                  </div>
                )}

                <div className="vetri-message-bubble">
                  {entry.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="vetri-chat-input-area">
            <div className="vetri-input-wrapper">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Ask a question..."
              />

              <button
                onClick={sendMessage}
                className="vetri-send-btn"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <div className="vetri-powered">
              Powered by Vetri AI
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ROBOT */}
      <button
        className={`vetri-robot-launcher ${
          isOpen ? 'chat-open' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Vetri AI"
      >
        <div className="vetri-robot-glow"></div>

        <div className="vetri-robot-image">
          <img
            src="/images/robot.png"
            alt="Ask Vetri AI"
          />
        </div>

        {!isOpen && (
          <div className="vetri-ai-label">
            <span>Ask Vetri AI</span>
          </div>
        )}
      </button>

    </div>
  );
}

export default ChatbotWidget;