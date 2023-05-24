import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, IconButton, Input, Link, Tooltip, Image } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track } from '@/typings'
import { RxTrash } from 'react-icons/rx'
import { AiOutlineEdit } from 'react-icons/ai'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

type Props = {
    tracks: Track[] | null
}

const MyTracks = ({ tracks }: Props) => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [myTracks, setMyTracks] = useState<Track[]>([])

    const [verifiedTrack, setVerifiedTrack] = useState(true)

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

    async function toggleEdit(id: string) {
        const trackId = id;

        window.location.href = `/me/my-tracks/${trackId}`;
    }

    useEffect(() => {
        if (tracks === null)
            refresh()
        else
            setMyTracks([...tracks])
    }, [])


    return (
        <>
            <div>
                <div
                    className='tw-mb-4 after:tw-block after:tw-mt-1 after:tw-rounded-full after:tw-h-1 after:tw-w-full after:tw-bg-white/30'>
                    <div className='tw-flex tw-justify-between      tw-items-center'>
                        <Tooltip label={'Click to toggle between verified and unverified tracks'}>
                            <Button
                                colorScheme={verifiedTrack ? 'teal' : 'red'}
                                onClick={() => setVerifiedTrack(!verifiedTrack)}
                                variant={'ghost'}
                            >
                                {verifiedTrack ? 'Verified Tracks' : 'Unverified Tracks'}
                                {': '}
                                {myTracks?.filter(v => v.is_verified === verifiedTrack).length || 0}
                            </Button>
                        </Tooltip>
                        <Button isLoading={refreshing} onClick={() => refresh()}>
                            Refresh
                        </Button>
                    </div>
                </div>
                <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                    {myTracks !== null && myTracks.filter(v => v.is_verified === verifiedTrack).map((v) => (
                        <div key={`myTrack_result_${v.id}`} className='tw-bg-black/10 tw-p-2 tw-rounded-md'>
                            <div
                                className={'tw-flex tw-justify-between tw-items-center tw-mb-1 tw-left-0 tw-flex-row-reverse'}>
                                <ButtonGroup>
                                    {!v.is_verified && (
                                        <IconButton
                                            variant={'ghost'}
                                            size={'sm'}
                                            fontSize={'xl'}
                                            icon={<AiOutlineEdit color={'yellow'} />}
                                            aria-label={'Edit track button'}
                                            onClick={() => toggleEdit(v.id)}
                                        />)}
                                    <IconButton
                                        variant={'ghost'}
                                        size={'sm'}
                                        fontSize={'xl'}
                                        icon={<RxTrash color={'red'} />}
                                        aria-label={'Delete track button'}
                                        title={'Delete this song'}
                                        onClick={() => handleDelete(v.id)}
                                    />
                                </ButtonGroup>
                            </div>
                            <div className={'tw-flex tw-items-center tw-justify-between'}>
                                <div>
                                    <Link as={NextLink} href={`/me/tracks/${v.id}`}>
                                        {v.name}
                                    </Link>
                                    <p>Name: {v.name}</p>
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
            </div>
        </>
    )
}

MyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

MyTracks.title = "My Tracks"

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