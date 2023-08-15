import mongoose, { Schema } from 'mongoose';
export interface user_schema extends Document{
        name: String,
        email: String,
        password: String,
        bio: String,
        website: String,
        socialLink: String,
        profileImg: Buffer,
        createdAt: Date,
        updatedAt: Date,
        status: String,
}
const user = new Schema<user_schema>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio:{
    type:String,
    required:false,
  },
  website:{ type:String,
    required:false,},

  socialLink: {
    type: String,
    enum: ['inst', 'fb', 'others'],
  },
  profileImg: {type:Buffer,
},
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
});

export const User = mongoose.model<user_schema>('User', user);

