import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { SCHOOL_INFO } from '../../../utils/constants';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">📚</span>
              {SCHOOL_INFO.libraryName}
            </h3>
            <p className="footer-text">
              {SCHOOL_INFO.fullName} kutubxonasi. O'quvchilar va o'qituvchilar uchun 
              zamonaviy online kutubxona tizimi.
            </p>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Aloqa</h4>
            <div className="footer-links">
              <a href={`tel:${SCHOOL_INFO.phone}`} className="footer-link">
                <FiPhone />
                {SCHOOL_INFO.phone}
              </a>
              <a href={`mailto:${SCHOOL_INFO.email}`} className="footer-link">
                <FiMail />
                {SCHOOL_INFO.email}
              </a>
              <div className="footer-link">
                <FiMapPin />
                {SCHOOL_INFO.address}
              </div>
            </div>
          </div>

          {/* Working Hours Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Ish vaqti</h4>
            <div className="footer-links">
              <div className="footer-link">
                <FiClock />
                Dushanba-Juma: {SCHOOL_INFO.workingHours.weekdays}
              </div>
              <div className="footer-link">
                <FiClock />
                Shanba: {SCHOOL_INFO.workingHours.saturday}
              </div>
              <div className="footer-link">
                <FiClock />
                Yakshanba: {SCHOOL_INFO.workingHours.sunday}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {SCHOOL_INFO.name} - {SCHOOL_INFO.libraryName}. 
            Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
