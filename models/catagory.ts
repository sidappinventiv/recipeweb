import mongoose, { Schema } from "mongoose";
export interface catagory_schema extends Document{
    name:String,
    subcategories?: string[];
    createdAt:Date,
    updatedAt:Date,
    status:String,
}

const catagory = new Schema<catagory_schema>({

name:{
    type:String,required:true
},
subcategories: [{
  type: String,
}],
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

})
export const Catagory = mongoose.model<catagory_schema>('catagory', catagory);
