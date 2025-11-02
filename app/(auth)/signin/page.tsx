'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import InputField from '@/components/forms/inputFeild'
import { Button } from '@/components/ui/button'
import FooterLink from '@/components/forms/FooterLink'
const page = () => {
    const {
        register,
         handleSubmit,
         formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    })
     const onSubmit = async (data: SignInFormData) => {
        try {
            console.log(data)
        } catch (error: unknown) {
            console.error('Sign in failed:', error)
        }
     }
  return (
    <div>
        <h1 className="form-title">Log In Your Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

           <InputField name="email" 
           label= "Email"
            placeholder= "xyz@gmail.com"
            register={register}
            error={errors.email}
            validation={{ required: 'Email is required', pattern: { value: /^\w+@\w+\.\w+$/, message: 'Invalid email format' } }} />

            <InputField name = "password"
             label ="Password"
             placeholder=" Enter Your Password"
             register={register}
            error={errors.password}
            validation={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }} />

            <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5"
            >{isSubmitting ? 'Signing In' : 'Sign In'}</Button>

            <FooterLink text="Don't have an account?" linkText="Sign Up" href="/signup" />

             </form>
    </div>
  )
}

export default page
