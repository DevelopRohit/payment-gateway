import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>💳 PayIndia</h3>
          <p className="company-desc">
            Your trusted digital payment gateway for seamless, secure, and
            convenient transactions.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" title="Facebook">
              f
            </a>
            <a href="#" className="social-icon" title="Twitter">
              𝕏
            </a>
            <a href="#" className="social-icon" title="LinkedIn">
              in
            </a>
            <a href="#" className="social-icon" title="Instagram">
              📷
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/send">Send Money</Link>
            </li>
            <li>
              <Link to="/recharge">Recharge</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul className="footer-links">
            <li>
              <a href="#features">Money Transfer</a>
            </li>
            <li>
              <a href="#features">Mobile Recharge</a>
            </li>
            <li>
              <a href="#features">QR Payments</a>
            </li>
            <li>
              <a href="#features">Bill Payments</a>
            </li>
            <li>
              <a href="#features">24/7 Support</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#help">Help Center</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms & Conditions</a>
            </li>
            <li>
              <a href="#security">Security</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Get In Touch</h4>
          <div className="contact-info">
            <p>📧 support@payindia.com</p>
            <p>📞 1800-PAY-INDIA</p>
            <p>🏢 New Delhi, India</p>
            <p className="hours">Mon - Fri: 9 AM - 6 PM IST</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} <strong>PayIndia</strong>. All rights reserved.
        </p>
        <div className="payment-methods">
          <span className="badge">🔒 Secure Payments</span>
          <span className="badge">✓ Verified</span>
          <span className="badge">⚡ Fast Transfer</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
