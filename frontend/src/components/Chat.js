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
		<div className="chatbot-container">
			<div className="main-layout">

				{/* Left Navigation */}
				<Navbar />
				{/* <div className="menu">
					<div className='logo'>
						<BiBookAlt className="logo-icon" />
						<h2>AnatomiX</h2>
              </div>

					<nav className="menu-container">
						<ul className="menu--list">
							<li>
								<a href="/home" className="item"><BiHome className="icon" />Home</a>
							</li>
							<li>
								<a href="/chatbot" className="item"><BiMessage className="icon" />ChatBot</a>
							</li>
							<li>
								<a href="/quiz" className="item"><VscLightbulbSparkle className="icon" />Quiz</a>
							</li>
							<li>
								<a href="/profile" className="item"><BsPersonCircle className="icon" />Profile</a>
							</li>
                    </ul>
					</nav>
				</div> */}

				{/* Center Chat Area */}
				<div className="chat-area">
					{/* <div className="header-title">
						<h1>AI ChatBot</h1>
					</div> */}


					{/* Topic Display */}
					{topic && !showTopicInput && (
						<div className="topic-display">
							<h3>{topic}</h3>
                  </div>
                )}

					{/* Topic Input Modal */}
					{showTopicInput && (
						<div className="topic-modal">
							<div className="topic-modal-content">
								<h2>Start Learning!</h2>
								<p>What would you like to ask or talk about?</p>
								<form onSubmit={handleTopicSubmit}>
									<input
										type="text"
										value={topic}
										onChange={(e) => setTopic(e.target.value)}
										// placeholder="เช่น การทำอาหาร, เทคโนโลยี, การศึกษา..."
										className="topic-input"
										autoFocus
									/>
									<button type="submit" className="topic-submit-btn">
										Start
									</button>
								</form>
							</div>
                  </div>
                )}

					{/* Chat Messages */}
					{!showTopicInput && (
						<>
							<div className="messages-container">
								{messages.map(message => (
									<div key={message.id} className={`message ${message.sender}`}>
										<div className="message-content">
											<p>{message.text}</p>
											<span className="timestamp">{message.timestamp}</span>
              </div>
            )&rbrace;
          </div>
        ))}
								<div ref={messagesEndRef} />
      </div>

							{/* Message Input */}
							<form onSubmit={handleMessageSubmit} className="message-form">
								<div className="input-container">
        <input
          type="text"
										value={inputMessage}
										onChange={(e) => setInputMessage(e.target.value)}
										placeholder="Type a new message here"
										className="message-input"
									/>
									<button type="submit" className="send-btn">Send</button>
								</div>
							</form>
						</>
					)}
				</div>

				{/* Right History Sidebar */}
				<div className="right-sidebar">
					<div className="sidebar-header">
						<h3>Chat history</h3>
						<button className="new-chat-btn" onClick={startNewChat}>
							<span><BiSolidCommentAdd /></span> Create New Topic</button>
					</div>
					<div className="history-list">
						{chatHistory.length === 0 ? (
							<div className="empty-history">
								<p>No chat history.</p>
							</div>
						) : (
							chatHistory.map(history => (
								<div key={history.id} className="history-item">
									<div className="history-topic">
										<h4>{history.topic}</h4>
									</div>
									<div className="history-meta">
										<span className="history-date">{history.date}</span>
										<span className="history-time">{history.time}</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
      </div>
    </div>
  );
	// return (
	//   <div className="chatbot">
	//     <Sidebar />
	//     <div className="chatbot--content">
	//       <ChatContent />
	//       <HistoryTopic />
	//     </div>
	//   </div>

	// );
};

export default Chat;
