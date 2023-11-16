import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import Link from 'next/link';
import { RootState, AppDispatch } from '../store';
import { register } from '../store/authStore';
import Input from 'components/input';
import Button from 'components/button';
import { useToast } from 'components/toast';
import Label from 'components/label';

import { useRouter } from 'next/router';

const styles: any = {};
import { RegisterPayload } from '../services/authService';

const Register: NextPage = () => {
  // Get hooks
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast, dismiss } = useToast();

  // Setup state
  const { loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);

  // Route back to app once we are registered and logged in
  useEffect(() => {
    if (isLoggedIn) {
      dismiss()
      router.push('/')
    };
  }, [isLoggedIn, router]);

  // Show toast messages
  useEffect(() => {
    if (loading) {
      toast({ title: 'Loading..', description: 'Getting stuff setup!' });
    }
    else if (message) {
      toast({ title: 'Oops!', description: message });
    }
  }, [loading, message]);

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-xl font-bold my-5">Sign Up</h1>
      <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                name="firstName"
                placeholder="John"
                type="text"
                id="firstName"
                onChange={(event) => onChange({ key: event.target.name, val: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                name="lastName"
                placeholder="Doe"
                type="text"
                id='lastName'
                onChange={(event) => onChange({ key: event.target.name, val: event.target.value })} />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                name="email"
                placeholder="john.doe@gmail.com"
                type="email"
                id="email"
                onChange={(event) => onChange({ key: event.target.name, val: event.target.value })} />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input name="password" id="password" type="password" placeholder="*******" onChange={(event) => onChange({ key: event.target.name, val: event.target.value })} />
            </div>
            <div>
              <Label htmlFor='confirmedPassword'>Confirm Password</Label>
              <Input
                name="confirmedPassword"
                type="password"
                id='confirmedPassword'
                placeholder="*******"
                onChange={(event) => onChange({ key: event.target.name, val: event.target.value })} />
            </div>
            <Button>Sign Up</Button>
          </div>
        </div>
      </form>
      <Link href="/login">
        <p className="text-sm my-4">Already have an account? <span className='underline'>Sign in.</span></p>
      </Link>
    </div>
  );
};

export default Register;
