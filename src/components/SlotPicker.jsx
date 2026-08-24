// Мрежа со сите часови за избраниот датум.
// Компонентата само прикажува - сметањето кој слот е слободен се прави
// во utils/slots.js, па тука нема логика за проверка.
function SlotPicker({ slots, selectedTime, dateText, workingDay, hoursText, onSelect }) {
  if (!dateText) {
    return <p className="state-message">Прво избери датум за да ги видиш слободните часови.</p>;
  }

  if (!workingDay) {
    return <p className="state-message state-message-error">Тој ден не работиме. {hoursText}</p>;
  }

  const freeSlots = slots.filter((slot) => slot.free);

  if (freeSlots.length === 0) {
    return (
      <p className="state-message state-message-warning">
        Нема слободни часови за овој датум. Пробај друг ден.
      </p>
    );
  }

  return (
    <div>
      <p className="slots-info">
        🕘 {freeSlots.length} {freeSlots.length === 1 ? 'слободен час' : 'слободни часа'}
      </p>

      <div className="slots-grid">
        {slots.map((slot) => {
          let className = 'slot-button';

          if (slot.time === selectedTime) {
            className = 'slot-button slot-button-active';
          } else if (!slot.free) {
            className = 'slot-button slot-button-taken';
          }

          return (
            <button
              key={slot.time}
              className={className}
              type="button"
              disabled={!slot.free}
              title={slot.free ? `${slot.time} - ${slot.endTime}` : slot.reason}
              onClick={() => onSelect(slot.time)}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      <p className="slots-note">Прецртаните часови се зафатени или изминати. {hoursText}</p>
    </div>
  );
}

export default SlotPicker;
