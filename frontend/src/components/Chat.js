import React from 'react';
import './chatbot.css';
import { useState, useEffect, useRef } from 'react';
import { BiHome, BiBookAlt, BiMessage } from 'react-icons/bi';
import { VscLightbulbSparkle } from 'react-icons/vsc';
import { BsPersonCircle } from 'react-icons/bs';
import { BiSolidCommentAdd } from 'react-icons/bi';
import Navbar from './Navbar';

function Chat() {

	const [topic, setTopic] = useState('');
	const [showTopicInput, setShowTopicInput] = useState(true);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [chatHistory, setChatHistory] = useState([]);
	// const [activeMenu, setActiveMenu] = useState('chat');
	const messagesEndRef = useRef(null);

	// Auto scroll to bottom of chat
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Handle topic submission
	const handleTopicSubmit = (e) => {
		e.preventDefault();
		if (topic.trim()) {
			setShowTopicInput(false);
			setMessages([
				{
					id: 1,
					text: `Hello! I'm ready to talk with you about "${topic}". Do you have anything you'd like to ask?`,
					sender: 'ai',
					timestamp: new Date().toLocaleTimeString()
				}
			]);

			// Add to chat history
			const newHistory = {
				id: Date.now(),
				topic: topic,
				date: new Date().toLocaleDateString(),
				time: new Date().toLocaleTimeString()
			};
			setChatHistory(prev => [newHistory, ...prev]);
		}
	};

	// Handle message submission
	const handleMessageSubmit = (e) => {
		e.preventDefault();
		if (inputMessage.trim()) {
			const userMessage = {
				id: Date.now(),
				text: inputMessage,
				sender: 'user',
				timestamp: new Date().toLocaleTimeString()
			};

			setMessages(prev => [...prev, userMessage]);

			// Simulate AI response
			setTimeout(() => {
				const aiResponse = {
					id: Date.now() + 1,
					text: `Here is the answer related to: ${inputMessage}`,
					sender: 'ai',
					timestamp: new Date().toLocaleTimeString()
				};
				setMessages(prev => [...prev, aiResponse]);
			}, 1000);

			setInputMessage('');
		}
	};

	// Start new chat
	const startNewChat = () => {
		setTopic('');
		setShowTopicInput(true);
		setMessages([]);
		setInputMessage('');
	};

	// Navigation items
	// const navItems = [
	// 	{ id: 'home', icon: <BiHome />, label: 'Home', href: '#home' },
	// 	{ id: 'chat', icon: <BiMessage />, label: 'AI ChatBot', href: '#chat' },
	// 	{ id: 'quiz', icon: <VscLightbulbSparkle />, label: 'Quiz', href: '#quiz' },
	// 	{ id: 'profile', icon: <BsPersonCircle />, label: 'Profile', href: '#profile' },
	// ];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Demo Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            {msg.role === "user" ? (
              <div style={{ textAlign: "right", background: "#DCF8C6", display: "inline-block", padding: "0.5rem 1rem", borderRadius: "10px" }}>
                {msg.text}
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                {msg.parsed.title && <h4>{msg.parsed.title}</h4>}
                {msg.parsed.summary && <p><strong>Summary:</strong> {msg.parsed.summary}</p>}
                {msg.parsed.keyPoints && (
                  <div>
                    <strong>Key points:</strong>
                    <ul>
                      {msg.parsed.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                    </ul>
                  </div>
                )}
                {msg.parsed.shortExplanation && <p><strong>Short explanation:</strong> {msg.parsed.shortExplanation}</p>}
                {msg.parsed.analogy && <p><strong>Analogy/Example:</strong> {msg.parsed.analogy}</p>}
                {msg.parsed.followUp && <p><strong>Follow-up:</strong> {msg.parsed.followUp}</p>}
                {msg.parsed.references && (
                  <div>
                    <strong>References:</strong>
                    <ul>
                      {msg.parsed.references.map((ref, idx) => <li key={idx}>{ref}</li>)}
                    </ul>
                  </div>
                )}
                {!msg.parsed.title && !msg.parsed.summary && <p>{msg.parsed.raw}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={{ padding: "0.5rem 1rem" }}>Send</button>
      </div>
    </div>
  );
}
