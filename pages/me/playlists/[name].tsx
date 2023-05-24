// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/components/MainLayout'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { Playlist, Track } from '@/typings'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { TrackCard } from '@/components/TrackCard'
import UnderlineTypo from '@/components/UnderlineTypo'
import { Button, Spinner } from '@chakra-ui/react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

type Props = {
    playlist: Playlist | null,
};

const MyPlaylistName = ({ playlist }: Props) => {
    const { setPlayingTrack, setQueue } = useAudioCtx()
    const router = useRouter()
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [tracksInPlaylist, setTracksInPlaylist] = useState<Track[]>([])

    function refresh() {
        (async () => {
            try {
                setRefreshing(true)
                if (!user) {
                    throw 'Not authenticated'
                }

                if (!playlist) {
                    throw 'Playlist null'
                }

                const res = await fetch(`/api/playlist/resolve?name=${playlist.name}`)

                if (!res.ok) {
                    throw res
                }

                const jsonRes = await res.json()

                if (jsonRes.error) {
                    throw jsonRes.error
                }

                if (jsonRes.data)
                    setTracksInPlaylist([...jsonRes.data as any])
            } catch (e: any) {
                if (e?.message)
                    alert(e.message)
                console.error(e)
            } finally {
                setRefreshing(false)
            }
        })()
    }

    function handleClickPlay() {
        if (!tracksInPlaylist.length) return
        setQueue([...tracksInPlaylist])
        setPlayingTrack(tracksInPlaylist[0])
    }

    useEffect(() => {
        refresh()
    }, [playlist])

    if (!playlist) return null

    return (
        <>
            <Head>
                <title>
                    {`Playody | ${playlist.name}`}
                </title>
            </Head>
            <div className={'tw-flex tw-flex-col tw-space-y-2 tw-justify-center'}>
                <div className={'tw-flex tw-justify-between tw-items-center tw-h-12 tw-space-x-2'}>
                    <UnderlineTypo>
                        <span>{playlist.name} has {playlist.trackIds?.length} tracks</span>
                        {refreshing && <Spinner ml={4}/>}
                    </UnderlineTypo>
                    <Button colorScheme={'purple'} onClick={() => handleClickPlay()}>
                        Play
                    </Button>
                </div>
                {
                    tracksInPlaylist && tracksInPlaylist.length && tracksInPlaylist.map((v) => (
                        <TrackCard key={`track_${v.id}_of_playlist_${playlist.name}`} track={v} />
                    ))
                }
            </div>
        </>
    )
}

MyPlaylistName.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default MyPlaylistName


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const playlistName = decodeURIComponent(ctx.query.name as string)

    const playlist = await supabaseClient
        .from('playlists')
        .select('*')
        .eq('name', playlistName)
        .eq('author', user.data.user.id)
        .limit(1)
        .single()

    if (playlist.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            playlist: playlist.data || null,
        },
    }
}