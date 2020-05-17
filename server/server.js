const express = require("express")
const morgan = require("morgan")
const body_parser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// import routes
const auth_router = require("./routers/auth")

// middleware
app.use(morgan('dev'))
app.use(body_parser.json())
app.use(cors())
app.use('/', auth_router)


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`listening ${PORT}`)
})
