// @flow
import * as React from 'react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { TrackCard } from '@/components/TrackCard'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import UnderlineTypo from '@/components/UnderlineTypo'
import { IconButton } from '@chakra-ui/react'
import { MdPlaylistRemove } from 'react-icons/md'

const Queue = () => {
    const {
        isPause,
        queue,
        playingIndex,
        setPlayingIndex,
        removeFromQueue,
    } = useAudioCtx()

    function handleClickSong(index: number) {
        if (!(index < 0 || index >= queue.length || index === playingIndex)) {
            setPlayingIndex(index)
        }
    }

    return (<>
            <Head>
                <title>
                    {playingIndex === null ? 'Queue' : `${queue?.[playingIndex]?.name} - ${queue[playingIndex].artists.join(', ')}`}
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-flex tw-flex-col tw-w-full tw-space-y-2'}>
                    {!isPause && playingIndex !== null && <>
                        <UnderlineTypo>
                            Now Playing
                        </UnderlineTypo>
                        <div className={'tw-flex tw-w-full tw-space-x-2 tw-group'}>
                            <TrackCard
                                title={'Now playing'}
                                key={'Now playing'}
                                track={queue[playingIndex]}
                                w={'full'}
                            />
                        </div>
                    </>}
                    <UnderlineTypo>
                        {!isPause && playingIndex !== null ? 'Waiting in queue' : 'Queue'}
                    </UnderlineTypo>
                    {queue.length ?
                        queue.filter((v, i) => !isPause ? i !== playingIndex : true).map((v, i) => (
                            <div
                                key={`queued_track_${v.id}_${i}`}
                                className={'tw-flex tw-w-full tw-space-x-2 ' +
                                    'tw-group'}>
                                <TrackCard
                                    track={v}
                                    onClick={() => handleClickSong(queue.indexOf(v))}
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
    return <MainLayout>{page}</MainLayout>
}

// Queue.title = "Queue"

export default Queue
