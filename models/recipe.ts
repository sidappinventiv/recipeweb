import mongoose, { Document, Schema } from 'mongoose';
import { catagory_schema } from './catagory';
import { user_schema} from './user';


interface ingredient {
  name: string;
  quantity: string;
}

interface direction {
  stepNo: number;
  content: string;
}

export interface Recipe_Schema extends Document {
  catagory: mongoose.Types.ObjectId | catagory_schema;
  author: mongoose.Types.ObjectId | user_schema;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: ingredient[];
  directions: direction[];
  createdAt: Date;
  updatedAt: Date;
  status: string;
  collaborators: mongoose.Types.ObjectId[] | user_schema[];
}

const recipe = new Schema<Recipe_Schema>({
  catagory: {
    type: Schema.Types.ObjectId,
    ref: 'Catagory', 
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prepTime: String,
  cookTime: String,
  totalTime: String,
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  directions: [
    {
      stepNo: Number,
      content: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'active',
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required:false
    },
  ],
});

export const Recipe = mongoose.model<Recipe_Schema>('Recipe', recipe);
