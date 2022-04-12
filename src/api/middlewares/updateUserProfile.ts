import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';
import user from '../routes/user';


const updateUserProfile = async (req, res, next) => {
  const Logger : Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.token._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    userRecord.email = (!req.body.email)?userRecord.email:req.body.email
    userRecord.name = (!req.body.name)?userRecord.name:req.body.name
    await userRecord.save();
    return next();
  } catch (e) {
    Logger.error('Error updating user profile: %o', e);
    return next(e);
  }
};

export default updateUserProfile;
