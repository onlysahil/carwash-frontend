// src/components/InputField/InputField.jsx
import "./InputField.css";

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputField;
