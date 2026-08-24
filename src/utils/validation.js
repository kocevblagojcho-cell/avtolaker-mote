// Валидација на формата за закажување. Враќа објект со грешки по поле -
// празен објект значи дека сè е во ред.
import { isWorkingDay, lastBookableDate, today } from './slots';

export function validateBooking(form, schedule) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Внеси го твоето име.';
  }

  const digits = form.phone.replace(/\D/g, '');

  if (!form.phone.trim()) {
    errors.phone = 'Внеси телефонски број.';
  } else if (digits.length < 6) {
    errors.phone = 'Телефонскиот број е прекраток.';
  }

  if (!form.vehicle.trim()) {
    errors.vehicle = 'Внеси го возилото.';
  }

  if (!form.serviceId) {
    errors.serviceId = 'Избери услуга.';
  }

  if (!form.date) {
    errors.date = 'Избери датум.';
  } else if (form.date < today()) {
    errors.date = 'Датумот е во минатото.';
  } else if (form.date > lastBookableDate(schedule)) {
    errors.date = `Закажуваме најмногу ${schedule.maxDaysAhead} дена однапред.`;
  } else if (!isWorkingDay(form.date, schedule)) {
    errors.date = 'Тој ден не работиме.';
  }

  if (!form.time) {
    errors.time = 'Избери термин.';
  }

  return errors;
}
