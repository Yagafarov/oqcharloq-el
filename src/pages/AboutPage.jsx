import { FiMapPin, FiPhone, FiMail, FiClock, FiBook } from 'react-icons/fi';
import { SCHOOL_INFO } from '../utils/constants';
import Card from '../components/common/Card';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>Biz haqimizda</h1>
          <p className="about-intro">
            {SCHOOL_INFO.fullName} kutubxonasi - zamonaviy ta'lim va bilim manbai
          </p>
        </div>

        <div className="about-content">
          {/* Main Info */}
          <Card className="about-card">
            <div className="card-icon">📚</div>
            <h2>Kutubxona haqida</h2>
            <p>
              "Oqcharloq" kutubxonasi {SCHOOL_INFO.name} o'quvchilari va o'qituvchilari uchun 
              mo'ljallangan zamonaviy online kutubxona tizimi. Bizning maqsadimiz - 
              o'quvchilarga sifatli adabiyotlarni oson va qulay tarzda taqdim etish.
            </p>
            <p>
              Kutubxonamizda o'zbek va jahon adabiyotining eng yaxshi asarlari, 
              darsliklar, ilmiy-ommabop kitoblar va boshqa ko'plab qiziqarli 
              adabiyotlar mavjud.
            </p>
          </Card>

          {/* Contact Info */}
          <Card className="about-card">
            <div className="card-icon">📞</div>
            <h2>Aloqa ma'lumotlari</h2>
            <div className="contact-list">
              <div className="contact-item">
                <FiMapPin />
                <div>
                  <strong>Manzil:</strong>
                  <p>{SCHOOL_INFO.address}</p>
                </div>
              </div>
              <div className="contact-item">
                <FiPhone />
                <div>
                  <strong>Telefon:</strong>
                  <p><a href={`tel:${SCHOOL_INFO.phone}`}>{SCHOOL_INFO.phone}</a></p>
                </div>
              </div>
              <div className="contact-item">
                <FiMail />
                <div>
                  <strong>Email:</strong>
                  <p><a href={`mailto:${SCHOOL_INFO.email}`}>{SCHOOL_INFO.email}</a></p>
                </div>
              </div>
            </div>
          </Card>

          {/* Working Hours */}
          <Card className="about-card">
            <div className="card-icon">🕐</div>
            <h2>Ish vaqti</h2>
            <div className="schedule-list">
              <div className="schedule-item">
                <FiClock />
                <div>
                  <strong>Dushanba - Juma:</strong>
                  <p>{SCHOOL_INFO.workingHours.weekdays}</p>
                </div>
              </div>
              <div className="schedule-item">
                <FiClock />
                <div>
                  <strong>Shanba:</strong>
                  <p>{SCHOOL_INFO.workingHours.saturday}</p>
                </div>
              </div>
              <div className="schedule-item">
                <FiClock />
                <div>
                  <strong>Yakshanba:</strong>
                  <p>{SCHOOL_INFO.workingHours.sunday}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Rules */}
          <Card className="about-card">
            <div className="card-icon">📋</div>
            <h2>Kutubxona qoidalari</h2>
            <ul className="rules-list">
              <li>
                <FiBook />
                <span>Kitoblarni ehtiyotkorlik bilan saqlang</span>
              </li>
              <li>
                <FiBook />
                <span>Kitoblarni belgilangan muddatda qaytaring</span>
              </li>
              <li>
                <FiBook />
                <span>Kutubxonada tartib va osoyishtalikni saqlang</span>
              </li>
              <li>
                <FiBook />
                <span>Kitoblarga yozuv yozish va chizish taqiqlanadi</span>
              </li>
              <li>
                <FiBook />
                <span>Boshqa o'quvchilarga hurmat bilan munosabatda bo'ling</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
