import React, { useState } from 'react';

type DropdownProps = {
    choices: string[];
    onSelect: (value: string) => void;
}
const Dropdown = ({ choices, onSelect }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleChange}>
        <option value="" disabled>Select an option</option>
        {choices.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
