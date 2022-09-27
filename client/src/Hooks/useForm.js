import { useState } from "react";

const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const reset = () => {
    setValues(initialState);
  }

  const handleFormChange = ({target}) => {
    setValues({
      ...values,
      [target.name]: target.value,
    })
  }

  return [values, handleFormChange, reset];
};

export default useForm;
