import React, { useState } from 'react'
import { Button, Input } from '@chakra-ui/react'
import MainLayout from '@/components/layouts/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'

const Home = () => {


    return (
        <>
            <Head>
                <title>
                    Home
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-hidden md:tw-flex tw-w-full'}>
                    <NavBar />
                </div>
                <div className={'tw-flex tw-items-center tw-justify-center tw-h-full'}>
                    <PlayodyTitle />
                </div>
            </div>


        </>

    )
}

Home.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Home

// export async function getServerSideProps({
//     req,
//                                          }: GetServerSidePropsContext) {
//     const secret = process.env.NEXTAUTH_SECRET
//     const tokenJWT = await getToken({ req, secret })
//     // console.log('JSON Web Token', tokenJWT)
//     return {
//         props: {
//             tokenJWT,
//         }, // will be passed to the page component as props
//     }
// }
