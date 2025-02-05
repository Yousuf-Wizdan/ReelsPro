import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: {label: "Username" , type: 'text' , placeholder: 'JohnDoe'},
                password: {label: 'Password' , type: 'password'}
            },
            async authorize(credentials){

                if(!credentials?.email || !credentials?.password){
                    throw new Error('Missing Email or Password')
                }

                try{
                    await dbConnect();

                    const user = await UserModel.findOne({email: credentials.email})
                    if(!user){
                        throw new Error('User Does Not Exists   ')
                    }

                    const isValid = await bcrypt.compare(credentials.password , user.password)
                    if(!isValid){
                        throw new Error('Invalid Password')
                    }
                

                return {
                    id: user._id.toString(),
                    email: user.email
                }

                }catch(err){    
                    throw err
                }
            }
        })
    ],
    callbacks: {
        async jwt({token , user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session , token}){
            if(session.user){
                session.user.id = token.id as string
            }   
            return session
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30*24*60*60
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login'
    }
}