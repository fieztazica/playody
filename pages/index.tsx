import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import { Track, Profile } from '@/typings'
import PostCard from '@/components/PostCard'
import { useInViewport } from 'react-in-viewport'

const Home = () => {
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)
    const [posts, setPosts] = useState<(Track & { profiles: Profile | null })[]>([])
    const [loading, setLoading] = useState(false)
    const loadBoxRef = useRef(null)
    const {
        inViewport,
    } = useInViewport(
        loadBoxRef,
        undefined,
        { disconnectOnLeave: false },
        undefined,
    )

    async function loadPosts() {
        try {
            setLoading(true)
            const res = await fetch(`/api/track/list?page=${page}`).then(r => r.json())

            if (res.error) {
                throw res.error
            }

            if (res.data.length) {
                setPosts(a => [...a, ...res.data])
            } else {
                throw 'List empty'
            }
        } catch (e: any) {
            console.error(e)
            setIsEnded(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isEnded) loadPosts()
    }, [page])

    useEffect(() => {
        if (!isEnded && inViewport) setPage(p => p + 1)
    }, [inViewport])

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
                <Button ref={loadBoxRef} isLoading={loading} display={isEnded ? 'none' : 'flex'} onClick={() => {
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
