import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  rows = 4,
  ...props
}) => {
  const inputClass = [
    'input',
    error && 'input-error',
    className
  ].filter(Boolean).join(' ');

  const isTextarea = type === 'textarea';

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      {isTextarea ? (
        <textarea
          className={inputClass}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          {...props}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...props}
        />
      )}
      
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
