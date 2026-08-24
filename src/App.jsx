import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookingsProvider } from './context/BookingsContext';
import Layout from './components/Layout';
import Home from './components/Home';
import BookingForm from './components/BookingForm';
import Appointments from './components/Appointments';

function App() {
  return (
    <BookingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Сите страници го користат истиот изглед со навигација и подножје */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/zakazi" element={<BookingForm />} />
            <Route path="/termini" element={<Appointments />} />

            <Route
              path="*"
              element={
                <div className="container section center">
                  <h1 className="page-title">Страницата не постои</h1>
                  <Link className="button button-dark" to="/">
                    Назад на почетна
                  </Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </BookingsProvider>
  );
}

export default App;
