import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { IOtp } from '@/interfaces/IOtp';
import { IDine } from '@/interfaces/IDine';
import {IRestaurantRole} from '@/interfaces/IRestaurantRole';
import {IFood} from '@/interfaces/IFood';
import {IRestaurant} from '@/interfaces/IRestaurant';
import {IOrder} from '@/interfaces/IOrder'
import {IOrderItems} from '@/interfaces/IOrderItems'

declare global {
  namespace Express {
    export interface Request {
      currentUser: IRestaurantRole & Document;
      resToken: object;
      dineToken:object;
      otpToken:object;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type RestaurantRoleModel = Model<IRestaurantRole & Document>;
    export type OtpModel = Model<IOtp & Document>;
    export type DineTableModel = Model<IDine & Document>;
    export type FoodModel = Model<IFood & Document>;
    export type RestaurantModel = Model<IRestaurant & Document>;
    export type OrderModel = Model<IOrder & Document>;
    export type OrderItemModel = Model<IOrderItems & Document>
  }
}
