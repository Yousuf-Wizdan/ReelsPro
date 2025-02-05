import {z} from 'zod'

export const userSchema = z.object({
    email: z.string().email('Not Valid Email'),
    password: z.string().min(3 , 'Minimum 3 Characters need for Passoword')
})