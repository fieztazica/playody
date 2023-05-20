import React, { useEffect, useState } from 'react'
import { Box, Button, Input, Link, Text } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track, Profile } from '@/typings'
import PostCard from '@/components/PostCard'

const Home = () => {
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)
    const [posts, setPosts] = useState<(Track & { profiles: Profile | null })[]>([])
    const [loading, setLoading] = useState(false)

    async function loadPosts() {
       try {
           setLoading(true)
           const res = await fetch(`/api/track/list?page=${page}`).then(r => r.json())
           console.log(res)
           if (res.error) {
               throw res.error
           }

           if (res.data.length) {
               setPosts(a => [...a, ...res.data])
           } else {
               throw "List empty"
           }
       } catch (e: any) {
           console.error(e)
           setIsEnded(true)
       } finally {
           setLoading(false)
       }
    }

    useEffect(() => {
        loadPosts()
    }, [page])

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {posts.length && posts.map((v, i) => (
                    <div key={`track_${i}_${v.id}`}>
                        <PostCard track={v} />
                    </div>
                ))}
                <Button isLoading={loading} display={isEnded ? 'none' : 'flex'} onClick={() => {
                    setPage(p => p + 1)
                }}>
                    Load more
                </Button>
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
