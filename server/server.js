const express = require("express")
const morgan = require("morgan")
const body_parser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// mongo
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then(() => { console.log(`MongoDB connected`) })
        .catch(err => { console.log(err) })

// import routes
const authRouter = require("./routers/auth")
const userRouter = require('./routers/user')

// middleware
app.use(morgan('dev'))
app.use(body_parser.json())
// app.use(cors({}))
app.use(cors({
    origin: process.env.CLIENT_URL
}))
app.use('/api', authRouter)
app.use('/api', userRouter)


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`listening ${PORT}. Frontend: ${process.env.CLIENT_URL}`)
})
