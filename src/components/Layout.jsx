import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ParticlesBackground from './ParticlesBackground';
import business from '../data/business.json';

// Сите страници го делат истиот изглед: заглавие, содржина, подножје
function Layout() {
  return (
    <div className="page">
      <ParticlesBackground />

      <Header />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      {/* Копчето за WhatsApp останува видливо на секоја страница */}
      <a
        className="whatsapp-button"
        href={`https://wa.me/${business.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Пиши ни на WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.92 11.92 0 0012 .08 11.9 11.9 0 004.22 3.3a11.91 11.91 0 00-3.13 8.56c.03 2.05.54 4.07 1.55 5.86L.2 23.75l6.86-1.8a11.88 11.88 0 005.87 1.56h.03a11.9 11.9 0 008.72-3.6 11.83 11.83 0 003.5-8.3 11.92 11.92 0 00-3.68-8.13zm-8.64 18.06h-.02a9.76 9.76 0 01-4.97-1.35l-.36-.21-4.08 1.07 1.09-3.99-.24-.4A9.77 9.77 0 013.8 12.03c0-5.3 4.33-9.63 9.63-9.63 2.57 0 4.99.99 6.8 2.8a9.59 9.59 0 012.8 6.79c0 5.3-4.33 9.63-9.63 9.63zm5.51-7.22c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15s-.77.96-.95 1.16a1.99 1.99 0 01-.35.2c-.15.05-.3.02-.46-.02-.53-.19-2.01-.74-3.83-2.34a14.36 14.36 0 01-2.63-3.2c-.28-.43-.03-.66.2-.87.16-.15.36-.39.54-.58.18-.18.24-.31.36-.51.12-.2.06-.38-.03-.53-.1-.15-.67-1.63-.92-2.25-.24-.59-.49-.51-.67-.51h-.57c-.18 0-.47.07-.72.34-.25.26-.96.94-.96 2.29s.99 2.67 1.13 2.86c.14.19 1.95 2.98 4.73 4.18 2.75 1.2 2.75.8 3.25.75.5-.05 1.7-.69 1.94-1.36.25-.66.25-1.23.17-1.35-.08-.11-.3-.17-.59-.31z"
          />
        </svg>
      </a>
    </div>
  );
}

export default Layout;
