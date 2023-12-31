import mongoose, { Schema } from 'mongoose';
export interface user_schema extends Document{
        name: String,
        email: String,
        password: String,
        bio: String,
        website?: String,
        socialLink: {
          facebook?: string;
          twitter?: string;
          others?: string;
        };
        profileImg: Buffer,
        createdAt: Date,
        updatedAt: Date,
        status: String,
        otpVerify: 'pending' | 'verified',
        
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
      facebook: String,
      twitter: String,
      others: String,
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
  otpVerify: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending',
  },
});

export const User = mongoose.model<user_schema>('User', user);

