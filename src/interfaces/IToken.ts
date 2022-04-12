import { Types } from "mongoose";

export interface IToken{
    _Id:Types.ObjectId;
    token:String;
    createdAt:Date;
}