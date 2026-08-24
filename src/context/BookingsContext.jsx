import { createContext, useContext, useEffect, useState } from 'react';
import { overlapsExisting } from '../utils/slots';
import business from '../data/business.json';

const BookingsContext = createContext(null);

const STORAGE_KEY = 'avtolaker-termini';

// Ги чита зачуваните термини од localStorage
function readSavedBookings() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(readSavedBookings);

  // Термините се паметат и по затворање на прелистувачот
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Ако страницата е отворена во повеќе табови, сите гледаат исти термини
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        setBookings(readSavedBookings());
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Додавање нов термин. Враќа { ok, error } за да може формата да прикаже
  // порака без сама да проверува дали часот е слободен.
  function addBooking(booking) {
    if (overlapsExisting(booking, bookings, business.schedule)) {
      return { ok: false, error: 'Тој термин веќе е зафатен. Избери друг час.' };
    }

    const created = {
      ...booking,
      id: crypto.randomUUID(),
      status: 'Потврден',
      createdAt: new Date().toISOString(),
    };

    setBookings((currentBookings) => [...currentBookings, created]);
    return { ok: true, booking: created };
  }

  function cancelBooking(id) {
    setBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== id));
  }

  // Сортирани по датум и час, за да се прикажуваат во ред
  const sortedBookings = [...bookings].sort((first, second) =>
    `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)
  );

  const value = {
    bookings,
    sortedBookings,
    totalBookings: bookings.length,
    addBooking,
    cancelBooking,
  };

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

// Кратенка за користење на термините во другите компоненти
export function useBookings() {
  return useContext(BookingsContext);
}
