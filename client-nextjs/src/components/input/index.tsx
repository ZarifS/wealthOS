import { HTMLInputTypeAttribute } from 'react';
const styles: any = {};

interface InputProps {
  label: string;
  name: string;
  inputType: HTMLInputTypeAttribute;
  initialValue?: string;
  onChange: Function;
  placeholder?: string;
}

const Input = ({ label, name, inputType, initialValue, onChange, placeholder }: InputProps) => {
  return (
    <div className={styles.main}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={styles.input}
        type={inputType}
        id={name}
        name="password"
        value={initialValue}
        onChange={(event) => {
          onChange({ key: name, val: event.target.value });
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
