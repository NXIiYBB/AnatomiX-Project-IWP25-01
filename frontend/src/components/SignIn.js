import { useState } from 'react';
import './signin.css';
import { useNavigate } from 'react-router-dom';
// import { HiMail } from 'react-icons/hi';
// import { MdPassword } from 'react-icons/md';

function SignIn({ setIsLoggedIn }) {

    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    // const [inputVa]

    const handleClick = event => {
        setIsActive(current => !current);
    };

    const handleSignIn = (e) => {
        e.preventDefault(); // กันรีเฟรชหน้า
        setIsLoggedIn(true);
        console.log("Sign In Success ✅");
        navigate('/home');
    };

    // ฟังก์ชัน submit Sign Up
    const handleSignUp = (e) => {
        e.preventDefault();

        console.log("Sign Up Success 🎉");
        navigate('/home');
    };

    return (
        <div className='allpage'>
            <div className={`container ${isActive ? `active` : ''}`}>
                <div className='form-container sign-up'>
                    <form method='post' onSubmit={handleSignIn}>
                        <h1>Sign In</h1><br></br>
                        <label>Email</label>
                        <input type='email' placeholder='anatomix@gmail.com' required></input><br></br>

                        <label>Password</label>
                        <input type='password' id='password' name='password' placeholder='Enter Password' required></input><br></br>
                        <button type='submit'>Sign In</button>
                    </form>
                </div>
                <div className='form-container sign-in'>
                    <form method='post' onSubmit={handleSignUp}>
                        <h1>Sign Up</h1><br></br>
                        <label>Username</label>
                        <input type='text' id="username" name="username" placeholder='Enter username' required></input><br></br>

                        <label>Email</label>
                        <input type='email' placeholder='anatomix@gmail.com' required></input><br></br>

                        <label>Password</label>
                        <input type='password' id='password' name='password' placeholder='Enter Password' required></input><br></br>
                        <button type='submit' value={'Submit'}>Sign Up</button>
                    </form>
                </div>
                <div className='toggle-container'>
                    <div className='toggle'>
                        <div className='toggle-panel toggle-left'>
                            <h1>Welcome Back!</h1>
                            <p>Don't have an account?</p>
                            <button className='hidden' id='login' onClick={handleClick}>Create an account</button>
                        </div>
                        <div className='toggle-panel toggle-right'>
                            <h1>Welcome to <span>AnatomiX</span></h1>
                            <p>Have an account?</p>
                            <button className='hidden' id='register' onClick={handleClick}>Sign In</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SignIn;