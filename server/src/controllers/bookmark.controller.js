const User = require("../models/user.model")
const Story = require("../models/story.model")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { decodeJwtToken } = require("../middlewares/verifyJwtToken")

const bookmarkStory = asyncHandler(async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const userId = decodeJwtToken(req.headers["authorization"]);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "User Not found " })
        }

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(401).json({ success: false, message: "Story Not found " })
        }

        // Check if story already bookmarked
    if (user.bookmarks.includes(storyId)) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    story: story,
                    user : user,
                    bookmarks: user.bookmarks,
                    bookmarked: true
                    
                },
                "Story already bookmarked",
                true
            )
        )
    }

    // Add story to bookmarks
    user.bookmarks.push(storyId);
    await user.save();

    // Keep track which story was bookmarked by which user
    story.bookmarks.push(userId);

    if (story.addedBy === userId) {
        story.isEditable = true;
    }


    await story.save();

    return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        story: story,
                        user : user,
                        bookmarks: user.bookmarks,
                        bookmarked: true                  
                    },
                    "Story bookmarked successfully",
                    true
                )
            )


    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while bookmarking the story " })

    }
})

const getStoryBookmarkStatus = asyncHandler(async (req, res) => {
    try {

        const storyId = req.params.storyId;
        const userId = decodeJwtToken(req.headers["authorization"]);

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User Not found " })
        }
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        bookmarked: false
                    },
                    "Story not found",
                    true
                )
            )
        }
        
        const bookmarked = user.bookmarks.includes(storyId);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    bookmarked: bookmarked
                },
                "Fetched bookmark status successfully",
                true
            )
        )

    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while getting bookmark status the story " })

    }
})

const unbookmarkStory = asyncHandler(async (req, res) => {
    try {
        
        const storyId = req.params.storyId;
        const userId = decodeJwtToken(req.headers["authorization"]);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "User Not found " })
        }

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(401).json({ success: false, message: "Story Not found " })
        }

        // Check if story already unbookmarked
    if (!user.bookmarks.includes(storyId)) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    story: story,
                    user : user,
                    bookmarks: user.bookmarks,
                    bookmarked: false
                    
                },
                "Story already unbookmarked",
                true
            )
        )
    }

    // Remove story from bookmarks

    const indexUser = user.bookmarks.indexOf(storyId);
    console.log("userIndex - ",indexUser);
if (indexUser !== -1) {
    user.bookmarks.splice(indexUser, 1);
}

const indexStory = story.bookmarks.indexOf(userId);
console.log("StoryIndex - ",indexStory);

if (indexStory !== -1) {
    story.bookmarks.splice(indexStory, 1);  
}

await story.save();
await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                story: story,
                user : user,
                bookmarks: user.bookmarks,
                bookmarked: false
                
            },
            "Story unbookmarked successfully",
            true
        )
    )



    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while Unbookmarking the story " })

    }
})

const getAllBookmarks = asyncHandler(async (req, res) => {
    try {

        const userId = decodeJwtToken(req.headers["authorization"]);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "User Not found " })
        }

        // Get the user's bookmarked story IDs
        const bookmarkedStoryIds = user.bookmarks;

        // Find the stories with IDs matching the user's bookmarks,
        // sorted by createdAt field in descending order (newest first)
        const bookmarks = await Story.find({ _id: { $in: bookmarkedStoryIds } })
                                             .sort({ createdAt: -1 });
        
        
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        bookmarks            
                    },
                    "Fetched bookmarked successfully",
                    true
                )
            )



        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while fetching bookmarks " })

    }
})


module.exports = {
    bookmarkStory,
    unbookmarkStory,
    getAllBookmarks,
    getStoryBookmarkStatus
}