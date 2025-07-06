import { useState } from 'react';
import { ddOptionCSS, inputddCSS } from '../utils/cssConstantHelper';
import { getFormatedDate } from '../utils/functionHelper';
import { lockedFields } from '../utils/constantHelper';

export default function QuickDateInputComponent({ props }) {
  const todayDateFormatted = getFormatedDate(new Date());
  const [date, setDate] = useState(todayDateFormatted);

  const setToToday = () => {
    setDate(todayDateFormatted);
    onInputChange(todayDateFormatted);
  };
  const setToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(getFormatedDate(tomorrow));
    onInputChange(getFormatedDate(tomorrow));
  };
  const setToYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(getFormatedDate(yesterday));
    onInputChange(getFormatedDate(yesterday));
  };
  const { key, name, value, onInputChange, className } = props;

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onInputChange(date);
  };

  const handleSelectOption = async (e) => {
    switch (e.target.value) {
      case 'today':
        setToToday();
        break;
      case 'yesterday':
        setToYesterday();
        break;
      case 'tomorrow':
        setToTomorrow();
        break;
    }
  };

  const dateOption = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'tomorrow', label: 'Tomorrow' },
  ];

  return (
    <div className="">
      <input
        disabled={lockedFields.includes(key)}
        type={lockedFields.includes(key) ? 'datetime-local' : 'date'}
        placeholder={key}
        name={name}
        value={value}
        onChange={handleDateChange}
        className={className}
      />

      <div className="flex gap-x-0.5">
        <select
          defaultValue={'- -'}
          onChange={handleSelectOption}
          className={`${inputddCSS}`}
        >
          <option className={`${ddOptionCSS}`} value="">
              {"- -"}
            </option>
          {Object.entries(dateOption).map(([ddkey, { key, label }]) => (
            <option className={`${ddOptionCSS}`} key={ddkey} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
