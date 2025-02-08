'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { NextResponse } from 'next/server'

const Header = () => {

    const session =  useSession()

    const handleSignOut = async () => {
        try{
            await signOut()
            return NextResponse.json({
                message: "User Signed Out"
            })
        }catch(err){
            return NextResponse.json({
                error: "Error in Siging Out User"
            })
        }
    }

  return (  
    <div>
        <button onClick={handleSignOut}>SignOut</button>
        {session ? (
            <div>Welcome</div>
        ) : (
            <div>
                <Link href={"/login"}>Login</Link>
                <Link href={"/register"}>Register</Link>
            </div>
        )}
    </div>
  )
}

export default Header