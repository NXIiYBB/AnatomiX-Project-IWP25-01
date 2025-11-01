import React from 'react';
import './chatbot.css';
import { useState, useEffect, useRef } from 'react';
import Navbar from './navbar';
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import Loading from "./loading";

function Chat({uid}) {
	const [topic, setTopic] = useState('');
	const [showTopicInput, setShowTopicInput] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [chatHistory, setChatHistory] = useState([]);
	// const [activeMenu, setActiveMenu] = useState('chat');
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const messagesEndRef = useRef(null);
	const [message, setMessage] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();
	const [showChat, setShowChat] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		const { id } = location.state || {};
		if (id) {
		setSelectedConversationId(id);
		}
	}, [location.state]); 

  	useEffect(() => {
		// console.log(uid);
		if (!uid) return;

		setLoading(true);
		const fetchConversations = async () => {
		try {
			const res = await fetch(
			`http://localhost:5001/anatomix-c8c63/us-central1/api/chat/historyList`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({uid}),
		});
		//   console.log(uid);
			const data = await res.json();
			setChatHistory(data.res);
			console.log(data); // data.res ต้องมี id + title
			setSelectedConversationId(data.res[0].id);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching conversations:", err);
		}
		};

		fetchConversations();
	}, [uid]);

	// ดึง messages เมื่อเลือก conversation
	useEffect(() => {
		if (!selectedConversationId) return;

		const fetchMessages = async () => {
			try {
				const res = await fetch(
					`http://localhost:5001/anatomix-c8c63/us-central1/api/chat/history?uid=${uid}&conversationId=${selectedConversationId}`
				);
				const data = await res.json();
				setMessages(data.res); // สมมติ API return array of {role, text, createdAt}
			} catch (err) {
				console.error("Error fetching messages:", err);
			}
		};

		fetchMessages();
	}, [selectedConversationId, uid]);

	// Auto scroll to bottom of chat
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Handle topic submission
	const handleTopicSubmit = async (e) => {
		e.preventDefault();
		if (!topic.trim()) return;

		try {
			const res = await fetch("http://localhost:5001/anatomix-c8c63/us-central1/api/chat/newConversation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uid,            // user id ปัจจุบัน
					title: topic // ชื่อหัวข้อ (topic)
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to create conversation");
			}

			const data = await res.json();
			setMessages([
				{
					id: 123456,
					text: `Hello! I'm ready to talk with you about "${topic}". Do you have anything you'd like to ask?`,
					role: 'model',
					timestamp: new Date().toLocaleTimeString()
				}
			]);

			// สมมติ backend ส่งกลับ { conversationId, title, createdAt, updatedAt }
			const newConversation = {
				id: data.conversationId,
				title: data.title,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			};

			// อัปเดต state ให้แสดงหัวข้อใหม่ใน history
			setChatHistory((prev) => [newConversation, ...prev]);

			// เซ็ต topic และ conversationId ปัจจุบัน
			setTopic(newConversation.title);
			setSelectedConversationId(newConversation.id);

			// ปิด modal
			setShowTopicInput(false);

		} catch (err) {
			console.error("Error creating conversation:", err);
		}
	};

	// Handle message submission
	const handleMessageSubmit = async (e) => {
		e.preventDefault();

		if (!inputMessage.trim()) return; // กัน empty message
		const userMessage = inputMessage; // เก็บค่าปัจจุบัน
		setInputMessage("");

		// แสดงข้อความผู้ใช้ในหน้าจอทันที
		setMessages((prev) => [...prev, { text: userMessage, role: "user" }]);
		setIsTyping(true);
		try {
			const response = await fetch(
				"http://localhost:5001/anatomix-c8c63/us-central1/api/chat",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						uid,
						conversationId: selectedConversationId,
						text: userMessage,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("❌ Failed to send message");
			}

			const data = await response.json();

			// สมมติ response เป็น { res: message }
			console.log(data.response);
			setIsTyping(false);
			setMessages((prev) => [...prev, data.response]);

			// clear input
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	// Start new chat
	const startNewChat = () => {
		setTopic('');
		// setShowTopicInput(true);
		setMessages([]);
		setInputMessage('');
		setShowTopicInput(true);

	};

	const handleCreateQuiz = async (e, conversationId) => {
		e.preventDefault();
		setLoading(true);
		const convoRef = collection(db, `users/${uid}/conversations/${conversationId}/messages`);
		const snap = await getDocs(convoRef);
		const content = snap.docs.map(d => d.data().text).join(" ");

		const convoDoc = await getDoc(doc(db, `users/${uid}/conversations/${conversationId}`));
		const title = convoDoc.data()?.title || "Untitled Conversation";

		const response = await fetch("http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/fromConversation", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ uid, conversationId, title, content }),
		});

		const data = await response.json();
		console.log("✅ Created quiz:", data);
		// navigate(`/quiz/${data.quizId}`);
		setLoading(false);
		navigate("/quiz", { state: { title: title, quizId: data.quizId, questions: data.questions } });
	};

	// Navigation items
	// const navItems = [
	// 	{ id: 'home', icon: <BiHome />, label: 'Home', href: '#home' },
	// 	{ id: 'chat', icon: <BiMessage />, label: 'AI ChatBot', href: '#chat' },
	// 	{ id: 'quiz', icon: <VscLightbulbSparkle />, label: 'Quiz', href: '#quiz' },
	// 	{ id: 'profile', icon: <BsPersonCircle />, label: 'Profile', href: '#profile' },
	// ];

	if (loading) {
        return (
            <div className="chatbot-container">
            <Navbar /> 
            <Loading />
            </div>
    )};

	return (
		<div className="chatbot-container">
      <div className={`main-layout ${showChat ? "show-chat" : ""}`}>

        {/* Navigation */}
        <Navbar />

        {/* Chat Area */}
        <div className="chat-area">
          <div className="topic-display">
            {(showChat && window.innerWidth < 768) && (
              <button className="back-btn" onClick={() => setShowChat(false)}>←</button>
            )}
            <h3>{
              chatHistory.find((chat) => chat.id === selectedConversationId)?.title
              || "Select Topic"
            }</h3>
          </div>

          {!showTopicInput && (
            <>
              <div className="messages-container">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-content">
                      <p><ReactMarkdown>{message.text}</ReactMarkdown></p>
                    </div>
                  </div>
                ))}

				{isTyping && (
					<div className="message ai typing">
						<div className="message-content">
						<div className="dots">
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
						</div>
						</div>
					</div>
					)}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleMessageSubmit} className="message-form">
                <div className="input-container">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a new message here"
                    className="message-input"
                  />
                  <div className='button-group'>
                    <button type="submit" className="send-btn">Send</button>
                    <button type='button' className='quiz-btn' onClick={(e) => handleCreateQuiz(e, selectedConversationId)}>Generate Quiz</button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-header">
            <h3>Chat history</h3>
            <button className="new-chat-btn" onClick={startNewChat}>
              <span>🗯️</span> Create New Topic
            </button>
          </div>
          <div className="history-list">
            {chatHistory.length === 0 ? (
              <div className="empty-history"><p>No chat history.</p></div>
            ) : (
              chatHistory.map((conv) => (
                <div
                  key={conv.id}
                  className={"history-item"}
                  onClick={() => {
                    setSelectedConversationId(conv.id);
                    setTopic(conv.title);
                    setShowChat(true);
                  }}
                >
                  <div className="history-topic">
                    <h4>{conv.title}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Topic Input Modal */}
        {showTopicInput && (
          <div className="topic-modal">
            <div className="topic-modal-content">
              <button className="close-btn" onClick={() => setShowTopicInput(false)}>×</button>
              <h2>Start Learning!</h2>
              <p>What would you like to ask or talk about?</p>
              <form onSubmit={handleTopicSubmit}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="topic-input"
                  autoFocus
                />
                <button type="submit" className="topic-submit-btn">Start</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
	);
};

export default Chat;
