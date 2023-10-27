import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import Link from 'next/link';
import { RootState, AppDispatch } from '../store';
import { register } from '../store/authStore';
import Input from '../components/input';
import Button from '../components/button';
import ToastMessage from '../components/toastMessage';

import { useRouter } from 'next/router';

const styles: any = {};
import { RegisterPayload } from '../services/authService';

const Register: NextPage = () => {
  // Get hooks
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Setup state
  const { loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);

  // Route back to app once we are registered and logged in
  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn, router]);

  const [formFields, setFormFields] = useState<RegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmedPassword: '',
  });

  // Handle submit
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { firstName, lastName, email, password, confirmedPassword } = formFields;
    dispatch(register({ firstName, lastName, email, password, confirmedPassword }));
  };

  // Handle field updates
  const onChange = ({ key, val }: { key: string; val: string }) => {
    setFormFields({
      ...formFields,
      [key]: val,
    });
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.header}>Sign Up</h1>
      <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
        <div className={styles.formInputs}>
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            inputType="text"
            onChange={onChange}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            inputType="text"
            onChange={onChange}
          />
          <Input
            label="Email"
            name="email"
            placeholder="john.doe@gmail.com"
            inputType="email"
            onChange={onChange}
          />
          <Input label="Password" name="password" inputType="password" onChange={onChange} />
          <Input
            label="Confirm Password"
            name="confirmedPassword"
            inputType="password"
            onChange={onChange}
          />
        </div>
        <div className={styles.message}>
          {loading && <ToastMessage message="Loading..." state="warning" />}
          {message && <ToastMessage message={message} state="error" />}
        </div>
        <Button type="submit" text="Sign Up" onClick={onSubmit} />
      </form>
      <div className={styles.switchAuth}>
        <Link href="/login">
          <p>Already have an account? Login now!</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
