import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import Link from 'next/link';
import { RootState, AppDispatch } from '../store';
import { login } from '../store/authStore';
import Input from '../components/input';
import Button from '../components/button';
import { useToast } from 'components/toast';
import { useRouter } from 'next/router';

import { LoginPayload } from '../services/authService';

const Login: NextPage = () => {
  // Get hooks
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast, dismiss } = useToast();

  // Setup state
  const { loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);

  // Route back to app once we are logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Hide all toasts
      dismiss()
      router.push('/')
    }
    ;
  }, [isLoggedIn, router]);

  const [formFields, setFormFields] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  // Handle submit
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { email, password } = formFields;
    dispatch(login({ email, password }));
  };

  // Handle field updates
  const onChange = ({ key, val }: { key: string; val: string }) => {
    setFormFields({
      ...formFields,
      [key]: val,
    });
  };

  useEffect(() => {
    if (loading) {
      toast({ title: 'Loading..', description: 'Getting stuff setup!' });
    }
    else if (message) {
      toast({ title: 'Oops!', description: message });
    }
  }, [loading, message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-xl font-bold my-5">Sign In</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4">
            <Input
              name="email"
              placeholder="john.doe@gmail.com"
              type="email"
              onChange={(event) => onChange({ key: event.target.name, val: event.target.value })}
            />
            <Input
              name="password"
              type="password"
              placeholder='********'
              onChange={(event) => onChange({ key: event.target.name, val: event.target.value })}
            />
            <Button>Sign Up</Button>
          </div>
        </div>
      </form>
      <div>
        <Link href="/register">
          <p className="text-sm my-4">Need an account? <span className='underline'>Register here.</span></p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
