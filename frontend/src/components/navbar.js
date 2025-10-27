import React, { useState } from "react";
import { BiBookAlt, BiHome, BiMessage } from "react-icons/bi";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsPersonCircle } from "react-icons/bs";
import './navbar.css';
import { Link } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <div className="menu">
            <div className='logo'>
                <BiBookAlt className="logo-icon" />
                <h1>AnatomiX</h1>
            </div>

            <div className="hamburger" onClick={() => setOpen(!open)}>
                <GiHamburgerMenu />
            </div>

            <nav className={`menu-container ${open ? "open" : ""}`}>
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

            {/* <div className="profile">
                <Link to="/profile" className="profile-item"><BsPersonCircle className="profile-icon" /></Link>
            </div> */}
        </div>

    );
}

export default Navbar;

// Icon
// {/* <BiHome className="icon" />
// <BiMessage className="icon" />
// <VscLightbulbSparkle className="icon" />
// <BsPersonCircle className="icon" /> */}