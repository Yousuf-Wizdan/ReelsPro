import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { IVideo, VideoModel } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        await dbConnect()
        const videos = await VideoModel.find({}).sort({createdAt: -1}).lean()

        if(!videos || videos.length === 0){
            return NextResponse.json([], {status: 200})
        }

        return NextResponse.json(videos)
    }catch(err){
        return NextResponse.json({
            error: 'Failed to fetch videos'
        } , {status: 200})
    }
}

export async function POST(requst: NextRequest){

    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({
                error: "Unauthenticated User"
            }, {status: 401})
        }

        await dbConnect()
        const body:IVideo = await requst.json()

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl 
        ){
            return NextResponse.json({
                error: 'Missing Required Feild',
            } , {status: 400})
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await VideoModel.create(videoData)
        return NextResponse.json(newVideo)

    }catch(err){
        return NextResponse.json({
            error: "Failed to create a video"
        } , {status: 200})
    }
}