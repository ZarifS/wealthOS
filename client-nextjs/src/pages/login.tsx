import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NextPage } from 'next'
import Link from 'next/link';
import { RootState, AppDispatch } from "../store";
import { login } from '../store/authStore'
import Input from '../components/input'
import Button from '../components/button'
import ToastMessage from "../components/toastMessage";

import { useRouter } from "next/router";

import styles from './login.module.scss'
import { LoginPayload } from "../services/authService";

const Login: NextPage = () => {
    // Get hooks
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Setup state
    const { loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);

    // Route back to app once we are logged in
    useEffect(() => {
        if (isLoggedIn) router.push('/')
    }, [isLoggedIn])

    const [formFields, setFormFields] = useState<LoginPayload>({
        email: '',
        password: ''
    })

    // Handle submit
    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const { email, password } = formFields
        dispatch(login({ email, password }))
    }

    // Handle field updates
    const onChange = ({ key, val }: { key: string, val: string }) => {
        setFormFields({
            ...formFields,
            [key]: val
        })
    }

    return (
        <div className={styles.main}>
            <h1 className={styles.header}>
                Sign In
            </h1>
            <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
                <div className={styles.formInputs}>
                    <Input label='Email' name='email' placeholder='john.doe@gmail.com' inputType='email' onChange={onChange} />
                    <Input label='Password' name='password' inputType='password' onChange={onChange} />
                </div>
                <div className={styles.message}>
                    {loading && <ToastMessage message="Loading..." state="warning" />}
                    {message && <ToastMessage message={message} state="error" />}
                </div>
                <Button type="submit" text="Sign In" onClick={onSubmit} />
            </form>
            <div className={styles.switchAuth}>
                <Link href="/register">
                    <p>Don't have an account? Register now!</p>
                </Link>
            </div>
        </div>
    )
}

export default Login;