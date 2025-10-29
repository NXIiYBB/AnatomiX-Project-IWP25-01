import { useState } from 'react';
import './signin.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function SignIn({ setIsLoggedIn }) {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isActive, setIsActive] = useState(false);
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);

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
				Swal.fire({
					icon: 'success',
					title: 'Login successful!',
					confirmButtonColor: '#0256f2'
				}).then(() => {
					setIsLoggedIn(true);
					console.log('Sign In Success');
					navigate('/home');
				});

				// console.log("✅ Sign In success: " + JSON.stringify(data));
				// setIsLoggedIn(true);

				// เก็บ token ไว้ถ้ามี
				// localStorage.setItem("token", data.token);

				// navigate("/home");
			} else {
				console.log("❌ Sign In failed: " + (data.error || "Unknown error"));
				Swal.fire({
					icon: 'warning',
					title: 'Please try again',
					text: 'Email or Password is not matching with our record',
					confirmButtonColor: '#0256f2'
				});
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

			if (res.ok) {
				Swal.fire({
					icon: 'success',
					title: 'Registration successful!',
					text: 'Please check your email to verify your account.',
					confirmButtonColor: '#0256f2'
				});
				console.log("✅ Sign Up success: " + JSON.stringify(data));
				setIsActive(true);
			} else {
				console.log("❌ Sign In failed: " + (data.error || "Unknown error"));
				Swal.fire({
					icon: 'warning',
					title: 'Please try again',
					text: 'This username or email is already in use.',
					confirmButtonColor: '#0256f2'
				});

			}
		} catch (err) {
			console.log("⚠️ Error: " + err.message);
		}
	};

	return (
		<div className='allpage'>
			<div className={`container ${isActive ? `active` : ''}`}>
				<div className='form-container sign-in'>
					<form method='POST' onSubmit={handleSignIn}>
						<h1>Sign In</h1><br></br>
						<label>Email</label>
						<input type='email' placeholder='anatomix@gmail.com' required onChange={e => setEmail(e.target.value)}></input><br></br>

						<label>Password</label>
						<input type='password' id='password' name='password' placeholder='Enter Password' required onChange={e => setPassword(e.target.value)}></input><br></br>
						<button type='submit'>Sign In</button>
						<div className="mobile-toggle">
							<p>Don't have an account?</p>
							<button type="button" onClick={handleClick}>Create Account</button>
						</div>
					</form>
				</div>
				<div className='form-container sign-up'>
					<form method='POST' onSubmit={handleSignUp}>
						<h1>Sign Up</h1><br></br>
						<label>Username</label>
						<input type='text' id="username" name="username" placeholder='Enter username' required onChange={e => setUsername(e.target.value)}></input><br></br>

						<label>Email</label>
						<input type='email' placeholder='anatomix@gmail.com' required onChange={e => setEmail(e.target.value)}></input><br></br>

						<label>Password</label>
						<input type='password' id='password' name='password' placeholder='Enter Password' required onChange={e => setPassword(e.target.value)}></input><br></br>
						<button type='submit' value={'Submit'}>Sign Up</button>
						<div className="mobile-toggle">
							<p>Have an account?</p>
							<button type="button" onClick={handleClick}>Sign In</button>
						</div>
					</form>
				</div>
				<div className='toggle-container'>
					<div className='toggle'>
						<div className='toggle-panel toggle-right'>
							<h1>Welcome Back!</h1>
							<p>Don't have an account?</p>
							<button className='hidden' id='login' onClick={handleClick}>Create an account</button>
						</div>
						<div className='toggle-panel toggle-left'>
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