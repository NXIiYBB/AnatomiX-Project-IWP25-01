import React, { useState, useEffect } from 'react';
import './profile.css';
import { BsPersonSquare } from 'react-icons/bs';
import { AiFillEdit, AiFillMessage, AiFillStar } from 'react-icons/ai';
import { LuLogOut } from 'react-icons/lu';
import { GiNotebook } from 'react-icons/gi';
import { BsGraphUp, BsRobot, BsCalendar2CheckFill } from 'react-icons/bs';
import Navbar from './navbar';
import Swal from 'sweetalert2';

const Profile = () => {


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

    // ตัวอย่างการแสดงข้อมูล การแชท หลังจากดึง api

    const [recentTopics, setRecentTopics] = useState([
        {
            id: 1,
            topic: 'Nervous System',
            date: '2024-01-20',
            time: '14:30',
            // messageCount: 15,
            type: 'chat'
        },
        {
            id: 2,
            topic: 'Respiratory System',
            date: '2024-01-19',
            time: '10:15',
            // messageCount: 8,
            type: 'chat'
        },
        {
            id: 3,
            topic: 'Muscular System',
            date: '2024-01-18',
            time: '16:45',
            // messageCount: 22,
            type: 'chat'
        }
    ]);

    const [quizHistory, setQuizHistory] = useState([
        {
            id: 1,
            title: 'Muscular Systems',
            score: 90,
            totalQuestions: 10,
            system: 'Quiz',
            date: '2024-01-20',
            time: '15:30',
            questions: [
                {
                    id: 1,
                    question: 'The stomach is a large muscular sack that breaks down food particles.  Which system is the stomach a part of?',
                    userAnswer: 'Digestive',
                    correctAnswer: 'Digestive',
                    isCorrect: true,
                    explanation: ' The digestive system is a collection of organs that work together to process and absorb nutrients from food, and the stomach plays a crucial role in this process by using its muscles to mechanically and chemically break down food. Therefore, the stomach is a part of the digestive system.'
                },
                {
                    id: 2,
                    question: 'Which type of muscle is involuntary and found in the walls of internal organs?',
                    userAnswer: 'Skeletal muscle',
                    correctAnswer: 'Smooth muscle',
                    explanation: 'Smooth muscles are involuntary muscles that control movements within internal organs such as the stomach, intestines, and blood vessels. They are not under conscious control.',
                }
            ]
        },
        {
            id: 2,
            title: 'Respiratory System',
            score: 75,
            totalQuestions: 8,
            system: 'Quiz',
            date: '2024-01-19',
            time: '11:20',
            questions: [
                {
                    id: 1,
                    question: 'What structure prevents food from entering the trachea when swallowing?',
                    userAnswer: 'Epiglottis',
                    correctAnswer: 'Epiglottis',
                    isCorrect: true,
                    explanation: 'The epiglottis acts as a flap that closes over the trachea during swallowing, preventing food and liquid from entering the airways.'
                }
            ]
        },
        // {
        //     id: 3,
        //     title: 'CSS Grid Layout',
        //     score: 75,
        //     totalQuestions: 12,
        //     system: 'AI Quiz Bot',
        //     date: '2024-01-18',
        //     time: '09:45',
        //     questions: []
        // }
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
            alert('Passwords do not match');
            return;
        }

        setUser(prev => ({
            ...prev,
            username: editForm.username,
            email: editForm.email
        }));

        setShowEditModal(false);
        alert('Update successful');
    };

    const handleViewQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setShowQuizModal(true);
    };

    const handleLogout = (e) => {
		e.preventDefault();
         Swal.fire({
                title: 'Are you sure?',
                text: "You will be logged out of your account.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Example: Redirect to logout URL
                    window.location.href = '/login'; 
                    // Or submit a logout form:
                    // document.getElementById('logoutForm').submit();
                }
            });
    }

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
                        <div className="user-details">
                            <h1>John Doe</h1>
                            <p className="email">john.doe@example.com</p>
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
                            <div className="card-icon chat-icon"><AiFillMessage /></div>
                            <div className="card-content">
                                <h3>24</h3>
                                <p>All Chat</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon quiz-icon"><GiNotebook /></div>
                            <div className="card-content">
                                <h3>12</h3>
                                <p>Quizzes Taken</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon score-icon"><AiFillStar /></div>
                            <div className="card-content">
                                <h3>85%</h3>
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
                                            {/* <span>{topic.messageCount} ข้อความ</span> */}
                                            <span>{topic.date} {topic.time}</span>
                                        </div>
                                    </div>
                                    <button className="view-btn">view</button>
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
                                            <span><BsGraphUp /> {quiz.score}/{quiz.totalQuestions * 10} scores</span>
                                            <span><BsRobot /> {quiz.system}</span>
                                            <span><BsCalendar2CheckFill /> {quiz.date} {quiz.time}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="view-quiz-btn"
                                        onClick={() => handleViewQuiz(quiz)}
                                    >
                                        Detail
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
                            <h3>Edit Information</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>User</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (Not Required)</label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter a new password if you want to change it."
                                />
                            </div>
                            {editForm.password && (
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={editForm.confirmPassword}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Confirm New Password"
                                        required
                                    />
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowEditModal(false)}>
                                    cancel
                                </button>
                                <button type="submit">Save</button>
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
                                    <span className="label">Point:</span>
                                    <span className="value" style={{ color: getScoreColor(selectedQuiz.score) }}>
                                        {selectedQuiz.score}%
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="label">Number of questions:</span>
                                    <span className="value">{selectedQuiz.totalQuestions} questions</span>
                                </div>
                                <div className="stat">
                                    <span className="label">System:</span>
                                    <span className="value">{selectedQuiz.system}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Date:</span>
                                    <span className="value">{selectedQuiz.date} {selectedQuiz.time}</span>
                                </div>
                            </div>
                        </div>

                        {selectedQuiz.questions.length > 0 && (
                            <div className="quiz-questions">
                                <h4>question details</h4>
                                {selectedQuiz.questions.map((q, index) => (
                                    <div key={q.id} className={`question-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="question-header">
                                            <span className="question-number">question {index + 1}</span>
                                            <span className={`question-status ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                                {q.isCorrect ? '✓ ถูก' : '✗ ผิด'}
                                            </span>
                                        </div>
                                        <div className="question-content">
                                            <p className="question-text">{q.question}</p>
                                            <div className="answer-section">
                                                <div className="user-answer">
                                                    <strong>Your answer:</strong> {q.userAnswer}
                                                </div>
                                                {!q.isCorrect && (
                                                    <div className="correct-answer">
                                                        <strong>Correct Answer:</strong> {q.correctAnswer}
                                                    </div>
                                                )}
                                                <div className="explanation">
                                                    <strong>Explanation:</strong> {q.explanation}
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