import React, { useState } from 'react';

type DropdownProps = {
    choices: string[];
    selected: string;
    onSelect: (value: any) => void;
}
const Dropdown = ({ choices, onSelect, selected }: DropdownProps) => {
  // const [selectedOption, setSelectedOption] = useState(selected);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <div>
      <select value={selected} onChange={handleChange}>
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
