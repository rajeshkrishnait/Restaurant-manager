import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import {IRestaurantRole} from '@/interfaces/IRestaurantRole';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IRestaurantRole & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type RestaurantRoleModel = Model<IRestaurantRole & Document>;
  }
}
