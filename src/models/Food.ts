import { IFood } from '@/interfaces/IFood';
import mongoose from 'mongoose';

const Food = new mongoose.Schema(
  {
      name:{
        type: String,
        required: [true, 'Please enter a food name'],
        index: true,
        unique: true
      },
    price: {
      type: Number,
      unique: false,
    },
    category: {
        type: String,
        unique: false,
        index: true,
      },
      inMenu: {
        type: Boolean,
        default:false,
      },
      restaurant:{
        type:String,
        default:'Namma Sappadu'
      },
  },
  { timestamps: true },
);

export default mongoose.model<IFood & mongoose.Document>('Food', Food);
