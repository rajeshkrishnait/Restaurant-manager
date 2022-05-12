import { IOrderItems } from '@/interfaces/IOrderItems';
import mongoose from 'mongoose';

const orderItems = new mongoose.Schema(
  {
    food_id:String,
    dine_id:String,
    order_id:String,
    quantity:String,
    comment:{
      type:String,
      default:"No comments"
    },
    order_item_status:{
        type:String,
        default:"Ordered"
    },
    rating:{
      type:String,
      default:"0"
    }
  },{ timestamps: true }
);

export default mongoose.model<IOrderItems & mongoose.Document>('orderItems', orderItems);
