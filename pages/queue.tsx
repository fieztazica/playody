// @flow
import * as React from 'react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { TrackCard } from '@/components/TrackCard'
import MainLayout from '@/components/layouts/MainLayout'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { PlayodyTitle } from '@/components/PlayodyTitle'

type Props = {};
const Queue = (props: Props) => {
    const { queue, playingIndex } = useAudioCtx()

    return (<>
            <Head>
                <title>
                    Queue
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-hidden md:tw-flex tw-w-full'}>
                    <NavBar />
                </div>
                <div className={'tw-flex tw-flex-col tw-w-full tw-p-2 tw-space-y-2'}>
                    {queue.length ?
                        queue.map((v, i) => (<div key={v.src} className={`tw-rounded-md ${playingIndex == i && "tw-shadow-lg tw-shadow-blue-300/50 tw-animate-pulse"}`}><TrackCard track={v} /></div>)) : 'Queue is empty'
                    }
                </div>
            </div>
        </>
    )
}

Queue.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Queue