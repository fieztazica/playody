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
import {
    Button,
    Divider,
    Icon,
    IconButton,
    Spinner,
    Text,
    Tooltip,
    useToast,
    SkeletonText,
    ButtonGroup,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from '@chakra-ui/react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { MdPlaylistRemove, MdRefresh } from 'react-icons/md'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import { flattenDeep, shuffle, take, uniq } from 'lodash'
import { BsFillPlayFill, BsShuffle } from 'react-icons/bs'
import { AiOutlineEdit } from 'react-icons/ai'
import NextLink from 'next/link'
import { RxTrash } from 'react-icons/rx'
import formatDuration from 'format-duration'
import DeletePlaylistPopover from '@/components/DeletePlaylistPopover'
import ChangePlaylistNamePopover from '@/components/ChangePlaylistNamePopover'

type Props = {
    playlist: Playlist | null,
};

const MyPlaylistName = ({ playlist }: Props) => {
    const toast = useToast()
    const { setPlayingTrack, setQueue, addToQueue } = useAudioCtx()
    const router = useRouter()
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [filter, setFilter] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [tracksInPlaylist, setTracksInPlaylist] = useState<Track[]>([])
    const playlistArtists = uniq(flattenDeep(tracksInPlaylist.map(v => v.artists)))

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

    function handleRemoveFromPlaylist(track: Track) {
        (async () => {
            try {
                if (!user || !playlist || !playlist.trackIds)
                    throw 'Unauthenticated'
                toast({
                    status: 'loading',
                    title: `Removing ${track.name} from ${playlist.name}`,
                })
                const listToUpdate = playlist.trackIds.filter(v => v != track.id)

                const { error } = await supabaseClient
                    .from('playlists')
                    .update({
                        trackIds: listToUpdate,
                    })
                    .eq('author', user.id)
                    .eq('name', playlist?.name)

                if (error) throw error

                refresh()
                toast({ status: 'success', title: 'Removed!' })
            } catch (e: any) {
                if (e?.message)
                    alert(e.message)
                console.error(e)
            }
        })()
    }

    function handleClickPlay() {
        if (!tracksInPlaylist.length) return
        setQueue([...tracksInPlaylist])
        setPlayingTrack(tracksInPlaylist[0])
        toast({
            status: 'info',
            title: `Added ${tracksInPlaylist.length} track(s) to queue!`,
        })
    }

    function handleClickShufflePlay() {
        if (!tracksInPlaylist.length) return
        setQueue(shuffle([...tracksInPlaylist]))
        setPlayingTrack(tracksInPlaylist[0])
        toast({
            status: 'info',
            title: `Added ${tracksInPlaylist.length} track(s) to queue!`,
        })
    }

    useEffect(() => {
        refresh()
        return () => {
            setTracksInPlaylist([])
        }
    }, [playlist])

    if (!playlist) return null

    return (
        <>
            <Head>
                <title>
                    {`Playody | ${playlist.name}`}
                </title>
            </Head>
            <NavBar>
                <SearchBar
                    query={filter}
                    placeholder={'Search a song in playlist'}
                    onChange={(e) => {
                        e.preventDefault()
                        setFilter(e.target.value.toLowerCase())
                    }} />
            </NavBar>
            <div className={'tw-flex tw-flex-col tw-space-y-2 tw-h-full'}>
                <div
                    className={'tw-flex tw-bg-black/20 tw-rounded-md tw-px-4 tw-py-2 tw-justify-center tw-items-center'}>
                    <div className={'tw-flex tw-flex-col tw-space-y-1 tw-flex-1'}>
                        <p className={'tw-font-extrabold tw-text-2xl lg:tw-text-4xl'}>
                            {playlist.name}
                        </p>
                        <SkeletonText isLoaded={!refreshing}>
                            <Text as={'i'} fontSize={'sm'} noOfLines={1}>
                                {take(playlistArtists, 5).join(', ')}
                                {playlistArtists.length > 5 ? ', ...' : ''}
                            </Text>
                        </SkeletonText>
                    </div>
                    <div className={'tw-p-2'}>
                        <Tooltip label={'Play'}>
                            <IconButton
                                boxSize={{
                                    base: '64px',
                                    lg: '84px',
                                }}
                                rounded={'full'}
                                fontSize={'4xl'}
                                aria-label={'Play'}
                                icon={<BsFillPlayFill />}
                                isDisabled={tracksInPlaylist.length <= 0}
                                isLoading={refreshing}
                                colorScheme={'purple'}
                                onClick={() => handleClickPlay()}
                            />
                        </Tooltip>
                    </div>
                </div>
                <div
                    className={'tw-flex tw-bg-black/20 tw-rounded-md tw-px-4 tw-py-2 tw-items-center tw-justify-between'}>
                    <ButtonGroup>
                        <IconButton
                            variant={'ghost'}
                            size={'sm'}
                            fontSize={'xl'}
                            icon={<BsShuffle color={'teal'} />}
                            aria-label={'Shuffle play button'}
                            title={'Shuffle play'}
                            onClick={() => handleClickShufflePlay()}
                            isLoading={refreshing}
                            isDisabled={tracksInPlaylist.length <= 0}
                        />
                        <ChangePlaylistNamePopover name={playlist.name} />
                        <DeletePlaylistPopover name={playlist.name} />
                    </ButtonGroup>
                    <span>
                        {formatDuration(tracksInPlaylist.map(v => v.duration_s).reduce((a, b) => a + b, 0) * 1000)}
                    </span>
                </div>
                <Divider />
                {
                    (tracksInPlaylist && tracksInPlaylist.length > 0) ? tracksInPlaylist.filter(v => filter ? v.name.toLowerCase().includes(filter) || v.artists.join(',').toLowerCase().includes(filter) || v.genres?.join(',').toLowerCase().includes(filter) : true).map((v) => (
                        <div
                            key={`track_${v.id}_of_playlist_${playlist.name}`}
                            className={'tw-flex tw-w-full hover:tw-space-x-2 ' +
                                'tw-group'}>
                            <TrackCard
                                onClickCover={() => addToQueue(v)}
                                track={v} w={'full'} />
                            <div title={'Remove this song from playlist'}
                                 className={'tw-transition tw-h-full tw-cursor-pointer ' +
                                     'tw-flex tw-duration-300 tw-justify-center ' +
                                     'tw-items-center hover:tw-bg-red-700 ' +
                                     'tw-bg-red-600 tw-rounded-md tw-basis-0 ' +
                                     'group-hover:tw-basis-16 tw-transition-all tw-duration-300'}
                                 onClick={() => handleRemoveFromPlaylist(v)}
                            >
                                <div
                                    className={'tw-text-3xl tw-transition tw-delay-100 tw-duration-200 tw-flex tw-basis-0 tw-w-0 group-hover:tw-w-full '}>
                                    <MdPlaylistRemove />
                                </div>
                            </div>
                        </div>
                    )) : (!refreshing && 'There is nothing in this playlist')
                }
            </div>
        </>
    )
}

MyPlaylistName.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
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