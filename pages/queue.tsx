// @flow
import * as React from 'react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { TrackCard } from '@/components/TrackCard'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import UnderlineTypo from '@/components/UnderlineTypo'
import { IconButton } from '@chakra-ui/react'
import { MdPlaylistRemove } from 'react-icons/md'
import { Track } from '@/typings'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import { useState } from 'react'

const Queue = () => {
    const {
        isPause,
        queue,
        playingTrack,
        setPlayingTrack,
        removeFromQueue,
    } = useAudioCtx()
    const [filter, setFilter] = useState('')

    function handleClickSong(track: Track) {
        setPlayingTrack(track)
    }

    return (<>
            <NavBar>
                <SearchBar
                    query={filter}
                    placeholder={"Search a song in queue"}
                    onChange={(e) => {
                        e.preventDefault()
                        setFilter(e.target.value.toLowerCase())
                    }}/>
            </NavBar>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-flex tw-flex-col tw-w-full tw-space-y-2'}>
                    {!isPause && playingTrack !== null && <>
                        <UnderlineTypo>
                            Now Playing
                        </UnderlineTypo>
                        <div className={'tw-flex tw-w-full tw-space-x-2 tw-group'}>
                            <TrackCard
                                title={'Now playing'}
                                key={'Now playing'}
                                track={playingTrack}
                                w={'full'}
                            />
                        </div>
                    </>}
                    {(!isPause && playingTrack !== null && queue.filter(v => v !== playingTrack).length > 0) &&
                        <UnderlineTypo>Waiting in queue </UnderlineTypo>}
                    {queue && queue.length ?
                        queue.filter((v) => !isPause ? v !== playingTrack : true).filter(v => filter ? v.name.toLowerCase().includes(filter) || v.genres?.join(",").toLowerCase().includes(filter) || v.artists.join(",").toLowerCase().includes(filter) : true).map((v, i) => (
                            <div
                                key={`queued_track_${v.id}_${i}`}
                                className={'tw-flex tw-w-full tw-space-x-2 ' +
                                    'tw-group'}>
                                <TrackCard
                                    track={v}
                                    onClick={() => handleClickSong(v)}
                                    w={'full'}
                                />
                                <div title={'Remove this song from queue'}
                                     className={'tw-transition tw-h-full tw-cursor-pointer ' +
                                         'tw-flex tw-duration-300 tw-justify-center ' +
                                         'tw-items-center hover:tw-bg-red-700 ' +
                                         'tw-bg-red-600 tw-rounded-md tw-basis-0 ' +
                                         'group-hover:tw-basis-16 tw-transition-all tw-duration-300'}
                                     onClick={() => removeFromQueue(v)}
                                >
                                    <div
                                        className={'tw-text-3xl tw-transition tw-delay-100 tw-duration-200 tw-flex tw-basis-0 tw-w-0 group-hover:tw-w-full '}>
                                        <MdPlaylistRemove />
                                    </div>
                                </div>
                            </div>
                        )) :
                        <p className={'tw-text-center tw-w-full tw-my-4 tw-text-xl'}>
                            Queue is empty
                        </p>
                    }
                </div>
            </div>
        </>
    )
}

Queue.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

Queue.title = 'Queue'

export default Queue
