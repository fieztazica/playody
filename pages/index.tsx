import React, { useState } from 'react'
import { Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/layouts/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import NextLink from 'next/link'

const Home = () => {


    return (
        <>
            <Head>
                <title>
                    Home
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-justify-center'>
                {
                    new Array(50).fill(0).map((v, i) => (<Link key={`search ${i}`} as={NextLink} href={'/search'}>
                        Search some thing to play
                    </Link>))
                }
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
