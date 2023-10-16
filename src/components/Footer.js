import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

import "../App.css";

function Footer() {
  const instagramUrl = `https://www.instagram.com/prince.robie/`
  const gitHubUrl = `https://github.com/rprinceroger/`
  const linkedInUrl = `https://www.linkedin.com/in/prince-robielos-5421ba230/`
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ position: "fixed", bottom: 0, width: "100%" }} className="footer-custom d-flex justify-content-center p-2">
      <div className="mx-3">
        <p>&copy; 2022-{currentYear} Solution Design</p>
      </div>
      <div>|</div>
      <div className="mx-3 d-none d-lg-block">Visit my social media accounts</div>
      <a href={gitHubUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faUser} style={{ margin: '0 5px' }} /> {/* Close the <a> element properly */}
      </a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} style={{ margin: '0 5px' }} />
      </a> 
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} style={{ margin: '0 5px' }} />
      </a> 
    </footer>
  );
}

export default Footer;
