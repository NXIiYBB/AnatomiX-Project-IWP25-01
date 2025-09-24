import React from "react";
import { BiHome, BiBookAlt, BiMessage } from 'react-icons/bi';
import { VscLightbulbSparkle } from 'react-icons/vsc';
import { BsPersonCircle } from 'react-icons/bs';
import './navbar.css';
import { Link } from "react-router-dom";


function Navbar() {
  return (
        <div className="menu">
            <div className='logo'>
                <BiBookAlt className="logo-icon"/>
                <h1>AnatomiX</h1>
            </div>

            <nav className="menu-container">
                <ul className="menu--list">
                    <li>
                        <Link to="/home" className="item"><BiHome className="icon" />Home</Link>
                    </li>
                    <li>
                        <Link to="/chat" className="item"><BiMessage className="icon" />ChatBot</Link>
                    </li>
                    <li>
                        <Link to="/quiz" className="item"><VscLightbulbSparkle className="icon" />Quiz</Link>
                    </li>
                    <li>
                        <Link to="/profile" className="item"><BsPersonCircle className="icon" />Profile</Link>
                    </li>
                </ul>
    </nav>
        </div>

  );
}

export default Navbar;