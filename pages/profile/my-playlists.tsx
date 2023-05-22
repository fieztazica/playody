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
import usePlaylists from '@/lib/hooks/usePlaylists'
import NavLink from '@/components/NavLink'

const MyPlaylists = () => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [myTracks, setMyTracks] = useState<Track[]>([])
    const playlists = usePlaylists()

    async function refresh() {
        try {
            setRefreshing(true)
            if (!user) {
                throw "Not authenticated"
            }

            const { data, error } = await supabaseClient
                .from('playlists')
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
                <title>My Playlist</title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full'>
                <Button isLoading={refreshing} onClick={() => refresh()}>
                    Refresh
                </Button>
                {playlists !== null && playlists.map((v, i) => (
                    <div key={`${v.id}_playlist_nav_link`} className='tw-flex tw-flex-col tw-space-y-2 tw-rounded-md tw-w-full tw-py-2 tw-text-lg tw-font-bold'>
                        <NavLink
                            active={false}
                            title={`${v.name}`}
                            href={`#`}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

MyPlaylists.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default MyPlaylists