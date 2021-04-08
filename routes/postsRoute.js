const posts = require('../controllers/postsController')
const express = require('express')
const router = express.Router()
const fs = require('fs')

const jwtAuth = require('../middlewares/jwtAuthMiddleware')

// Cloudinary

require('dotenv').config()
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// Multer

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.claims.userId + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.post('/', [jwtAuth], uploads.single('post'), async (req, res) => {
  await cloudinary.uploader.upload('./uploads/' +
        req.claims.userId + req.file.originalname,
  async function (error, result) {
    if (error) {
      return res.status(error.http_code).send(error.message)
    }
    req.body.image = [result.secure_url]
    req.body.userId = req.claims.userId
    const response = await posts.createPost(req.body)
    fs.unlinkSync('./uploads/' + req.claims.userId + req.file.originalname)
    return res.status(response.isError ? 400 : 200).json({ response })
  })
})

router.post('/comments/', [jwtAuth], async (req, res) => {
  const response = await posts.createComment(req.body, req.claims.userId)
  return res.status(response.isError ? 400 : 200).json({ response })
})

router.get('/', [jwtAuth], async (req, res) => {
  const response = await posts.getAllPosts(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/allLatestPosts', [jwtAuth], async (req, res) => {
  const response = await posts.getAllUsersLatestPosts()
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/myLatestPost', [jwtAuth], async (req, res) => {
  const response = await posts.getMyLatestPost(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/postsOfAChallange', [jwtAuth], async (req, res) => {
  const response = await posts.getPostsOfAChallange(req.body.badgeName, req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/getPost', [jwtAuth], async (req, res) => {
  const response = await posts.getPost(req.body.postId)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router