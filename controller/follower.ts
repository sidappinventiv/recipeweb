import { Context } from 'koa';
import { Following,User } from '../models/allmodels';
import mongoose from 'mongoose';

export const addFollower = async (ctx: Context) => {
  try {
    const { follower, following} = ctx.request.body as {
      follower: mongoose.Types.ObjectId;
      following: mongoose.Types.ObjectId;
    };

    if (!follower || !following) {
      ctx.status = 400;
      ctx.body = { error: 'Both followerId and followingId are required' };
      return;
    }
    const follower1 = await User.findById(follower);
    const following1 = await User.findById(following);

    if (!follower1 || !following1) {
      ctx.status = 404;
      ctx.body = { error: 'One or both users not found' };
      return;
    }

   
    const newFollowing = new Following({
      follower: follower1._id,
      following: following1._id,
    });

    await newFollowing.save();

    ctx.status = 201;
    ctx.body = { message: 'Follower added successfully' };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};



export const getFollowers = async (ctx: Context) => {
  try {
    const { user_id } = ctx.params;
    if (!user_id) {
      ctx.status = 400;
      ctx.body = { error: 'userId is required' };
      return;
    }
    console.log('Fetching followers for userId:', user_id);
    const followers = await Following.find({ following: user_id }).populate('follower');
    console.log('Followers found:', followers);
    ctx.status = 200;
    ctx.body = { followers };
    
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};


export const checkFollowerStatus = async (ctx: Context) => {
  try {
    const { follower, following } = ctx.query;
    if (!follower || !following) {
      ctx.status = 400;
      ctx.body = { error: 'Both follower and following parameters are required' };
      return;
    }

    const isFollowing = await Following.exists({ follower, following });
    
    ctx.status = 200;
    ctx.body = { isFollowing, notFollowing: !isFollowing };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};





export const removeFollower = async (ctx: Context) => {
  try {
    const { follower, following } = ctx.request.body as {
      follower: mongoose.Types.ObjectId;
      following: mongoose.Types.ObjectId;
    };

    if (!follower || !following) {
      ctx.status = 400;
      ctx.body = { error: 'Both followerId and followingId are required' };
      return;
    }

    const followerUser = await User.findById(follower);
    const followingUser = await User.findById(following);

    if (!followerUser || !followingUser) {
      ctx.status = 404;
      ctx.body = { error: 'One or both users not found' };
      return;
    }

  
    const removedFollowing = await Following.findOneAndDelete({
      follower: followerUser._id,
      following: followingUser._id,
    });

    if (!removedFollowing) {
      ctx.status = 404;
      ctx.body = { error: 'Follower relationship not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'User unfollowed successfully' };
  } catch (error) {
    console.error('An error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred' };
  }
};


export const getMutualFollowers = async (ctx: Context) => {
  try {
    const { user1_id, user2_id } = ctx.query;
    if (!user1_id || !user2_id) {
      ctx.status = 400;
      ctx.body = { error: 'user1id and user2id are required' };
      return;
    }
    const followersUser1 = await Following.find({ following: user1_id }).distinct('follower');   
   const followersUser2 = await Following.find({ following: user2_id }).distinct('follower');
    const mutualfollowers = followersUser1.filter(userId => followersUser2.includes(userId));
    ctx.status = 200;
    ctx.body = { mutualfollowers };
  } catch (error) {
    console.error('error occurred:', error);
    ctx.status = 500;
    ctx.body = { error: 'error occurred' };
  }
};
