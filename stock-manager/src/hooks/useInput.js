import { useState } from "react";

function useInput(validation) {
  const [inputValue, setInputValue] = useState(0);
  const [isBlur, setIsBlur] = useState();

  const isValid = validation(inputValue);
  const error = !isValid && isBlur;

  function inputHandler(event) {
    setInputValue(event.currentTarget.value);
  }

  function blurHandler(event) {
    setIsBlur(true);
  }

  function clearInput() {
    setInputValue(0);
    setIsBlur(false);
  }

  return {
    inputValue,
    error,
    isValid,
    inputHandler,
    blurHandler,
    clearInput,
  };
}

export default useInput;
