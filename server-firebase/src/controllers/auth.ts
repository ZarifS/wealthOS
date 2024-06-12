import { adminAuth } from '../utils/firebase';

export async function verifyToken(token: string): Promise<string> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error trying to verify token:', error);
    throw error;
  }
}
