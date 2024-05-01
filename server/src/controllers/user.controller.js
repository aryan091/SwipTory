const User = require("../models/user.model")
const asyncHandler = require("../utils/asyncHandler")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decodeJwtToken , verifyToken } = require("../middlewares/verifyJwtToken")

const registerUser = asyncHandler( async (req , res) => {

    try {
        // get user details from frontend

        const { username, password } = req.body
    
        // validation - not empty
    
        if (
            [ username, password].some((field) => field?.trim() === "")
        ) {
            return res.status(401).json({ success: false, message: "All Fields are required" })        }
    
        // check if user already exists: username, email
    
        const existedUser = await User.findOne({ username })
    
        if(existedUser)
        {
            return res.status(401).json({ success: false, message: "User already exists" })
        }
    
        const hashedPassword = await bcrypt.hashSync(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();
            
        // remove password and refresh token field from response
    
        const createdUser = await User.findById(user._id).select(
            "-password "
        )
    
        // check for user creation
    
        if(!createdUser)
        {
            return res.status(401).json({ success: false, message: "Failed to create user" })
        }
    
        // return res
    
        return res.status(201).json(
            new ApiResponse(200,"User registered Successfully", createdUser, true) 
        )
    } catch (error) {
      
        return res.status(401).json({ success: false, message: "User registration failed" })

    }
 

})

const loginUser = asyncHandler( async (req , res) => {
    try {
        const { username, password } = req.body;
    
        if (
            [ username, password].some((field) => field?.trim() === "")
        ) {
            return res.status(401).json({ success: false, message: "All Fields are required" })        }
    
        const user = await User.findOne({ username });
    
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found! " })
        } 

          //  compare password
          const comparePassword = await bcrypt.compare(password, user.password);
          if (!comparePassword)
          return res.status(401).json({ success: false, message: "Invalid Credentials" })
          
    
          // generate token
          const token = jwt.sign({userId: user?._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "10d",
          });




          const loggedInUser = await User.findById(user._id).select("-password")

          //console.log("Logged In User - ",loggedInUser)

          
        
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "User logged in successfully",
                {
                    user : loggedInUser,
                    token:token
                },
                
                true
            )
        )
    }
       catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: "Error while logging in " })
    }
    
})


const getUserProfile = asyncHandler( async (req, res) => {
    try {
        const userId = decodeJwtToken(req.headers["authorization"]);

        if (!userId) {
            return res.status(401).json({ success: false, message: "User Not logged in" })
        }

        const user = await User.findById(userId).select(
            "-password "
        );
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User Not found " })
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse
            (
                200, 
                "User profile fetched successfully", 
                user, 

                true
            )
        )

        
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: "Error while fetching User profile " })

    }
})

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}