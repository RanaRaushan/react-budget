import { useState } from 'react';
import { ddOptionCSS } from '../utils/cssConstantHelper';

// const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Grapes', 'Mango'];

export default function InputDropdownComponent({ props }) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestionOptions, setFilteredSuggestionOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const {suggestion, disabled, placeholder, name, value, onInputChange, className} = props
  // console.log("suggestions 11", suggestion, filteredSuggestionOptions, showDropdown && filteredSuggestionOptions.length > 0)
  // let descriptionSugesstion = suggestion ?? [];
  const handleChange = (e) => {
    const value = e.target.value;
    // setInputValue(value);

    if (value) {
      const filtered = suggestion.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestionOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSuggestionOptions([]);
      setShowDropdown(false);
    }
    onInputChange(value)
  };

  const handleSelect = (option) => {
    onInputChange(option);
    setShowDropdown(false);
  };

  return (
    <>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => value && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Delay to allow click
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && filteredSuggestionOptions.length > 0 && (
        <ul className={`absolute bottom-full left-0 border max-h-60 overflow-auto rounded-2xl z-50 shadow ${ddOptionCSS}`}>
          {filteredSuggestionOptions.slice(0, 10).map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-blue-100 hover:text-black cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
