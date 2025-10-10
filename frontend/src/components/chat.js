import React from 'react';
import './chatbot.css';
import { useState, useEffect, useRef } from 'react';
import { BiHome, BiBookAlt, BiMessage } from 'react-icons/bi';
// import { VscLightbulbSparkle } from 'react-icons/vsc';
import { BsPersonCircle } from 'react-icons/bs';
import { BiSolidCommentAdd } from 'react-icons/bi';
import Navbar from './navbar';
import { auth } from "../firebase";

function Chat() {
	const [topic, setTopic] = useState('');
	const [showTopicInput, setShowTopicInput] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [chatHistory, setChatHistory] = useState([]);
	// const [activeMenu, setActiveMenu] = useState('chat');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
	const messagesEndRef = useRef(null);
  const [message, setMessage] = useState([]);

  const uid = auth.currentUser?.uid;

  // ดึง conversation list
  useEffect(() => {
    if (!uid) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/anatomix-c8c63/us-central1/api/chat/historyList?uid=${uid}`
        );
        const data = await res.json();
        setChatHistory(data.res); // data.res ต้องมี id + title
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
	const handleTopicSubmit = async(e) => {
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
      setMessages((prev) => [...prev, data.response]);

      // clear input
    } catch (error) {
      console.error("Error sending message:", error);
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

				{/* Navigation */}
				<Navbar />

				{/* Center Chat Area */}
				<div className="chat-area">
					{/* <div className="header-title">
						<h1>AI ChatBot</h1>
					</div> */}


					{/* Topic Display */}
					<div className="topic-display">
						<h3>{
              chatHistory.find((chat) => chat.id === selectedConversationId)?.title 
              || "เลือกบทสนทนา"
            }</h3>
					</div>
					

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
									<div key={message.id} className={`message ${message.role}`}>
										<div className="message-content">
											<p>{message.text}</p>
											{/* <span className="timestamp">{message.timestamp}</span> */}
										</div>
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
							chatHistory.map((conv) => (
								<div 
                key={conv.id}
                className={"history-item"}
                onClick={() => setSelectedConversationId(conv.id)}
                >
									<div className="history-topic" onClick={() => setTopic(conv.title)}>
										<h4>{conv.title}</h4>
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
