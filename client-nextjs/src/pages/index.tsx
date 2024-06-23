import type { NextPage } from 'next';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import UserService from '../services/userService';
import SpacesService from '../services/spacesService';
import Label from 'components/ui/label';
import { useToast } from 'components/ui/toast';

interface Space {
  name: string;
  description: string;
  users?: { [userId: string]: 'viewer' | 'editor' };
  type: 'private' | 'public' | 'protected';
}

const CreateNewSpaceDialogWithButton = ({ onCreateSpace }: { onCreateSpace: (name: string, description: string) => void }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [name, description])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Space</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Space</DialogTitle>
          <DialogDescription>
            Spaces are where you track your spendings. You can create a new space for work, personal, or family etc.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Personal"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Tracks my personal spendings."
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Render error if shown */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={() => {
            if (!name || !description) {
              setError('Please fill all fields.');
              return;
            }
            onCreateSpace(name, description);
          }}>Add Space</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const EmptySpacesState = ({ user, handleCreateSpace, handleLogout }: {
  user: any,
  handleCreateSpace: (name: string, description: string) => void,
  handleLogout: () => void
}) => {
  return (
    <div className='flex flex-col w-100 h-[100vh] items-center justify-center'>
      <div className='m-4 text-center'>
        <h2 className='text-3xl mb-2'>Welcome, {user?.firstName}.</h2>
        <p className='text-md'>Let's begin by adding a new space to track your spendings.</p>
      </div>
      <div className='flex gap-2'>
        <CreateNewSpaceDialogWithButton onCreateSpace={handleCreateSpace} />
        <Button variant='secondary' className='w-48' onClick={() => handleLogout()}>Log Out</Button>
      </div>
    </div>
  )
}


const Home: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await UserService.getUserData(token);
        setUser(response.data);
        setLoading(false);
      }
      else {
        router.push('/login');
      }
    } catch (error: Error | any) {
      console.log('Error fetching user data:', error);
      handleLogout();
    }
  }

  // Redirect to login if not logged in or token is invalid
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && user.spaces && user.spaces.length > 0) {
      console.log('User spaces:', user.spaces);
      router.push(`/spaces/${user.spaces[0]}`);
    }
  }, [user]);

  const handleCreateSpace = async (name: string, description: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }
      toast({
        title: 'Creating space...',
      });
      await SpacesService.createSpace(token, { name, description });
      toast({
        title: 'Space created successfully.',
      });
      // Refetch user data to update spaces
      fetchUserData();
    } catch (error: Error | any) {
      console.log('Error creating space:', error);
      toast({
        title: 'Error creating space.',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  if (loading || !user) {
    return <h1>Loading...</h1>
  }

  if (!user.spaces || user.spaces.length === 0) {
    return <EmptySpacesState user={user} handleCreateSpace={handleCreateSpace} handleLogout={handleLogout} />
  }
};



export default Home;
