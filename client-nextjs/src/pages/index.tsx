import type { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '../store';
import { fetchUserData } from '../store/userStore';

const Home: NextPage = () => {
  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redirect to login if not logged in or token is invalid
  useEffect(() => {
    if (!isLoggedIn || error) {
      router.push('/login');
    }
    else {
      dispatch(fetchUserData(token as string));
    }
  }, [isLoggedIn, router, token, error, dispatch]);

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
    </div>
  );
};

export default Home;
