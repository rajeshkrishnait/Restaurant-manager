import { IRestaurantRole } from '@/interfaces/IRestaurantRole';
import mongoose from 'mongoose';

const RestaurantRole = new mongoose.Schema(
  {
      username:{
        type: String,
        required: [true, 'Please enter a User name'],
        index: true,
        unique: true
      },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    status: {
        type: Boolean,
        default:true
      },
      phone: {
        type: Number,
        required: [true, 'Please enter a phone number'],
      },
    password: String,

    salt: String,

    role: {
      type: String,
      default: 'Manager',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRestaurantRole & mongoose.Document>('RestaurantRole', RestaurantRole);
