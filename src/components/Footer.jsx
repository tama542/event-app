import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>TN events</h4>
                    <p>Discover, explore, and book tickets for the best events.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/events">Events</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>

                    
                    <div className="social-icons">
             <a href="https://facebook.com"><FaFacebook size={24} /></a>
            <a href="https://twitter.com"><FaTwitter size={24} /></a>
            <a href="" ><FaLinkedin size={24} /></a>
            <a href="https://instagram.com"><FaInstagram size={24} /></a>
                        {/* <a href="https://facebook.com" target="_blank">🟦</a>
                        <a href="https://twitter.com" target="_blank">🖤</a>
                        <a href="https://instagram.com" target="_blank">📸</a> */}


                    </div>

                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 TN events | All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
