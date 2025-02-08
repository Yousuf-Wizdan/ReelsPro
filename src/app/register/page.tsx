'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Register = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    const [error , setError] = useState("")

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(password !== confirmPassword){
            setError("Your Password does not Match")
        }

        try{
            const res = await fetch("/api/auth/register" , {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email , password})
            })
            
            const data = res.json()
            if(!res.ok){
                setError('Registration Failed')
            }

            router.push('/login')

        }catch(err){

        }
    }
return(
    <div className='flex flex-col justify-center items-center space-y-10'>
        <div>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="jhondoe@example.com" className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
            <p>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
            <p>Confirm Password</p>
            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="********" className="input input-bordered w-full max-w-xs" />
        </div>
        <button className="btn btn-wide">Register</button>
    </div>
  )
}

export default Register