import { IDine } from '@/interfaces/IDine';
import mongoose from 'mongoose';

const dineTable = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    status: {
        type: Boolean,
        default: true,
      },
      qrCode: {
        type: String,
        unique:true,
      },

  },
  { timestamps: true },
);

export default mongoose.model<IDine & mongoose.Document>('dineTable', dineTable);
