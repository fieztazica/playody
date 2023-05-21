import React, { useEffect, useState } from 'react'
import { Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track } from '@/typings'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

const MyTracks = () => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [myTracks, setMyTracks] = useState<Track[]>([])


    async function refresh() {
        try {
            setRefreshing(true)
            if (!user) {
                throw "Not authenticated"
            }

            const { data, error } = await supabaseClient
                .from('tracks')
                .select('*')
                .eq("author", user.id)
                .order('created_at', { ascending: false })

            if (error || !data) {
                throw error
            }

            if (data)
                setMyTracks([...data as any])
        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

    useEffect(() => {
       refresh()
    }, [])


    return (
        <>
            <Head>
                <title>My Tracks</title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full'>
                <Button isLoading={refreshing} onClick={() => refresh()}>
                    Refresh
                </Button>
                {myTracks.map((v, i) => (
                    <div key={`search ${i}`} className='tw-flex tw-flex-col tw-space-y-2 tw-rounded-md tw-w-full'>
                        <div>{v.is_verified ? (
                            <div>
                                <br></br>
                                <TrackCard track={v} />
                            </div>
                        ) : (
                            <>
                                <br></br>
                                <div className='tw-bg-red-300'>
                                    <TrackCard track={v} />
                                </div>
                            </>
                        )}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

MyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default MyTracks