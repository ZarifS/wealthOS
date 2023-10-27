import { useState } from 'react';
const styles: any = {};

export type ToastState = 'success' | 'warning' | 'error';

interface ToastMessageProps {
  message: string;
  state: ToastState;
}

const ToastMessage = ({ message, state }: ToastMessageProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[state]}`}>
      {message}
      <button className={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default ToastMessage;
