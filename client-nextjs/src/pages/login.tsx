import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NextPage } from 'next'
import { RootState, AppDispatch } from "../store";
import { login } from '../store/authStore'

const Login: NextPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, isLoggedIn, message } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(email, password)
        dispatch(login({ email, password }))
    }

    const Loading = () => (
        <>
            {loading ? <div>Loading..</div> : null}
        </>
    )

    const Error = () => (
        <div>{message}</div>
    )


    return (
        <>
            <h1>Login Below</h1>
            <form onSubmit={(event) => onSubmit(event)}>
                <label htmlFor="email">
                    Email:
                    <input type="email" id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <Loading />
            <Error />
        </>
    )
}

export default Login;