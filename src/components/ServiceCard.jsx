import { useNavigate } from 'react-router-dom';

// Картичка за една услуга. Со клик води до формата и веднаш ја избира услугата.
function ServiceCard({ service }) {
  const navigate = useNavigate();

  function handleBook() {
    // Услугата се пренесува преку URL, за да може линкот да се сподели
    navigate(`/zakazi?usluga=${service.id}`);
  }

  return (
    <article className="service-card">
      <span className="service-card-icon">{service.emoji}</span>

      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-text">{service.description}</p>

      <div className="service-card-footer">
        <span className="service-card-price">{service.price}</span>
        <button className="button button-light" type="button" onClick={handleBook}>
          Закажи
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;
