import { IToken } from '@/interfaces/IToken';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  _Id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});
module.exports = mongoose.model<IToken & mongoose.Document>("Token", tokenSchema);
