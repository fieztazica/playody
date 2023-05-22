import {
    Flex,
    Box,
    Text,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Avatar, Stack, Link,
} from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import * as React from 'react'
import { GetServerSideProps } from 'next'
import { Profile } from '@/typings'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import NextLink from 'next/link'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import ChangeInfoForm from '@/components/ChangeInfoForm'
import ChangeAvatarForm from '@/components/ChangeAvatarForm'

type Props = {
    profile: Profile | null
}


const MyProfile = ({ profile }: Props) => {
    const user = useUser()
    const handleSubmit = () => {
        // Perform your submit action here, e.g., update user data in the database
        console.log('Submitting edited user:')
    }

    const handleUpdate = () => {
        // Perform your submit action here, e.g., update user data in the database
        console.log('Submitting edited user:')
    }

    if (profile === null) return 'Sign in'
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <div className={'tw-w-full tw-flex tw-flex-col tw-space-y-2'}>
                <div className={'tw-flex tw-flex-col-reverse md:tw-flex-row tw-w-full tw-gap-2'}>
                    <div className='tw-flex-1 tw-flex tw-flex-col tw-space-y-2 tw-bg-black/20 tw-p-5 tw-rounded-md'>
                        <Link as={NextLink} href={'/queue'}>
                            Queue
                        </Link>
                        <Link as={NextLink} href={'/profile/my-tracks'}>
                            My Tracks
                        </Link>
                        <Link as={NextLink} href={'/playlists'}>
                            My Playlists
                        </Link>
                    </div>
                    <div className='tw-flex-1 tw-bg-black/20 tw-p-5 tw-rounded-md'>
                        <ChangeAvatarForm />
                    </div>
                </div>
                <div
                    className={'tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-gap-2'}
                >
                    <div
                        className={'tw-flex-1 tw-rounded-md tw-bg-black/20 tw-py-10'}
                    >
                        <Flex justifyContent='center'>
                            <ChangeInfoForm/>
                        </Flex>
                    </div>
                    <div
                        className={'tw-flex-1 tw-rounded-md tw-bg-black/20 tw-py-10'}
                    >
                        <Flex justifyContent='center'>
                            <ChangePasswordForm />
                        </Flex>
                    </div>
                </div>
            </div>
        </>
    )
}

MyProfile.getLayout = (page: React.ReactNode) => {
    return <MainLayout>
        {page}
    </MainLayout>
}
export default MyProfile
export const getServerSideProps: GetServerSideProps<{
    profile: Profile | null
}> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const { data, error } = await supabaseClient.auth.getUser()

    if (error)
        return {
            notFound: true,
        }

    const profile = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', `${data.user.id}`)
        .limit(1)
        .single()

    if (profile.error || !profile.data) {
        return {
            notFound: true,
        }
    }

    console.log(profile.data)
    return {
        props: {
            profile: profile.data || null,
        },
    }
}