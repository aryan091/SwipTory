const User = require("../models/user.model")
const Story = require("../models/story.model")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")

const  likeStory = asyncHandler( async (req, res) => {

    try {

        const storyId = req.params.storyId;
        const userId = req.userId;

        const story = await Story.findById(storyId);

        if (!story) {
            throw new ApiError(404, "Story not found");
        }
        
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if user have already liked it
        const isLiked = user.likes.includes(storyId);

        if (isLiked) {
            
            const userLikeIndex = user.likes.indexOf(storyId);
            user.likes.splice(userLikeIndex, 1);
      
            const storyLikeIndex = story.likes.indexOf(userId);
            story.likes.splice(storyLikeIndex, 1);
      
            // Update totalLikes count
            story.totalLikes = story.likes.length;

            await user.save();
            await story.save();

            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        story: story,
                        user : user,
                        totalLikes: story.totalLikes,
                        liked: false,
                        likes: story.likes,
                    },
                    "Story unliked successfully",
                    true
                )
            )

      
        }
        else
        {
            user.likes.push(storyId);
            story.likes.push(userId);

             // Update totalLikes count
             story.totalLikes = story.likes.length;


            await user.save();
            await story.save();

            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        story: story,
                        user : user,
                        totalLikes: story.totalLikes,
                        liked: true,
                        likes: story.likes,
                    },
                    "Story liked successfully",
                    true
                )
            )


        }


    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while liking Story" })
    }
})

module.exports = {
    likeStory
}