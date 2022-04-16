import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';
import user from '../routes/user';


export default async function checkRole (req, role, next) {
  const Logger : Logger = Container.get('logger');
  try {
    const currentRole = req.token.role;
    if(currentRole!==role){
       return false;
    }
    return true;
  } catch (e) {
    Logger.error('Error finding role of user to req: %o', e);
    return next(e);
  }
};

