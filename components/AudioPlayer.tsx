import { Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DisplaySong from './DisplaySong'
import AudioControl from './AudioControl'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import Head from 'next/head'
import { AudioRightBox } from '@/components/AudioRightBox'
function AudioPlayer() {
    const {
        setDuration,
        audioRef,
        setIsPause,
        setCurrentTime,
        queue,
        playingIndex,
        nextSong,
    } = useAudioCtx()
    const [loading, setLoading] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const handleLoadedData = () => {
        setLoading(false)
        setDuration(audioRef.current?.duration || 0)
        audioRef.current?.play()
    }

    const handleLoadAudio = async (srcUrl: string | null) => {
        try {
            setLoading(true)
            if (srcUrl === null) return
            // Load audio from API route
            const res = await fetch(`${srcUrl}`)
            if (res.status !== 200) return
            const buffer = await res.arrayBuffer()
            const url = URL.createObjectURL(new Blob([buffer]))
            if (audioUrl != url)
                setAudioUrl(url)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!queue.length || playingIndex === null) {
            setAudioUrl(null)
            return
        }
        handleLoadAudio(queue[playingIndex || 0].src)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playingIndex])

    return (
        <>
            <Head>
                {audioUrl && (
                    <link
                        rel='preload'
                        href={audioUrl}
                        as='fetch'
                        crossOrigin='anonymous'
                    />
                )}
            </Head>
            <div
                className={'tw-flex tw-justify-between tw-flex-col md:tw-flex-row tw-space-x-2 tw-rounded-md tw-mx-2 tw-mb-2 tw-p-2 tw-bg-black/20'}>
                <div className={'tw-flex-1 tw-flex tw-flex-row tw-justify-between'}>
                    <div className={'tw-flex-1'}>
                        <DisplaySong />
                    </div>
                    <div className={'tw-flex md:tw-hidden tw-items-start tw-space-x-1'}>
                        {loading &&
                            <Spinner ml={2} />
                        }
                        <AudioRightBox />
                    </div>
                </div>
                <div className={'tw-flex-1'}>
                    <AudioControl />
                </div>
                <div className={'tw-hidden md:tw-block tw-flex-1 tw-relative '}>
                        {loading && <div className={'tw-absolute tw-top-0 tw-right-0'}>
                            <Spinner ml={2} />
                        </div>}
                    <div className={'tw-absolute tw-bottom-0 tw-right-0 tw-h-fit tw-w-fit '}>
                        <AudioRightBox />
                    </div>
                </div>
            </div>
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    className='tw-hidden'
                    onLoadedData={handleLoadedData}
                    onTimeUpdate={() =>
                        setCurrentTime(audioRef.current?.currentTime || 0)
                    }
                    onPlay={() => setIsPause(false)}
                    onPause={() => setIsPause(true)}
                    onEnded={() => nextSong()}
                />
            )}
        </>
    )
}

export default AudioPlayer
