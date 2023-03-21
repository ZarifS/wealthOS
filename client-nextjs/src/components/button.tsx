import styles from './button.module.scss';

export interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const Button = ({
    text,
    type = 'button',
    onClick,
    className = '',
    disabled = false,
    style,
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.customButton} ${className}`}
            disabled={disabled}
            style={style}
        >
            {text}
        </button>
    );
};

export default Button;