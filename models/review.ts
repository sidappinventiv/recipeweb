import mongoose, { Document, Schema } from 'mongoose';
import { Recipe_Schema } from './recipe';
import { user_schema } from './user';


export interface Review_schema extends Document {
  rating: number;
  recipeId: mongoose.Types.ObjectId | Recipe_Schema;
  userId:mongoose.Types.ObjectId |  user_schema;
  likes: number;
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const review = new Schema<Review_schema>({
  rating: {
    type: Number,
    required: true,
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [String],
    default: [],
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

export const Review = mongoose.model<Review_schema>('Review', review);
