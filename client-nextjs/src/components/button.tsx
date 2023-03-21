import styles from './button.module.scss';

interface CustomButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const CustomButton = ({
    text,
    type = 'button',
    onClick,
    className = '',
    disabled = false,
    style,
}: CustomButtonProps) => {
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

export default CustomButton;