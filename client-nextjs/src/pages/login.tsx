import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NextPage } from 'next'
import { RootState } from "../store";

const Login: NextPage = () => {
    const dispatch = useDispatch();
    const { user, loading, isLoggedIn } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <h1>Login Below</h1>
            <form>
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" name="email" /><br />
                <label htmlFor="password">Password</label><br />
                <input type="password" id="password" name="password" /><br />
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}

export default Login;