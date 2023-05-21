// @flow
import * as React from 'react'
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

type Props = {};

export function Recovery(props: Props) {
    const supabaseClient = useSupabaseClient<Database>()
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const hostname = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`
    async function handleSubmit() {
        try {
            setSubmitting(true)

            // const res = await fetch(`/api/recovery`, {
            //     method: 'POST',
            //     body: JSON.stringify({ email: email }),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // })

            // console.log(res)

            const { error } = await supabaseClient.auth
                .resetPasswordForEmail(email, {
                    redirectTo: hostname
                })

            if (error) {
                throw error
            }

            setError('')
            alert('Submitted! Please check your email')
        } catch (e: any) {
            console.error(e.toString())
            setError(e.toString())
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className={'tw-container tw-mx-auto tw-px-4 tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center'}>
            <div className={'tw-flex tw-flex-col tw-space-y-4 tw-p-8 tw-rounded-md tw-bg-black/20'}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input value={email} onChange={(e) => {
                        e.preventDefault()
                        setEmail(e.target.value)
                    }} />

                    {error &&
                        <p className={'tw-text-red-500'}>
                            {error}
                        </p>
                    }
                    {!error &&
                        <p className={'tw-text-white/60'}>
                            Enter the email you&apos;d like to reset your password.
                        </p>
                    }
                </FormControl>
                <Button colorScheme={'purple'} isLoading={submitting} onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    )
}

export default Recovery