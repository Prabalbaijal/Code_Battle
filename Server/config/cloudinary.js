import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import fs from "fs"

dotenv.config({})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_secret:process.env.CLOUDINARY_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY
})
export const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response=cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        return response
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null
    }
}

export default cloudinary