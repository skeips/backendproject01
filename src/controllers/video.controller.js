import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (!title || !description) {
        throw new ApiError(400, "title or description is required")
        
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    console.log(videoLocalPath);

    const thumbnailLoacalPath = req.files.thumbnail[0].path;
    
    if (!thumbnailLoacalPath){ 
        throw new ApiError (400, "Thumbnail file is required")
    }

    if (!videoLocalPath){
        throw new ApiError (400, "Video file is required")
        
    }

    const uploadvideoResponse = await uploadOnCloudinary(videoLocalPath)
    const thumbnailResponse = await uploadOnCloudinary(thumbnailLoacalPath)
    console.log(uploadvideoResponse.duration);

    if (!uploadvideoResponse) {
        throw new ApiError(400, "Video file is required")
        
    }

        // Extract duration from the Cloudinary response
    const duration = uploadvideoResponse.duration; 

    const video = await Video.create({
        title,
        description,
        videoFile: uploadvideoResponse.url,
        thumbnail: thumbnailResponse.url,
        duration
    })

    const uploadedVideo = await Video.findById(video._id)

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong when uploading video on server")
        
    }

    return res
    .status(201)
    .json(
        new ApiResponse (200, uploadedVideo, "Video Uploaded Successfully")
    )



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}