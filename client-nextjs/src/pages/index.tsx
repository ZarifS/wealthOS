import type { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '../store';
import { fetchUserData } from '../store/userStore';
import { Button } from '../components/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'components/dialog';

const Home: NextPage = () => {
  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redirect to login if not logged in or token is invalid
  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login');
    }
    else {
      dispatch(fetchUserData(token as string));
    }
  }, [isLoggedIn, router, token, error, dispatch]);

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className='flex flex-col w-100 h-[100vh] items-center justify-center'>
      <div className='m-4 text-center'>
        <h2 className='text-3xl mb-2'>Welcome, {user?.firstName}.</h2>
        <p className='text-md'>Let's begin by adding a new space to track your spendings.</p>
      </div>
      <div className='flex gap-2'>
        <Dialog>
          <DialogTrigger>
            <Button className='w-48'>Add New Space</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button variant='secondary' className='w-48'>Log Out</Button>
      </div>
    </div>
  );
};



export default Home;
