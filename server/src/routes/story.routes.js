const express = require('express')
const router = express.Router()
const storyController = require('../controllers/story.controller.js')
const {verifyToken} = require('../middlewares/verifyJwtToken')
const likeController = require('../controllers/like.controller')

router.post( "/create", verifyToken , storyController.createStory)
router.post( "/my-stories", verifyToken , storyController.getMyStories)
router.put( "/update/:storyId", verifyToken , storyController.updateStory)
router.get( "/all-stories" , storyController.getAllStories)
router.get( "/category/:category" , storyController.getStoriesByCategory)
router.get( "/view-story/:storyId" , storyController.viewStory)

router.post("/like/:storyId", verifyToken, likeController.likeStory)


module.exports = router