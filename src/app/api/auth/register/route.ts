import { NextRequest , NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { userSchema } from "@/schemas/userSchema";

export async function POST(req: NextRequest){
    try{
        const data =  await req.json()

        const {success} = userSchema.safeParse(data)
        if(!success){
            return NextResponse.json({
                error: "Zod Validation Failed"
            }, {status: 404})
        }
        const {email , password} = data

        await dbConnect();

        const existingUser = await UserModel.findOne({email})

        if(existingUser){
            return NextResponse.json({
                error: 'User Already Exists in DB'
            } , {status: 404})
        }

        await UserModel.create({
            email,
            password
        })

        return NextResponse.json({
            message: 'User Registered'
        } , {status: 201})

    }catch(err){
        return NextResponse.json({
            error: "Failed to register User!"
        } , {status: 404})
    }
}