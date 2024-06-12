import { FormEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Input from '../components/input';
import Button from '../components/button';
import { useToast } from 'components/toast';
import { useRouter } from 'next/router';

import AuthService, { LoginPayload } from '../services/authService';
import Label from 'components/label';
import { Checkbox } from 'components/checkbox';

const Login: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get hooks
  const router = useRouter();
  const { toast, dismiss } = useToast();

  // Setup state

  // Route back to app once we are logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Hide all toasts
      console.log('Logged in! Redirecting to home page...')
      dismiss()
      router.push('/')
    };
  }, [isLoggedIn, router]);

  const [formFields, setFormFields] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  // Handle submit
  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      toast({ title: 'Loading..', description: 'Getting stuff setup!' });
      const { email, password, preserveLogin } = formFields;
      await AuthService.signIn({ email, password, preserveLogin });
      setIsLoggedIn(true);
    } catch (error: Error | any) {
      console.log('Error signing in:', error);
      toast({ title: 'Oops!', description: error.message, variant: 'destructive' });
    }
  };

  // Handle field updates
  const onChange = ({ key, val }: { key: string; val: string }) => {
    setFormFields({
      ...formFields,
      [key]: val,
    });
  };

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
            <div className="flex items-center space-x-2 px-1">
              <Checkbox id="preserveLogin" checked />
              <Label htmlFor="preserveLogin" className='text-sm'>Keep me signed in</Label>
            </div>
            <Button>Sign In</Button>
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
