import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import "../App.css";

function Footer() {
  const instagramUrl = `https://www.instagram.com/prince.robie/`
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ position: "fixed", bottom: 0, width: "100%" }} className="footer-custom d-flex justify-content-center p-2">
      <div className="mx-3">
        <p>&copy; 2022-{currentYear} by Prince Roger Robielos.</p>
      </div>
      <div>|</div>
      <div className="mx-3">Visit our social media accounts</div>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} />
      </a> {/* Close the <a> element properly */}
    </footer>
  );
}

export default Footer;
