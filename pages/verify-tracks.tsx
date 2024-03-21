import MainLayout from '@/components/MainLayout'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import useVerifyTracks from '@/lib/hooks/useVerifyTracks'
import { TrackWithProfile } from '@/typings'
import { Database } from '@/typings/supabase'
import { ButtonGroup, Checkbox, IconButton, Image } from '@chakra-ui/react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import * as React from 'react'
import { MdRefresh } from 'react-icons/md'
import { RxCheck, RxCross2, RxTrash } from 'react-icons/rx'

const VerifyTracks = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const {
        session,
        onSearch,
        filter,
        verifiedTrack,
        onVerifiedChange,
        refresh,
        refreshing,
        handleDelete,
        toggleVerified,
        filteredTracks,
    } = useVerifyTracks(props.tracks)

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
                        onChange={onSearch}
                    />
                    <Checkbox
                        isChecked={verifiedTrack}
                        onChange={onVerifiedChange}
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
                {filteredTracks !== null &&
                    filteredTracks.map((v) => (
                        <div
                            key={`track_result_${v.id}`}
                            className={'tw-bg-black/10 tw-p-2 tw-rounded-md'}
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
                                        @{v?.profiles?.[0]?.full_name || 'Unknown'}
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
                                    'tw-flex tw-flex-col-reverse lg:tw-flex-row tw-items-center tw-justify-between'
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
