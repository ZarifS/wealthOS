import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RootState } from '../store';

const Home: NextPage = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="">
      <h1>wealthOS</h1>
    </div>
  );
};

export default Home;
