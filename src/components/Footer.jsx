import business from '../data/business.json';

// Подножје со контакт информации и мапа
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-columns">
        <div className="footer-column">
          <p className="footer-address">📍 {business.address}</p>
          <p>
            <strong>Работно време:</strong> {business.schedule.hoursText}
          </p>
          <p>
            <strong>Телефон:</strong>{' '}
            <a className="link-accent" href={`tel:+${business.phoneDigits}`}>
              {business.phone}
            </a>
          </p>
          <p>
            <strong>WhatsApp:</strong>{' '}
            <a
              className="link-whatsapp"
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Пиши ни
            </a>
          </p>
        </div>

        <div className="footer-column">
          <div className="map-frame">
            <iframe
              title={`Локација - ${business.name}`}
              src={business.mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {business.name}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
