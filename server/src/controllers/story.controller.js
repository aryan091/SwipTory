const User = require("../models/user.model")
const asyncHandler = require("../utils/asyncHandler")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const Story = require("../models/story.model")
const { decodeJwtToken } = require("../middlewares/verifyJwtToken")
const { ObjectId } = require('mongodb');


const createStory = asyncHandler( async (req, res) => {

    try {

        const {slides , addedBy} = req.body;

        const isValid = slides.every(slide => 
            slide.heading && slide.description && slide.imageUrl && slide.category
          );
      
          if (!isValid)
          {
            console.log(error)
            throw new ApiError(401, "All slides must have a heading, description, image URL, and category")
          }

          const userId = req.userId;


        const story = new Story({
            slides,
            addedBy : userId
        })

        const savedStory = await story.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    story : savedStory,
                    addedBy
                },
                "Story Created Successfully",
                true
            )
        )
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while Creating Story" })

    }
})

const getMyStories = asyncHandler( async (req, res) => {
    
    try {
        // Extract the userId from the request
        const userId = decodeJwtToken(req.headers["authorization"]);

        if (!userId) {
            throw new ApiError(401, "User not found");
        }
        // Fetch stories added by the authenticated user
        const userStories = await Story.find({ addedBy: userId });

        const userData = await User.findById(userId);
        const userIdString = userData._id.toString();
        

        if (!userStories) {
            throw new ApiError(401, "No user stories found");
        }

        const updatedStories = userStories.map(story => {
            return {
                ...story.toObject(),
                isEditable: true // Set isEditable to true for the current user's stories
            };
        });

        // Respond with the user's stories
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    stories: updatedStories
                },
                "User Stories Fetched Successfully",
                true
            )
        );
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while getting User Story" })

    }
})


const getAllStories = asyncHandler(async (req, res) => {
    try {
        // Fetch the category from the query parameters
        const category = req.query.category;

        // Define the filter object
        let filter = {};

        // If category is 'all', fetch all stories
        if (category === 'all') {
            // Fetch all stories from the database
            const allStories = await Story.find();

            // Respond with all stories
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        stories: allStories
                    },
                    "All Stories Fetched Successfully",
                    true
                )
            );
        } else {
            // Fetch stories based on the provided category
            filter = { "slides.category": category };
        }

        // Fetch stories based on the filter
        const filteredStories = await Story.find(filter);

        // Respond with the filtered stories
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    stories: filteredStories
                },
                "Stories Fetched Successfully",
                true
            )
        );
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while fetching Stories" })

    }
});



const getStoriesByCategory = asyncHandler(async (req, res) => {
    try {
        // Extract the category from the request
        const category = req.params.category;

        // Fetch stories based on the category from the database
        const storiesByCategory = await Story.find({ "slides.category": category });
        // Respond with stories filtered by category
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    stories: storiesByCategory
                },
                `Stories in category ${category} Fetched Successfully`,
                true
            )
        );
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while fetching Stories by category" })
    }
});

const viewStory = asyncHandler(async (req, res) => {
    try {
        // Extract the storyId from the request
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);

        if (!story) {
            throw new ApiError(404, "Story not found");
        }

        // Respond with the fetched story
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    story
                },
                "Story Fetched Successfully",
                true
            )
        );


        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Cannot able to view Story" })

    }
})

const updateStory = asyncHandler(async (req, res) => {
    try {
        // Extract the storyId from the request
        const storyId = req.params.storyId; 

        
        const { slides } = req.body;

        if (!slides ) {
            throw new ApiError(401, "Please provide all the required fields");
        }

        const story = await Story.findById(storyId);

        if (!story) {
            throw new ApiError(401, "Story not found");
        }
        // update story
        story.slides = slides;

        await story.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    story: story
                },
                "Story Updated Successfully",
                true
            )
        );


    
    
    } catch (error) {
        return res.status(401).json({ success: false, message: "Error while updating Story" })

    }
})

module.exports = {
    createStory,
    getMyStories,
    getAllStories,
    getStoriesByCategory,
    viewStory,
    updateStory
}