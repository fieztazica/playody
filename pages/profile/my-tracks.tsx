import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, IconButton, Input, Link } from '@chakra-ui/react'
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

    const [verifiedTrack, setVerifiedTrack] = useState(true)

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
            <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full'>
                <div className='tw-flex tw-justify-between tw-items-center tw-w-full tw-m-2'>
                    <Button
                        colorScheme={verifiedTrack ? 'teal' : 'red'}
                        onClick={() => setVerifiedTrack(!verifiedTrack)}
                        variant={'ghost'}
                        >
                            {verifiedTrack ? 'Verified Tracks' : 'Unverified Tracks'}
                            {': '}
                            {myTracks?.filter(v => v.is_verified === verifiedTrack).length || 0}
                    </Button>
                    <Button isLoading={refreshing} onClick={() => refresh()}>
                        Refresh
                    </Button>
                </div>
                {myTracks !== null && myTracks.filter(v => v.is_verified === verifiedTrack).map((v) => (
                    <div key={`myTrack_result_${v.id}`} className='tw-flex tw-flex-col tw-space-y-2 tw-rounded-md tw-bg-black/20 tw-w-full tw-mb-4'>
                        <div>
                        {!v.is_verified && (
                                <button className='tw-rounded-full tw-m-1 tw-p-2'>Edit</button>
                        )}
                                <button className='tw-rounded-full tw-m-1 tw-p-2'>Delete</button>                        
                            <div >
                                <TrackCard track={v} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

MyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

MyTracks.title = "My Tracks"

export default MyTracks