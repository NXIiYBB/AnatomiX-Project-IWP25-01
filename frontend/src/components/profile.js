import React, { useState, useEffect } from 'react';
import './profile.css';
import { BsPersonSquare } from 'react-icons/bs';
import { AiFillEdit, AiFillMessage, AiFillStar } from 'react-icons/ai';
import { LuLogOut } from 'react-icons/lu';
import { GiNotebook } from 'react-icons/gi';
import { BsGraphUp, BsRobot, BsCalendar2CheckFill } from 'react-icons/bs';
import Navbar from './navbar';
import Swal from 'sweetalert2';
import { getFirestore, collection, doc, getDocs, getDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile = ({uid}) => {
    const navigate = useNavigate();
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

    const [showEditModal, setShowEditModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [editForm, setEditForm] = useState({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
    });

    const [userData, setUserData] = useState(null);
    const [chatHistory, setChatHistory] = useState(null);

    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", uid);

        // --- quizzes ---
        const quizzesSnap = await getDocs(collection(userRef, "quizzes"));
        const quizzes = [];
        let avgScore = 0;
        let score = 0;
        let all = 0;

        for (const quizDoc of quizzesSnap.docs) {
          const quizData = quizDoc.data();

          const questionsSnap = await getDocs(
            collection(userRef, "quizzes", quizDoc.id, "questions")
          );
          const questions = questionsSnap.docs.map((q) => ({
            id: q.id,
            ...q.data(),
          }));

            if (quizData.totalScore){
                quizzes.push({
                id: quizDoc.id,
                ...quizData,
                questions,
                });
                score += quizData.totalScore;
                all += quizData.numQuestions;
            }
        }

        // --- conversations ---
        const convoRef = collection(userRef, "conversations");
        const q = query(convoRef, orderBy("createdAt", "desc"), limit(3));
        const convoSnap = await getDocs(q);
        const conversations = convoSnap.docs.map((c) => ({
        id: c.id,
        ...c.data(),
        }));

        avgScore = (score/all*100).toFixed(2);
        setData({ quizzes, conversations, avgScore });
        console.log(quizzes);
        console.log(conversations);
        console.log(avgScore);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchUserData();
  }, [uid]);

    useEffect(() => {
        const fetchUserInfo = async () => {
        try {
            const userDocRef = doc(db, "users", uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
            setUserData(userSnap.data());
            } else {
            console.log("No such user!");
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
        };

        if (uid) fetchUserInfo();
    }, [uid]);

    if (!userData) return <div>Loading...</div>;

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
    const handleChat = (id) => {
        navigate("/chat", { state: { id } });
    };
    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        return '#e74c3c';
    };
    if (loading) return <p>Loading...</p>;
    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <div className="user-info">
                        <div className="user-details">
                            <h1>{userData.username}</h1>
                            <p className="email">{userData.email}</p>
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
                                <h3>{data.conversations.length}</h3>
                                <p>All Chat</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon quiz-icon"><GiNotebook /></div>
                            <div className="card-content">
                                <h3>{data.quizzes.length}</h3>
                                <p>Quizzes Taken</p>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="card-icon score-icon"><AiFillStar /></div>
                            <div className="card-content">
                                <h3>{data.avgScore}%</h3>
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
                            {data.conversations.map(topic => (
                                <div key={topic.id} className="topic-item">
                                    <div className="topic-icon"><AiFillMessage /></div>
                                    <div className="topic-content">
                                        <h4>{topic.title}</h4>
                                        <div className="topic-meta">
                                            {/* <span>{topic.messageCount} ข้อความ</span> */}
                                            <span>{topic.createdAt.toDate().toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button className="view-btn" onClick={() => handleChat(topic.id)}>view</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quiz History */}
                    <div className="section">
                        <h2>Quiz History</h2>
                        <div className="quiz-history">
                            {data.quizzes.map(quiz => (
                                <div key={quiz.id} className="quiz-item">
                                    <div className="quiz-score" style={{ backgroundColor: getScoreColor(quiz.totalScore) }}>
                                        {(quiz.totalScore/quiz.numQuestions*100).toFixed(1)}%
                                    </div>
                                    <div className="quiz-content">
                                        <h4>{quiz.systems}</h4>
                                        <div className="quiz-meta">
                                            <span><BsGraphUp /> {quiz.totalScore}/{quiz.numQuestions} scores</span>
                                            <span><BsRobot /> Level: {quiz.difficulty}</span>
                                            <span><BsCalendar2CheckFill /> {quiz.createdAt.toDate().toLocaleString()}</span>
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
                                    <span className="value" style={{ color: getScoreColor(selectedQuiz.totalScore) }}>
                                        {(selectedQuiz.totalScore/selectedQuiz.numQuestions*100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="label">Number of questions:</span>
                                    <span className="value">{selectedQuiz.numQuestions} questions</span>
                                </div>
                                <div className="stat">
                                    <span className="label">System:</span>
                                    <span className="value">{selectedQuiz.systems}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Date:</span>
                                    <span className="value">{selectedQuiz.createdAt.toDate().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {selectedQuiz.questions.length > 0 && (
                            <div className="quiz-questions">
                                <h4>question details</h4>
                                {selectedQuiz.questions.map((q, index) => (
                                    <div key={q.id} className={`question-item ${q.score ? 'correct' : 'incorrect'}`}>
                                        <div className="question-header">
                                            <span className="question-number">question {index + 1}</span>
                                            <span className={`question-status ${q.score ? 'correct' : 'incorrect'}`}>
                                                {q.score ? '✓ ถูก' : '✗ ผิด'}
                                            </span>
                                        </div>
                                        <div className="question-content">
                                            <p className="question-text">{q.question}</p>
                                            <div className="answer-section">
                                                <div className="user-answer">
                                                    <strong>Your answer:</strong> {q.userAnswer}
                                                </div>
                                                {q.score === 0 && (
                                                    <div className="correct-answer">
                                                        <strong>Correct Answer:</strong> {q.answer}
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