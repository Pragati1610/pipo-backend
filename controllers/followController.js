const { Follow } = require('../models/relations')
const logger = require('../logging/logger')

class FollowController {
  static async followSomeone (userId, followWhomId) {
    try {
      if (userId === followWhomId) {
        return { message: "You can't follow yourself", isError: true }
      }
      const isPresent = await Follow.findOne({
        where: {
          followerId: userId,
          followingId: followWhomId
        }
      })
      if (isPresent) {
        return { message: 'You already follow this person' }
      }
      const follow = {
        followerId: userId,
        followingId: followWhomId,
        isFriend: false
      }
      const followCreated = await Follow.create(follow)
      return followCreated
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async makeFriend (userId, makeFriendId) {
    try {
      if (userId === makeFriendId) {
        return { message: "You can't make yourself a friend", isError: true }
      }
      const getFollow1 = await Follow.findOne({
        where: {
          followerId: userId,
          followingId: makeFriendId
        }
      })
      const getFollow2 = await Follow.findOne({
        where: {
          followerId: makeFriendId,
          followingId: userId
        }
      })

      let follow,
        friend1Created,
        friend2Created

      if (!getFollow1) {
        follow = {
          followerId: userId,
          followingId: makeFriendId,
          isFriend: true
        }
        friend1Created = await Follow.create(follow)
      } else {
        follow = {
          isFriend: true
        }
        friend1Created = await Follow.update(follow, {
          where: {
            followerId: userId,
            followingId: makeFriendId
          }
        })
      }
      if (!getFollow2) {
        follow = {
          followerId: makeFriendId,
          followingId: userId,
          isFriend: true
        }
        friend2Created = await Follow.create(follow)
      } else {
        follow = {
          isFriend: true
        }
        friend2Created = await Follow.update(follow, {
          where: {
            followerId: makeFriendId,
            followingId: userId
          }
        })
      }
      return { friend1Created, friend2Created }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllFollowers (userId) {
    try {
      const followers = await Follow.findAll({ where: { followingId: userId } })
      return followers
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllFollowing (userId) {
    try {
      console.log(userId)
      const following = await Follow.findAll({ where: { followerId: userId } })
      return following
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async stopFollowing (userId, followWhomId) {
    try {
      const ifExists = await Follow.findOne({
        where: {
          followerId: userId,
          followingId: followWhomId
        }
      })
      if (ifExists) {
        const deletedFollow = await Follow.destroy({
          where: {
            followerId: userId,
            followingId: followWhomId
          }
        })
        return { deletedFollow }
      } else {
        return {
          isError: true,
          message: "relation doesn't exist"
        }
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async stopFollower (userId, followerId) {
    try {
      const ifExists = await Follow.findOne({
        where: {
          followerId: followerId,
          followingId: userId
        }
      })
      if (ifExists) {
        const deletedFollower = await Follow.destroy({
          where: {
            followerId: followerId,
            followingId: userId
          }
        })
        return { deletedFollower }
      } else {
        return {
          isError: true,
          message: "relation doesn't exist"
        }
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = FollowController