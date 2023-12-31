import { connectToMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'

connectToMongoDB();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody
        console.log(reqBody)
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json(
                {
                    error: 'This user Alredy Exist'
                },
                {status: 400}
            )
        }
        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)
        // create new user
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        })
        // save it inside the DB
        const saveUser = await newUser.save();

        return NextResponse.json({
            message: 'User Creadited!',
            success: true,
            saveUser,
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}