import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NextPage } from 'next'
import { RootState, AppDispatch } from "../store";
import { login } from '../store/authStore'
import { useRouter } from "next/router";

import styles from './login.module.scss'

const Login: NextPage = () => {
    // Get hooks
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Setup state
    const { loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle submit
    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(email, password)
        dispatch(login({ email, password }))
    }

    // Route back to app once we are logged in
    useEffect(() => {
        if (isLoggedIn) router.push('/')
    }, [isLoggedIn])


    const Message = () => {
        if (loading) return <h2>Loading...</h2>
        else if (message) return <h2>{message}</h2>
        else return null
    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1>Login Below</h1>
            </div>
            <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
                <div className={styles.formInputs}>
                    <label htmlFor="email">
                        Email:
                        <input type="email" id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </label>
                    <label htmlFor="password">
                        Password:
                        <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </label>
                </div>
                <input type="submit" value="Submit" />
            </form>
            <div className={styles.message}>
                <Message />
            </div>
        </div>
    )
}

export default Login;