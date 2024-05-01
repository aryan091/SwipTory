const express = require('express')
const router = express.Router()
const authController = require('../controllers/user.controller.js')
const { verifyToken } = require('../middlewares/verifyJwtToken.js')
const bookmarkController = require('../controllers/bookmark.controller.js')

router.post( "/register", authController.registerUser )
router.post( "/login", authController.loginUser )

router.post("/bookmark/:storyId", verifyToken, bookmarkController.bookmarkStory)
router.post("/remove_bookmark/:storyId", verifyToken, bookmarkController.unbookmarkStory)
router.post("/bookmarks", verifyToken, bookmarkController.getAllBookmarks)
router.get('/bookmark_status/:storyId' , verifyToken, bookmarkController.getStoryBookmarkStatus)
router.get('/profile' , verifyToken, authController.getUserProfile)




module.exports = router