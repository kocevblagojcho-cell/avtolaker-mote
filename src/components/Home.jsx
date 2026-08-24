import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import GalleryItem from './GalleryItem';
import services from '../data/services.json';
import gallery from '../data/gallery.json';
import business from '../data/business.json';

// Почетна страница: кратка најава, услугите и галеријата пред/после
function Home() {
  return (
    <>
      <section className="container section hero">
        <h1 className="hero-title">Фарбање, полирање и лакирање со гаранција за квалитет</h1>
        <p className="hero-text">
          Работиме со каролинер, термо лакирање и машинско полирање. Избери услуга, датум и час -
          и знаеш точно кога те чекаме.
        </p>
        <Link className="button button-dark button-wide" to="/zakazi">
          Закажи термин
        </Link>
        <p className="hero-hours">🕘 {business.schedule.hoursText}</p>
      </section>

      <section className="container section">
        <h2 className="page-title">⚙️ Професионални услуги</h2>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="page-title">🖼️ Галерија пред/после</h2>

        <div className="gallery-grid">
          {gallery.map((entry) => (
            <GalleryItem key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
