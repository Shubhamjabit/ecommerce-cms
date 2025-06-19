import React, {useEffect, useState} from 'react';
const testComponent = () => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    setValue(1);
  }, []);
  useEffect(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <>
      <div>Value is {value}</div>
    </>
  );
};

export default testComponent;
