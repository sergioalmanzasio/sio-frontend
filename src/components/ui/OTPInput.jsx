import { useRef, useState } from "react";

const OTPInput = ({ length = 6, onComplete }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (val, index) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
    if (newValues.every((v) => v !== "")) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, length);

    if (!/^[0-9]+$/.test(paste)) return;

    const newValues = paste.split("").concat(Array(length).fill("")).slice(0, length);
    setValues(newValues);

    if (newValues.every((v) => v !== "")) {
      onComplete(newValues.join(""));
    }
    inputsRef.current[newValues.length - 1].focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {values.map((val, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength={1}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl
                     focus:border-blue-600 focus:outline-none"
          value={val}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default OTPInput;