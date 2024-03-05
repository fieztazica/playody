import * as React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { Profile, Track } from '@/typings'
import MainLayout from '@/components/MainLayout'
import {
    Button,
    ButtonGroup,
    IconButton,
    Image,
    Tooltip,
} from '@chakra-ui/react'
import { RxCross2, RxCheck, RxTrash } from 'react-icons/rx'
import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { TrackUpdate } from '@/lib/api/track'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import { Checkbox } from '@chakra-ui/checkbox'
import { MdRefresh } from 'react-icons/md'

type TrackWithProfile = Track & { profiles: Profile[] }

type Props = {
    tracks: TrackWithProfile[] | null
}

const VerifyTracks = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const session = useSession()
    const supabaseClient = useSupabaseClient<Database>()
    const [tracks, setTracks] = useState<TrackWithProfile[] | null>(null)
    const [verifiedTrack, setVerifiedTrack] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [filter, setFilter] = useState('')

    async function toggleVerified({ id, is_verified }: Track) {
        try {
            const updateObj: TrackUpdate = { is_verified: !is_verified }
            const res = await fetch(`/api/track?trackId=${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateObj),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((r) => r.json())

            if (res.error) throw res.error

            refresh()
        } catch (e: any) {
            if (e?.message) alert(e.message)
            console.error(e)
        }
    }

    function handleDelete(id: string) {
        ;(async () => {
            try {
                const res = await fetch(`/api/track?trackId=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((r) => r.json())

                if (res.error) throw res.error

                refresh()
            } catch (e: any) {
                if (e?.message) alert(e.message)
                console.error(e)
            }
        })()
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

            if (data) setTracks([...(data as any)])
        } catch (e: any) {
            if (e?.message) alert(e.message)
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

    if (!session) return null

    return (
        <>
            <NavBar>
                <div
                    className={
                        'tw-flex tw-space-x-2 tw-h-full tw-items-center tw-w-full'
                    }
                >
                    <SearchBar
                        query={filter}
                        placeholder={'Search for a track'}
                        onChange={(e) => {
                            e.preventDefault()
                            setFilter(e.target.value.toLowerCase())
                        }}
                    />
                    <Checkbox
                        isChecked={verifiedTrack}
                        onChange={(e) => {
                            e.preventDefault()
                            setVerifiedTrack(e.target.checked)
                        }}
                    >
                        Verified
                    </Checkbox>
                    <IconButton
                        isLoading={refreshing}
                        onClick={() => refresh()}
                        title={'Refresh'}
                        icon={<MdRefresh />}
                        aria-label={'Refresh button'}
                    />
                </div>
            </NavBar>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {tracks !== null &&
                    tracks
                        .filter((v) => v.is_verified === verifiedTrack)
                        .filter((v) =>
                            filter
                                ? v.name.toLowerCase().includes(filter) ||
                                  v.genres
                                      ?.join(',')
                                      .toLowerCase()
                                      .includes(filter) ||
                                  v.artists
                                      .join(',')
                                      .toLowerCase()
                                      .includes(filter)
                                : true
                        )
                        .map((v) => (
                            <div
                                key={`track_result_${v.id}`}
                                className={
                                    'tw-bg-black/10 tw-p-2 tw-rounded-md'
                                }
                            >
                                <div
                                    className={
                                        'tw-flex tw-justify-between tw-items-center tw-mb-1'
                                    }
                                >
                                    <span>
                                        <span
                                            className={`tw-font-semibold`}
                                            title={v.author || undefined}
                                        >
                                            @
                                            {v.profiles.shift()?.full_name ||
                                                'Unknown'}
                                        </span>{' '}
                                        uploaded at{' '}
                                        {new Date(
                                            v.created_at || 0
                                        ).toLocaleString()}
                                    </span>
                                    <ButtonGroup>
                                        <IconButton
                                            variant={'ghost'}
                                            size={'sm'}
                                            fontSize={'xl'}
                                            icon={
                                                v.is_verified ? (
                                                    <RxCross2 color={'red'} />
                                                ) : (
                                                    <RxCheck color={'green'} />
                                                )
                                            }
                                            aria-label={
                                                v.is_verified
                                                    ? 'Revoke track button'
                                                    : 'Accept track button'
                                            }
                                            title={
                                                v.is_verified
                                                    ? 'Revoke verification of this song'
                                                    : 'Verify this song'
                                            }
                                            onClick={() => toggleVerified(v)}
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
                                <div
                                    className={
                                        'tw-flex tw-flex-col-reverse md:tw-flex-row tw-items-center tw-justify-between'
                                    }
                                >
                                    <div>
                                        <p>Name: {v.name}</p>
                                        <p>Artists: {v.artists?.join(', ')}</p>
                                        <p>Genres: {v.genres?.join(', ')}</p>
                                        <p>Duration: {v.duration_s}s</p>
                                    </div>
                                    {v.image_url && (
                                        <div
                                            className={
                                                'tw-p-2 tw-aspect-square tw-max-w-xs'
                                            }
                                        >
                                            <Image
                                                alt={`${v.name}'s image`}
                                                src={v.image_url}
                                            />
                                        </div>
                                    )}
                                </div>
                                <audio
                                    className={'tw-w-full'}
                                    controls
                                    src={v.src || undefined}
                                />
                            </div>
                        ))}
            </div>
        </>
    )
}

VerifyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

VerifyTracks.title = 'Verify Tracks'
export default VerifyTracks

export const getServerSideProps = (async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const { data, error } = await supabaseClient.auth.getUser()

    // console.log(data)
    if (error || data.user?.app_metadata.role !== 'admin')
        return {
            notFound: true,
        }

    const tracks = await supabaseClient
        .from('tracks')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })

    if (tracks.error) {
        return {
            notFound: true,
        }
    }

    // console.log(tracks.data)
    return {
        props: {
            tracks: tracks.data,
        },
    }
}) satisfies GetServerSideProps<{
    tracks: TrackWithProfile[] | null
}>
