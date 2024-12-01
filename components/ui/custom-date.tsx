import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const CustomDateButton = () => {
  const [startDate, setStartDate] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      id="startDate"
      className={`w-full flex items-center px-4 py-2 text-left font-normal border rounded-md hover:bg-gray-50 ${!startDate && "text-gray-500"}`}
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {startDate ? format(startDate, "PPP") : <span>Seleccionar fecha</span>}
    </button>
  ));

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        setHasUnsavedChanges(true);
      }}
      customInput={<CustomInput />}
      dateFormat="PPP"
      locale="es"
      showPopperArrow={false}
      className="w-full"
    />
  );
};

export default CustomDateButton;