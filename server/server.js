const express = require('express')
const app = express()
const mongoose = require("mongoose");
const dotenv = require('dotenv').config()
const userRoute = require('./src/routes/user.routes')
const storyRoute = require('./src/routes/story.routes')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v1/user",userRoute)
app.use("/api/v1/story",storyRoute)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/health', (req, res) => {
    console.log('Server is up... :)')
    res.json({ 
        service:'Backend SwipTory Server',
        status:'ACTIVE',
        time:new Date() 
})
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'path/to/index.html'));
});


app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log(`Server is up on ${process.env.PORT} :)`))
      .catch((error) => console.log(error));
  });