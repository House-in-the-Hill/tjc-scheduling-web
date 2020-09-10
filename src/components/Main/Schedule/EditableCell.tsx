import React, { useState, useEffect } from 'react';

interface EditableCellProps {
  value: any;
  row: any;
  column: any;
  updateMyData: any;
}

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: EditableCellProps) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  console.log(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return initialValue ? <input value={value} onChange={onChange} onBlur={onBlur} /> : '';
};
