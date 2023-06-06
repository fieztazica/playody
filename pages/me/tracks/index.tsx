import React, { useEffect, useState } from 'react'
import {
    Button,
    ButtonGroup,
    IconButton,
    Input,
    Link,
    Tooltip,
    Image,
    Icon,
    PopoverTrigger,
    PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, PopoverFooter, Popover,
} from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track } from '@/typings'
import { RxTrash } from 'react-icons/rx'
import { AiOutlineEdit } from 'react-icons/ai'
import { VscVerified } from 'react-icons/vsc'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import { MdRefresh } from 'react-icons/md'

type Props = {
    tracks: Track[] | null
}

const MyTracks = ({ tracks }: Props) => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [myTracks, setMyTracks] = useState<Track[]>([])
    const [filter, setFilter] = useState('')

    async function refresh() {
        try {
            setRefreshing(true)
            if (!user) {
                throw 'Not authenticated'
            }

            const { data, error } = await supabaseClient
                .from('tracks')
                .select('*')
                .eq('author', user.id)
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

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/track?trackId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(r => r.json())

            if (res.error)
                throw res.error

            refresh()
        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        }
    }


    useEffect(() => {
        if (tracks === null)
            refresh()
        else
            setMyTracks([...tracks])
    }, [])


    return (
        <>
            <NavBar>
                <div className={'tw-flex tw-space-x-2 tw-h-full tw-items-center tw-w-full'}>
                    <SearchBar
                        query={filter}
                        placeholder={'Search for a track'}
                        onChange={(e) => {
                            e.preventDefault()
                            setFilter(e.target.value.toLowerCase())
                        }} />
                    <IconButton
                        isLoading={refreshing}
                        onClick={() => refresh()}
                        title={'Refresh'}
                        icon={<MdRefresh />}
                        aria-label={'Refresh button'} />
                </div>
            </NavBar>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {myTracks !== null && myTracks.filter(v => filter ? v.name.toLowerCase().includes(filter) || v.genres?.join(',').toLowerCase().includes(filter) || v.artists.join(',').toLowerCase().includes(filter) : true).map((v) => (
                    <div key={`myTrack_result_${v.id}`} className='tw-bg-black/10 tw-p-2 tw-rounded-md'>
                        <div className={'tw-flex tw-justify-between tw-items-center tw-mb-1'}>
                            <div className={'tw-flex tw-flex-row tw-space-x-2 tw-justify-center tw-items-center'}>
                                <span className={'tw-font-bold'}>{v.name}</span>
                                {v.is_verified &&
                                    <Tooltip placement='right' label={'Verified'}>
                                        <span className={'tw-flex tw-justify-center tw-items-center'}>
                                            <Icon
                                                as={VscVerified}
                                                fontSize={'xl'}
                                            />
                                        </span>
                                    </Tooltip>
                                }
                            </div>
                            <ButtonGroup>
                                <IconButton
                                    variant={'ghost'}
                                    size={'sm'}
                                    fontSize={'xl'}
                                    icon={<AiOutlineEdit color={'yellow'} />}
                                    aria-label={'Edit track button'}
                                    as={NextLink} href={`/me/tracks/${v.id}`}
                                    title={'Edit this track'}
                                />
                                <Popover>
                                    <PopoverTrigger>
                                        <IconButton
                                            variant={'ghost'}
                                            size={'sm'}
                                            fontSize={'xl'}
                                            icon={<RxTrash color={'red'} />}
                                            aria-label={'Delete track button'}
                                            title={'Delete this track'}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent bgGradient={'linear(to-b, blue.900, purple.900, pink.900)'}>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                            Confirmation!
                                        </PopoverHeader>
                                        <PopoverBody>
                                            Are you sure that you want to delete this track?
                                        </PopoverBody>
                                        <PopoverFooter>
                                            <Button colorScheme={'red'} onClick={() => handleDelete(v.id)}>
                                                Yes
                                            </Button>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                            </ButtonGroup>
                        </div>
                        <div className={'tw-flex tw-items-center tw-justify-between'}>
                            <div>
                                <p>Artists: {v.artists?.join(', ')}</p>
                                <p>Genres: {v.genres?.join(', ')}</p>
                                <p>Duration: {v.duration_s}s</p>
                            </div>
                            {v.image_url && <div className={'tw-p-2 tw-aspect-square tw-max-w-xs'}>
                                <Image alt={`${v.name}'s image`} src={v.image_url} />
                            </div>}
                        </div>
                        <audio className={'tw-w-full'} controls src={v.src || undefined} />
                    </div>
                ))}
            </div>
        </>
    )
}

MyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

MyTracks.title = 'My Tracks'

export default MyTracks

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const tracks = await supabaseClient
        .from('tracks')
        .select()
        .eq('author', user.data.user.id)


    if (tracks.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            tracks: tracks.data || null,
        },
    }
}