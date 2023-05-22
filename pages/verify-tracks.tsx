// @flow
import * as React from 'react'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { Profile, Track } from '@/typings'
import { TrackCard } from '@/components/TrackCard'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import { Button, ButtonGroup, IconButton, Image, Tooltip } from '@chakra-ui/react'
import { RxCross2, RxCheck, RxTrash } from 'react-icons/rx'
import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

type TrackWithProfile = Track & { profiles: Profile }

type Props = {
    tracks: TrackWithProfile[] | null
};

const VerifyTracks = (props: Props) => {
    const session = useSession()
    const supabaseClient = useSupabaseClient<Database>()
    const [tracks, setTracks] = useState<TrackWithProfile[] | null>(null)
    const [verifiedTrack, setVerifiedTrack] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    async function toggleVerified(id: string, verified: boolean) {
        try {
            const { data, error } = await supabaseClient
                .from('tracks')
                .update({ is_verified: verified })
                .eq('id', id)

            if (error)
                throw error

            refresh()
        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        }
    }

    async function handleDelete(id: string) {
        try {
            const { error } = await supabaseClient
                .from('tracks')
                .delete()
                .eq('id', id)

            if (error)
                throw error

            refresh()
        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        }
    }

    async function refresh() {
        try {
            setRefreshing(true)
            const { data, error } = await supabaseClient
                .from('tracks')
                .select('*, profiles(*)')
                .order('created_at', { ascending: false })

            if (error || !data) {
                throw error
            }

            if (data)
                setTracks([...data as any])


        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (props.tracks !== null) {
            setTracks([...props.tracks])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!session) return null;


    return (
        <>
            <Head>
                <title>
                    Search
                </title>
            </Head>
            <div>
                <div
                    className={'tw-mb-4 after:tw-block after:tw-mt-1 after:tw-rounded-full after:tw-h-1 after:tw-w-full after:tw-bg-white/30'}>
                    <div className={'tw-flex tw-justify-between tw-items-center'}>
                        <Tooltip label={'Click to toggle between verified and unverified tracks'}>
                            <Button
                                colorScheme={verifiedTrack ? 'teal' : 'red'}
                                onClick={() => setVerifiedTrack(!verifiedTrack)}
                                variant={'ghost'}
                            >
                                {verifiedTrack ? 'Verified Tracks' : 'Unverified Tracks'}
                                {': '}
                                {tracks?.filter(v => v.is_verified === verifiedTrack).length || 0}
                            </Button>
                        </Tooltip>
                        <Button
                            isLoading={refreshing}
                            onClick={() => refresh()}
                            variant={'ghost'}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>
                <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                    {
                        tracks !== null && tracks.filter(v => v.is_verified === verifiedTrack).map((v) => (
                            <div
                                key={`track_result_${v.id}`}
                                className={'tw-bg-black/10 tw-p-2 tw-rounded-md'}
                            >
                                <div className={'tw-flex tw-justify-between tw-items-center tw-mb-1'}>
                                    <span>
                                        <span className={`tw-font-semibold`}
                                              title={v.author || undefined}
                                        >
                                            @{v.profiles.full_name}
                                        </span>{' '}
                                        uploaded at {new Date(v.created_at || 0).toLocaleString()}
                                    </span>
                                    <ButtonGroup>
                                        <IconButton
                                            variant={'ghost'}
                                            size={'sm'}
                                            fontSize={'xl'}
                                            icon={v.is_verified ? <RxCross2 color={'red'} /> : <RxCheck color={'green'} />}
                                            aria-label={v.is_verified ? 'Revoke track button' : 'Accept track button'}
                                            title={v.is_verified ? 'Revoke verification of this song' : 'Verify this song'}
                                            onClick={() => toggleVerified(v.id, !v.is_verified)}
                                        />
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
                        ))
                    }
                </div>
            </div>
        </>
    )
}

VerifyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default VerifyTracks

export const getServerSideProps: GetServerSideProps<{
    tracks: Track[] | null
}> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const { data, error } = await supabaseClient.auth.getUser()

    if (error || data.user?.app_metadata.role !== 'admin')
        return {
            notFound: true,
        }

    const tracks = await supabaseClient
        .from('tracks').select('*, profiles(*)')
        .order('created_at', { ascending: false })

    if (tracks.error) {
        return {
            notFound: true,
        }
    }

    console.log(tracks.data)
    return {
        props: {
            tracks: tracks.data,
        },
    }
}