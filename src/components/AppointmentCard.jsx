import { useState } from 'react';
import { bookingEndTime, formatDate } from '../utils/slots';
import business from '../data/business.json';

// Картичка за еден закажан термин, со потврда пред откажување
function AppointmentCard({ booking, past, onCancel }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <article className={past ? 'appointment-card appointment-card-past' : 'appointment-card'}>
      <div className="appointment-top">
        <div className="appointment-main">
          <h3 className="appointment-name">
            {booking.name}
            <span className="badge badge-confirmed">{booking.status}</span>
            {past && <span className="badge badge-past">Изминат</span>}
          </h3>

          <p className="appointment-meta">
            📱{' '}
            <a className="link-accent" href={`tel:${booking.phone}`}>
              {booking.phone}
            </a>
          </p>
          <p className="appointment-meta">🚗 {booking.vehicle}</p>
          {booking.notes && <p className="appointment-notes">💬 {booking.notes}</p>}
        </div>

        <div className="appointment-side">
          <p className="appointment-service">
            {booking.serviceEmoji} {booking.serviceTitle}
          </p>
          <p className="appointment-date">📅 {formatDate(booking.date)}</p>
          <p className="appointment-time">
            🕘 {booking.time} - {bookingEndTime(booking, business.schedule)}
          </p>
        </div>

        <button
          className="icon-button"
          type="button"
          title="Откажи термин"
          onClick={() => setConfirming(true)}
        >
          🗑
        </button>
      </div>

      {confirming && (
        <div className="appointment-confirm">
          <p>Откажи го овој термин?</p>

          <div className="appointment-confirm-buttons">
            <button
              className="button button-danger"
              type="button"
              onClick={() => onCancel(booking.id)}
            >
              Да, откажи
            </button>

            <button
              className="button button-light"
              type="button"
              onClick={() => setConfirming(false)}
            >
              Не, задржи
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default AppointmentCard;
