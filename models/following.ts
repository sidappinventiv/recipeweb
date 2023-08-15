import mongoose, { Document, Schema } from 'mongoose';
import { user_schema } from './user';

export interface Following_schema extends Document {
  follower: mongoose.Types.ObjectId | user_schema;
  following: mongoose.Types.ObjectId | user_schema;
  createdAt: Date;
  updatedAt: Date;
}

const following= new Schema<Following_schema>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Following = mongoose.model<Following_schema>('Following', following);
