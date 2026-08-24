import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SlotPicker from './SlotPicker';
import { useBookings } from '../context/BookingsContext';
import { validateBooking } from '../utils/validation';
import {
  getAvailability,
  isWorkingDay,
  lastBookableDate,
  today,
  weekdayName,
} from '../utils/slots';
import services from '../data/services.json';
import business from '../data/business.json';

const EMPTY_FORM = {
  name: '',
  phone: '',
  vehicle: '',
  serviceId: '',
  date: '',
  time: '',
  notes: '',
};

// Страница со формата за закажување термин
function BookingForm() {
  const { schedule } = business;
  const { bookings, addBooking } = useBookings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Ако се дојде од картичка за услуга (/zakazi?usluga=poliranje), услугата
  // е веќе избрана
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    serviceId: searchParams.get('usluga') || '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const service = services.find((item) => item.id === form.serviceId);
  const requiredSlots = service ? service.durationSlots : 1;
  const workingDay = form.date ? isWorkingDay(form.date, schedule) : false;

  const slots = form.date
    ? getAvailability({
        dateText: form.date,
        schedule,
        bookings,
        requiredSlots,
        now: new Date(),
      })
    : [];

  // Ако избраниот час стане недостапен (сменета услуга или датум), се брише
  useEffect(() => {
    if (!form.time) {
      return;
    }

    const stillFree = slots.some((slot) => slot.time === form.time && slot.free);

    if (!stillFree) {
      setForm((currentForm) => ({ ...currentForm, time: '' }));
    }
  }, [slots, form.time]);

  // Едно место за менување на било кое поле од формата
  function updateField(field, value) {
    setForm((currentForm) => {
      const nextForm = { ...currentForm, [field]: value };

      // Промената на датум или услуга поместува кои часови се слободни,
      // па избраниот час веќе не важи
      if (field === 'date' || field === 'serviceId') {
        nextForm.time = '';
      }

      return nextForm;
    });

    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }));
    setMessage(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const foundErrors = validateBooking(form, schedule);
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      setMessage({ type: 'error', text: 'Провери ги означените полиња.' });
      return;
    }

    const result = addBooking({
      name: form.name.trim(),
      phone: form.phone.trim(),
      vehicle: form.vehicle.trim(),
      serviceId: form.serviceId,
      serviceTitle: service.title,
      serviceEmoji: service.emoji,
      date: form.date,
      time: form.time,
      slots: requiredSlots,
      notes: form.notes.trim(),
    });

    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      return;
    }

    setForm(EMPTY_FORM);
    setMessage({ type: 'success', text: 'Терминот е потврден. Те префрлам на приемите…' });

    // Малку задржување за да се прочита пораката, па потоа на листата
    setTimeout(() => navigate('/termini'), 1200);
  }

  return (
    <div className="container section">
      <h2 className="page-title">📅 Закажи термин</h2>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-field">
            <span className="form-label">
              Твое име <span className="required">*</span>
            </span>
            <input
              className="input"
              type="text"
              placeholder="Внеси го твоето име"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="form-field">
            <span className="form-label">
              Телефонски број <span className="required">*</span>
            </span>
            <input
              className="input"
              type="tel"
              placeholder="07X XXX XXX"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="form-label">
              Возило (година/марка/модел) <span className="required">*</span>
            </span>
            <input
              className="input"
              type="text"
              placeholder="пр. 2015 VW Golf 7"
              value={form.vehicle}
              onChange={(event) => updateField('vehicle', event.target.value)}
            />
            {errors.vehicle && <span className="field-error">{errors.vehicle}</span>}
          </label>

          <label className="form-field">
            <span className="form-label">
              Потребна услуга <span className="required">*</span>
            </span>
            <select
              className="input"
              value={form.serviceId}
              onChange={(event) => updateField('serviceId', event.target.value)}
            >
              <option value="">Избери услуга</option>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.title}
                </option>
              ))}
            </select>
            {errors.serviceId && <span className="field-error">{errors.serviceId}</span>}
            {service && (
              <span className="field-hint">
                Предвидено траење: {(requiredSlots * schedule.slotMinutes) / 60} ч.
              </span>
            )}
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="form-label">
              Датум <span className="required">*</span>
            </span>
            <input
              className="input"
              type="date"
              min={today()}
              max={lastBookableDate(schedule)}
              value={form.date}
              onChange={(event) => updateField('date', event.target.value)}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
            {form.date && !errors.date && (
              <span className="field-hint">{weekdayName(form.date)}</span>
            )}
          </label>

          <label className="form-field">
            <span className="form-label">Дополнителни забелешки</span>
            <input
              className="input"
              type="text"
              placeholder="Какви било специфични барања"
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
            />
          </label>
        </div>

        <div className="form-field">
          <span className="form-label">
            Час <span className="required">*</span>
          </span>

          <SlotPicker
            slots={slots}
            selectedTime={form.time}
            dateText={form.date}
            workingDay={workingDay}
            hoursText={schedule.hoursText}
            onSelect={(time) => {
              setForm((currentForm) => ({ ...currentForm, time }));
              setErrors((currentErrors) => ({ ...currentErrors, time: '' }));
              setMessage(null);
            }}
          />

          {errors.time && <span className="field-error">{errors.time}</span>}
        </div>

        {message && message.type === 'error' && (
          <p className="error-message">{message.text}</p>
        )}

        {message && message.type === 'success' && (
          <p className="success-message">{message.text}</p>
        )}

        <button className="button button-dark button-wide" type="submit">
          Потврди термин
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
