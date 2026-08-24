import { Link } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';
import { useBookings } from '../context/BookingsContext';
import { today } from '../utils/slots';

// Страница со сите закажани термини, поделени на претстојни и изминати
function Appointments() {
  const { sortedBookings, cancelBooking } = useBookings();

  const todayText = today();
  const upcoming = sortedBookings.filter((booking) => booking.date >= todayText);
  const past = sortedBookings.filter((booking) => booking.date < todayText);

  if (sortedBookings.length === 0) {
    return (
      <div className="container section">
        <h2 className="page-title">📋 Закажани термини</h2>

        <div className="card empty-box center">
          <p>Нема закажани термини.</p>
          <Link className="link-accent" to="/zakazi">
            Закажи прв термин →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2 className="page-title">📋 Закажани термини</h2>

      <h3 className="list-title">Претстојни ({upcoming.length})</h3>

      {upcoming.length === 0 ? (
        <p className="state-message">Нема претстојни термини.</p>
      ) : (
        <div className="appointments-list">
          {upcoming.map((booking) => (
            <AppointmentCard key={booking.id} booking={booking} onCancel={cancelBooking} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h3 className="list-title">Изминати ({past.length})</h3>

          <div className="appointments-list">
            {past.map((booking) => (
              <AppointmentCard key={booking.id} booking={booking} past onCancel={cancelBooking} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Appointments;
