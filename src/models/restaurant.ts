import { IRestaurant } from '@/interfaces/IRestaurant';

import mongoose, { Document } from 'mongoose';

const restaurant = new mongoose.Schema({
    name: String,
    qr:String,
},
    { timestamps: true },
);

export default mongoose.model<IRestaurant & Document>('restaurant', restaurant);