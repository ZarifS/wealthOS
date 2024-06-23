import { FormEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Input from 'components/ui/input';
import Button from 'components/ui/button';
import { useToast } from 'components/ui/toast';
import Label from 'components/ui/label';

import { useRouter } from 'next/router';

const styles: any = {};
import AuthService, { RegisterPayload } from '../services/authService';

const Register: NextPage = () => {
  // Setup state
  const [isLoading, setIsLoading] = useState(false);

  // Get hooks
  const router = useRouter();
  const { toast, dismiss } = useToast();

  const [formFields, setFormFields] = useState<RegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmedPassword: '',
  });

  // Handle submit
  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();

      setIsLoading(true);
      toast({ title: 'Loading..', description: 'Getting your stuff setup!' });

      const { firstName, lastName, email, password, confirmedPassword } = formFields;
      await AuthService.signUp({ firstName, lastName, email, password, confirmedPassword });

      dismiss();
      router.push('/');
    } catch (error: Error | any) {
      console.log('Error signing up:', error);
      toast({ title: 'Oops!', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
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
            <Button disabled={isLoading}>Sign Up</Button>
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
