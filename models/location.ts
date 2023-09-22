// import { Recipe } from "./recipe";
// import geocoder from 'geocoder';
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const userLocationSchema = new Schema({
//   location: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       required: true,
//     },
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//     formattedAddress:String
//   },
//   userId: {
//     type: String, 
//     required: true,
//   },
//   createdAt:{
//     type:Date,
//     default:Date.now
//   }
// });

// Recipe.prependListener('save',async function(next){
//     const loc = await geocoder.geocode(this.formattedAddress)
// })


// const UserLocation = mongoose.model('UserLocation', userLocationSchema);
