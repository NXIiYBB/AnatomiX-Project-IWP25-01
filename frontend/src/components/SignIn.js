import { useState } from 'react';
import './signin.css';
import { useNavigate } from 'react-router-dom';
// import { HiMail } from 'react-icons/hi';
// import { MdPassword } from 'react-icons/md';

function SignIn({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    // const [inputVa]

    const handleClick = event => {
        setIsActive(current => !current);
    };

    // ฟังก์ชัน Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("sign in!")
    try {
      const res = await fetch(
        "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/logIn",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Sign In success: " + JSON.stringify(data));
        setIsLoggedIn(true);

        // เก็บ token ไว้ถ้ามี
        // localStorage.setItem("token", data.token);

        navigate("/home");
      } else {
        console.log("❌ Sign In failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.log("⚠️ Error: " + err.message);
    }
  };

  // ฟังก์ชัน Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("sign up!")
    try {
      const res = await fetch(
        "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/signUp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        }
      );

      const data = await res.json();

      console.log("✅ Sign Up success: " + JSON.stringify(data));
      setIsActive(true);
    } catch (err) {
      console.log("⚠️ Error: " + err.message);
    }
  };

    return (
        <div className='allpage'>
            <div className={`container ${isActive ? `active` : ''}`}>
                <div className='form-container sign-up'>
                    <form method='POST' onSubmit={handleSignIn}>
                        <h1>Sign In</h1><br></br>
                        <label>Email</label>
                        <input type='email' placeholder='anatomix@gmail.com' required onChange={e => setEmail(e.target.value)}></input><br></br>

                        <label>Password</label>
                        <input type='password' id='password' name='password' placeholder='Enter Password' required onChange={e => setPassword(e.target.value)}></input><br></br>
                        <button type='submit'>Sign In</button>
                    </form>
                </div>
                <div className='form-container sign-in'>
                    <form method='POST' onSubmit={handleSignUp}>
                        <h1>Sign Up</h1><br></br>
                        <label>Username</label>
                        <input type='text' id="username" name="username" placeholder='Enter username' required onChange={e => setUsername(e.target.value)}></input><br></br>

                        <label>Email</label>
                        <input type='email' placeholder='anatomix@gmail.com' required onChange={e => setEmail(e.target.value)}></input><br></br>

                        <label>Password</label>
                        <input type='password' id='password' name='password' placeholder='Enter Password' required onChange={e => setPassword(e.target.value)}></input><br></br>
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