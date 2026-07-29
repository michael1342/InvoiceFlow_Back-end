const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const DBSTRING: string = process.env.MONGODB_URI as string

const connectDB = async (): Promise<void> => {
    try{
        console.log('connecting to database...')
        await mongoose.connect(DBSTRING, {})
        console.log("connection to database established")

        mongoose.connection.on('disconnected', () => {
            console.warn("Database disconnected. Attempting reconnection...")
        })
        mongoose.connection.on('reconnected', () => {
            console.info("Database reconnected.")
        })
    } catch (err) {
        console.error("Error connecting to database:", err)
        process.exit(1)
    }
}

module.exports = connectDB