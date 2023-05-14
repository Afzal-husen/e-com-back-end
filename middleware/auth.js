import jwt from "jsonwebtoken"
import {ErrorHandler} from "../utils/errorHandler.js"
import User from "../models/userModel.js"

export const authentication = async (req, res, next) => {
    try {
        const {access_token} = req.cookies
        if(!access_token) return next(new ErrorHandler("You are not authorized", 401))

        const decoded = jwt.verify(access_token, process.env.JWT_KEY)
        const {id} = decoded
        
        req.user = await User.findById(id)
        next()
    } catch (error) {
        next(error)
        console.log(error)
    }
};
