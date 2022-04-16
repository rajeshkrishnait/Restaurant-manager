import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { IOtp } from '@/interfaces/IOtp';
import { IDine } from '@/interfaces/IDine';
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
    export type OtpModel = Model<IOtp & Document>;
    export type DineTableModel = Model<IDine & Document>;
  }
}
