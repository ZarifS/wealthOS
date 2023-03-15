import { HTMLInputTypeAttribute } from "react";
import styles from './input.module.scss'

interface InputProps {
    label: string,
    name: string,
    inputType: HTMLInputTypeAttribute,
    initialValue?: string,
    onChange: Function
}

const Input = ({ label, name, inputType, initialValue, onChange }: InputProps) => {
    return (
        <div className={styles.main}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <input className={styles.input} type={inputType} id={name} name="password" value={initialValue}
                onChange={(event) => {
                    onChange({ key: name, val: event.target.value })
                }} />
        </div>
    )
}

export default Input