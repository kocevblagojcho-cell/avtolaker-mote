// Помошни функции за термините. Сите се чисти функции - примаат вредности и
// враќаат резултат, без да менуваат ништо надвор од себе.

const WEEKDAYS = [
  'Недела',
  'Понеделник',
  'Вторник',
  'Среда',
  'Четврток',
  'Петок',
  'Сабота',
];

const SHORT_WEEKDAYS = ['нед', 'пон', 'вто', 'сре', 'чет', 'пет', 'саб'];

const SHORT_MONTHS = [
  'јан',
  'фев',
  'мар',
  'апр',
  'мај',
  'јун',
  'јул',
  'авг',
  'сеп',
  'окт',
  'ноe',
  'дек',
];

// "08:30" -> 510 минути од полноќ
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// 510 -> "08:30"
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

// Датумот се прави рачно за да остане локален. new Date("2026-08-31") го чита
// како UTC и во нашата временска зона може да падне на претходниот ден.
export function parseDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Date -> "2026-08-31"
export function toDateText(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function today() {
  return toDateText(new Date());
}

export function weekdayName(dateText) {
  return WEEKDAYS[parseDate(dateText).getDay()];
}

// "2026-08-31" -> "пон, 31 авг 2026"
// Датумот се склопува рачно, бидејќи прелистувачите не носат податоци за
// македонски локал - toLocaleDateString('mk-MK') тихо би вратил англиски.
export function formatDate(dateText) {
  const date = parseDate(dateText);

  if (Number.isNaN(date.valueOf())) {
    return '-';
  }

  const weekday = SHORT_WEEKDAYS[date.getDay()];
  const month = SHORT_MONTHS[date.getMonth()];

  return `${weekday}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}

// Работното време за избраниот ден, или null ако тој ден не работиме
export function getWorkingHours(dateText, schedule) {
  if (!dateText) {
    return null;
  }

  const weekday = parseDate(dateText).getDay();
  return schedule.hours[String(weekday)] || null;
}

export function isWorkingDay(dateText, schedule) {
  return getWorkingHours(dateText, schedule) !== null;
}

// Сите почетни часови за денот, на пр. ["08:00", "09:00", ... "17:00"]
export function buildSlots(dateText, schedule) {
  const hours = getWorkingHours(dateText, schedule);

  if (!hours) {
    return [];
  }

  const opening = timeToMinutes(hours.open);
  const closing = timeToMinutes(hours.close);
  const slots = [];

  // Последниот слот мора цел да се вклопи пред затворање
  for (let start = opening; start + schedule.slotMinutes <= closing; start += schedule.slotMinutes) {
    slots.push(minutesToTime(start));
  }

  return slots;
}

// Колку минути зафаќа еден термин (подолгите услуги зафаќаат повеќе слотови)
export function bookingDuration(booking, schedule) {
  const slots = Number(booking.slots) || 1;
  return Math.max(1, slots) * schedule.slotMinutes;
}

// Кога завршува терминот, за приказ во листата: "10:00 - 13:00"
export function bookingEndTime(booking, schedule) {
  return minutesToTime(timeToMinutes(booking.time) + bookingDuration(booking, schedule));
}

// Дали новиот термин се препокрива со некој веќе закажан.
// Не е доволно да се провери само истиот час - услуга од 3 часа закажана во
// 10:00 го блокира и 11:00 и 12:00.
export function overlapsExisting(candidate, bookings, schedule) {
  const from = timeToMinutes(candidate.time);
  const to = from + bookingDuration(candidate, schedule);

  return busyRanges(candidate.date, bookings, schedule).some(
    (range) => from < range.to && to > range.from
  );
}

// Зафатените интервали за еден датум, како [{ from, to }] во минути
function busyRanges(dateText, bookings, schedule) {
  return bookings
    .filter((booking) => booking.date === dateText)
    .map((booking) => {
      const from = timeToMinutes(booking.time);
      return { from, to: from + bookingDuration(booking, schedule) };
    });
}

// Го враќа секој слот со ознака дали е слободен и зошто не е.
// requiredSlots - колку последователни слотови ѝ требаат на избраната услуга.
export function getAvailability({ dateText, schedule, bookings, requiredSlots, now }) {
  const hours = getWorkingHours(dateText, schedule);

  if (!hours) {
    return [];
  }

  const needed = Math.max(1, requiredSlots || 1) * schedule.slotMinutes;
  const closing = timeToMinutes(hours.close);
  const busy = busyRanges(dateText, bookings, schedule);
  const isToday = dateText === toDateText(now);
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  return buildSlots(dateText, schedule).map((time) => {
    const from = timeToMinutes(time);
    const to = from + needed;

    let free = true;
    let reason = '';

    if (isToday && from <= minutesNow) {
      free = false;
      reason = 'Изминато';
    } else if (to > closing) {
      free = false;
      reason = 'Не се вклопува до затворање';
    } else if (busy.some((range) => from < range.to && to > range.from)) {
      // Два интервала се препокриваат ако секој почнува пред другиот да заврши
      free = false;
      reason = 'Зафатено';
    }

    return { time, endTime: minutesToTime(to), free, reason };
  });
}

// Најдалечниот датум за кој дозволуваме закажување
export function lastBookableDate(schedule) {
  const date = new Date();
  date.setDate(date.getDate() + (schedule.maxDaysAhead || 60));
  return toDateText(date);
}
