import jwt from "jsonwebtoken"
import {ErrorHandler} from "../utils/errorHandler.js"
import User from "../models/userModel.js"

export const authentication = async (req, res, next) => {
    try {
        const {token} = req.cookies
        if(!token) return next(new ErrorHandler("You are not authorized", 401))

        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const {id} = decoded
        
        req.user = await User.findById(id)
        next()
    } catch (error) {
        next(error)
        console.log(error)
    }
};

export const authorizeRole = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)) {
            return next(new ErrorHandler("User is not allowed to access this resource"), 403)
        }
        next()
    }
}