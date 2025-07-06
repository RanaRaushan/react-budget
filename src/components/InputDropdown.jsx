import { useState } from 'react';
import { ddOptionCSS } from '../utils/cssConstantHelper';

export default function InputDropdownComponent({ props }) {
  const [filteredSuggestionOptions, setFilteredSuggestionOptions] = useState(
    [],
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    suggestion,
    disabled,
    placeholder,
    name,
    value,
    defaultValue,
    onInputChange,
    className,
    showBtm = false,
  } = props;
  const handleChange = (e) => {
    const value = e.target.value;

    if (value) {
      const filtered = suggestion.filter(({ summary }) =>
        {
        return summary.toLowerCase().includes(value.toLowerCase())}
      );
      setFilteredSuggestionOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSuggestionOptions([]);
      setShowDropdown(false);
    }
    onInputChange({summary:value});
  };

  const handleSelect = (option) => {
    onInputChange(option);
    setShowDropdown(false);
  };

  return (
    <>
      {defaultValue ? <input
        type="text"
        name={name}
        defaultValue={value?? ''}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => value && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Delay to allow click
        placeholder={placeholder}
        className={className}
      /> :
      <input
        type="text"
        name={name}
        value={value?? ''}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => value && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Delay to allow click
        placeholder={placeholder}
        className={className}
      /> 
      }
      {showDropdown && filteredSuggestionOptions?.length > 0 && (
        <ul
          className={`absolute ${showBtm ? '' : 'bottom-full'} left-0 border max-h-60 overflow-auto rounded-2xl z-50 shadow ${ddOptionCSS}`}
        >
          {filteredSuggestionOptions.slice(0, 10).map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-blue-100 hover:text-black cursor-pointer"
            >
              {option.summary}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
