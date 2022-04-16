import { IOtp } from '@/interfaces/IOtp';

import mongoose, { Document } from 'mongoose';

const Otp = new mongoose.Schema({
    otp: String,
    expiration_time:Date,
    verified: {
        type: Boolean,
    },
},
    { timestamps: true },
);

export default mongoose.model<IOtp & Document>('Otp', Otp);