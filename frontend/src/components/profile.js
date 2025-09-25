import React, { useState, useEffect } from 'react';
import './profile.css';
import { BsPersonSquare } from 'react-icons/bs';
import { AiFillEdit, AiFillMessage, AiTwotoneStar } from 'react-icons/ai';
import { LuLogOut } from 'react-icons/lu';
import { GiNotebook } from 'react-icons/gi';
import { BsRobot, BsCalendar2CheckFill } from 'react-icons/bs';
import Navbar from './navbar';

function Profile() {
    const [user, setUser] = useState({
        id: 1,
        username: 'John Doe',
        email: 'john.doe@example.com',
        avatar: <BsPersonSquare />,
        joinDate: '2024-01-15',
        totalChats: 24,
        totalQuizzes: 12,
        averageScore: 85
    });

    const [recentTopics, setRecentTopics] = useState([
        {
            id: 1,
            topic: 'การเขียนโปรแกรม JavaScript',
            date: '2024-01-20',
            time: '14:30',
            messageCount: 15,
            type: 'chat'
        },
        {
            id: 2,
            topic: 'เทคโนโลยี AI และ Machine Learning',
            date: '2024-01-19',
            time: '10:15',
            messageCount: 8,
            type: 'chat'
        },
        {
            id: 3,
            topic: 'การออกแบบ UI/UX',
            date: '2024-01-18',
            time: '16:45',
            messageCount: 22,
            type: 'chat'
        }
    ]);

    const [quizHistory, setQuizHistory] = useState([
        {
            id: 1,
            title: 'JavaScript Fundamentals',
            score: 90,
            totalQuestions: 10,
            system: 'AI Quiz Bot',
            date: '2024-01-20',
            time: '15:30',
            questions: [
                {
                    id: 1,
                    question: 'What is the difference between let and var in JavaScript?',
                    userAnswer: 'let has block scope while var has function scope',
                    correctAnswer: 'let has block scope while var has function scope',
                    isCorrect: true,
                    explanation: 'let และ const มี block scope ในขณะที่ var มี function scope ทำให้ let และ const ปลอดภัยกว่าในการใช้งาน'
                },
                {
                    id: 2,
                    question: 'What is closure in JavaScript?',
                    userAnswer: 'Function inside function',
                    correctAnswer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned',
                    isCorrect: false,
                    explanation: 'Closure คือการที่ function สามารถเข้าถึงตัวแปรใน scope ภายนอกได้ แม้ว่า function ภายนอกจะ execute เสร็จแล้ว'
                }
            ]
        },
        {
            id: 2,
            title: 'React Hooks',
            score: 85,
            totalQuestions: 8,
            system: 'AI Quiz Bot',
            date: '2024-01-19',
            time: '11:20',
            questions: [
                {
                    id: 1,
                    question: 'What is the purpose of useEffect hook?',
                    userAnswer: 'To perform side effects',
                    correctAnswer: 'To perform side effects in functional components',
                    isCorrect: true,
                    explanation: 'useEffect ใช้สำหรับจัดการ side effects เช่น API calls, subscriptions, หรือการอัพเดท DOM'
                }
            ]
        },
        {
            id: 3,
            title: 'CSS Grid Layout',
            score: 75,
            totalQuestions: 12,
            system: 'AI Quiz Bot',
            date: '2024-01-18',
            time: '09:45',
            questions: []
        }
    ]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [editForm, setEditForm] = useState({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
    });

    const handleEditProfile = () => {
        setEditForm({
            username: user.username,
            email: user.email,
            password: '',
            confirmPassword: ''
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();

        if (editForm.password && editForm.password !== editForm.confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setUser(prev => ({
            ...prev,
            username: editForm.username,
            email: editForm.email
        }));

        setShowEditModal(false);
        alert('อัพเดทข้อมูลสำเร็จ');
    };

    const handleViewQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setShowQuizModal(true);
    };

    const handleLogout = () => {
        if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
            // Clear user data
            localStorage.removeItem('userToken');
            // Redirect to login page
            window.location.href = '/login';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        return '#e74c3c';
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <div className="user-info">
                        <div className="avatar-section">
                            <div className="avatar">{user.avatar}</div>
                            <button className="edit-avatar-btn">📷</button>
                        </div>
                        <div className="user-details">
                            <h1>{user.username}</h1>
                            <p className="email">{user.email}</p>
                            {/* <p className="join-date">เข้าร่วมเมื่อ: {new Date(user.joinDate).toLocaleDateString('th-TH')}</p> */}
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="edit-btn" onClick={handleEditProfile}>
                            <AiFillEdit /> Edit Information
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            <LuLogOut /> Log out
                        </button>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="activity-summary">
                    <h2>Activity Summary</h2>
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="card-icon"><AiFillMessage /></div>
                            <div className="card-content">
                                <h3>{user.totalChats}</h3>
                                <p>All Chat</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon"><GiNotebook /></div>
                            <div className="card-content">
                                <h3>{user.totalQuizzes}</h3>
                                <p>Quizzes Taken</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon"><AiTwotoneStar /></div>
                            <div className="card-content">
                                <h3>{user.averageScore}%</h3>
                                <p>Average Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-sections">
                    {/* Recent Topics */}
                    <div className="section">
                        <h2>Latest Topic</h2>
                        <div className="topics-list">
                            {recentTopics.map(topic => (
                                <div key={topic.id} className="topic-item">
                                    <div className="topic-icon"><AiFillMessage /></div>
                                    <div className="topic-content">
                                        <h4>{topic.topic}</h4>
                                        <div className="topic-meta">
                                            <span>{topic.messageCount} ข้อความ</span>
                                            <span>{topic.date} {topic.time}</span>
                                        </div>
                                    </div>
                                    <button className="view-btn">ดู</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quiz History */}
                    <div className="section">
                        <h2>Quiz History</h2>
                        <div className="quiz-history">
                            {quizHistory.map(quiz => (
                                <div key={quiz.id} className="quiz-item">
                                    <div className="quiz-score" style={{ backgroundColor: getScoreColor(quiz.score) }}>
                                        {quiz.score}%
                                    </div>
                                    <div className="quiz-content">
                                        <h4>{quiz.title}</h4>
                                        <div className="quiz-meta">
                                            <span><BsCalendar2CheckFill /> {quiz.score}/{quiz.totalQuestions * 10} คะแนน</span>
                                            <span><BsRobot /> {quiz.system}</span>
                                            <span><BsCalendar2CheckFill /> {quiz.date} {quiz.time}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="view-quiz-btn"
                                        onClick={() => handleViewQuiz(quiz)}
                                    >
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>แก้ไขข้อมูลส่วนตัว</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>ชื่อผู้ใช้</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>อีเมล</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>รหัสผ่านใหม่ (ไม่บังคับ)</label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="ใส่รหัสผ่านใหม่หากต้องการเปลี่ยน"
                                />
                            </div>
                            {editForm.password && (
                                <div className="form-group">
                                    <label>ยืนยันรหัสผ่าน</label>
                                    <input
                                        type="password"
                                        value={editForm.confirmPassword}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="ยืนยันรหัสผ่านใหม่"
                                        required
                                    />
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowEditModal(false)}>
                                    ยกเลิก
                                </button>
                                <button type="submit">บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quiz Detail Modal */}
            {showQuizModal && selectedQuiz && (
                <div className="modal-overlay">
                    <div className="modal quiz-modal">
                        <div className="modal-header">
                            <h3>{selectedQuiz.title}</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowQuizModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="quiz-summary">
                            <div className="quiz-stats">
                                <div className="stat">
                                    <span className="label">คะแนน:</span>
                                    <span className="value" style={{ color: getScoreColor(selectedQuiz.score) }}>
                                        {selectedQuiz.score}%
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="label">จำนวนข้อ:</span>
                                    <span className="value">{selectedQuiz.totalQuestions} ข้อ</span>
                                </div>
                                <div className="stat">
                                    <span className="label">ระบบ:</span>
                                    <span className="value">{selectedQuiz.system}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">วันที่:</span>
                                    <span className="value">{selectedQuiz.date} {selectedQuiz.time}</span>
                                </div>
                            </div>
                        </div>

                        {selectedQuiz.questions.length > 0 && (
                            <div className="quiz-questions">
                                <h4>รายละเอียดคำถาม</h4>
                                {selectedQuiz.questions.map((q, index) => (
                                    <div key={q.id} className={`question-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="question-header">
                                            <span className="question-number">ข้อ {index + 1}</span>
                                            <span className={`question-status ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                                {q.isCorrect ? '✓ ถูก' : '✗ ผิด'}
                                            </span>
                                        </div>
                                        <div className="question-content">
                                            <p className="question-text">{q.question}</p>
                                            <div className="answer-section">
                                                <div className="user-answer">
                                                    <strong>คำตอบของคุณ:</strong> {q.userAnswer}
                                                </div>
                                                {!q.isCorrect && (
                                                    <div className="correct-answer">
                                                        <strong>คำตอบที่ถูก:</strong> {q.correctAnswer}
                                                    </div>
                                                )}
                                                <div className="explanation">
                                                    <strong>คำอธิบาย:</strong> {q.explanation}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;