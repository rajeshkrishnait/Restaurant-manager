import { IOrder } from '@/interfaces/IOrder';
import mongoose from 'mongoose';

const order = new mongoose.Schema(
  {
    order_id:{
        type:String,
        unique:true
    },
    email_id:{
        type:String,
    },
    dine_id:String,
    total:Number,
    order_status:{
        type:String,
        default:true
    },
    payment_status:{
        type:String,
        default:false
    }
  },{ timestamps: true }
);

export default mongoose.model<IOrder & mongoose.Document>('order', order);
