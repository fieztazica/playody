import React, { useState } from 'react'
import { Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track } from '@/typings'
import PostCard from '@/components/PostCard'

const Home = () => {
   
    return (
        <>
           <PostCard/>
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
