// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';
import { User } from '../../controllers/user';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
