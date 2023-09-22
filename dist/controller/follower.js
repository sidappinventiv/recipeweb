"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutualFollowers = exports.removeFollower = exports.checkFollowerStatus = exports.getFollowers = exports.addFollower = void 0;
const allmodels_1 = require("../models/allmodels");
const addFollower = async (ctx) => {
    try {
        const { follower, following } = ctx.request.body;
        if (!follower || !following) {
            ctx.status = 400;
            ctx.body = { error: 'Both followerId and followingId are required' };
            return;
        }
        const follower1 = await allmodels_1.User.findById(follower);
        const following1 = await allmodels_1.User.findById(following);
        if (!follower1 || !following1) {
            ctx.status = 404;
            ctx.body = { error: 'One or both users not found' };
            return;
        }
        const newFollowing = new allmodels_1.Following({
            follower: follower1._id,
            following: following1._id,
        });
        await newFollowing.save();
        ctx.status = 201;
        ctx.body = { message: 'Follower added successfully' };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.addFollower = addFollower;
const getFollowers = async (ctx) => {
    try {
        const { user_id } = ctx.params;
        if (!user_id) {
            ctx.status = 400;
            ctx.body = { error: 'userId is required' };
            return;
        }
        console.log('Fetching followers for userId:', user_id);
        const followers = await allmodels_1.Following.find({ following: user_id }).populate('follower');
        console.log('Followers found:', followers);
        ctx.status = 200;
        ctx.body = { followers };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.getFollowers = getFollowers;
const checkFollowerStatus = async (ctx) => {
    try {
        const { follower, following } = ctx.query;
        if (!follower || !following) {
            ctx.status = 400;
            ctx.body = { error: 'Both follower and following parameters are required' };
            return;
        }
        const isFollowing = await allmodels_1.Following.exists({ follower, following });
        ctx.status = 200;
        ctx.body = { isFollowing, notFollowing: !isFollowing };
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.checkFollowerStatus = checkFollowerStatus;
const removeFollower = async (ctx) => {
    try {
        const { follower, following } = ctx.request.body;
        if (!follower || !following) {
            ctx.status = 400;
            ctx.body = { error: 'Both followerId and followingId are required' };
            return;
        }
        const followerUser = await allmodels_1.User.findById(follower);
        const followingUser = await allmodels_1.User.findById(following);
        if (!followerUser || !followingUser) {
            ctx.status = 404;
            ctx.body = { error: 'One or both users not found' };
            return;
        }
        const removedFollowing = await allmodels_1.Following.findOneAndDelete({
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
    }
    catch (error) {
        console.error('An error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred' };
    }
};
exports.removeFollower = removeFollower;
const getMutualFollowers = async (ctx) => {
    try {
        const { user1_id, user2_id } = ctx.query;
        if (!user1_id || !user2_id) {
            ctx.status = 400;
            ctx.body = { error: 'user1id and user2id are required' };
            return;
        }
        const followersUser1 = await allmodels_1.Following.find({ following: user1_id }).distinct('follower');
        const followersUser2 = await allmodels_1.Following.find({ following: user2_id }).distinct('follower');
        const mutualfollowers = followersUser1.filter(userId => followersUser2.includes(userId));
        ctx.status = 200;
        ctx.body = { mutualfollowers };
    }
    catch (error) {
        console.error('error occurred:', error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred' };
    }
};
exports.getMutualFollowers = getMutualFollowers;
