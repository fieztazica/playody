import { Flex, Grid, Spacer, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DisplaySong from './DisplaySong'
import AudioControl from './AudioControl'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import Head from 'next/head'
import { AudioRightBox } from '@/components/AudioRightBox'

const AUDIO_API_ROUTE = '/api/yt'

function AudioPlayer() {
    const {
        isPause,
        setDuration,
        audioRef,
        setIsPause,
        setCurrentTime,
        queue,
        setQueue,
        loopMode,
        playingIndex,
        setPlayingIndex,
        nextSong,
        duration,
    } = useAudioCtx()
    const [loading, setLoading] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const handleLoadedData = () => {
        setLoading(false)
        setDuration(audioRef.current?.duration || 0)
        if (!isPause) audioRef.current?.play()
    }

    const handleLoadAudio = async (videoId: string) => {
        try {
            setLoading(true)
            // Load audio from API route
            const res = await fetch(`${AUDIO_API_ROUTE}/${videoId}`)
            if (res.status !== 200) return
            const buffer = await res.arrayBuffer()
            const audioUrl = URL.createObjectURL(new Blob([buffer]))
            setAudioUrl(audioUrl)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     if (isPause) {
    //         setIsPause(!isPause)
    //         audioRef.current?.play()
    //     }
    // }, [audioUrl])


    // const handleLoadedMetadata = () => {
    //     setDuration(audioRef.current?.duration || 0)
    // }

    // useEffect(() => {
    //     if (queue)
    //         handleLoadAudio(queue?.[playingIndex]?.src)
    //     else setAudioUrl(null)
    // }, [queue])

    // useEffect(() => {
    //     if (isPause) setAudioUrl(null)
    //     else handleLoadAudio(queue[playingIndex].src)
    // }, [isPause])

    useEffect(() => {
        if (!queue || playingIndex == undefined) return
        if (queue.length) {
            handleLoadAudio(queue?.[playingIndex]?.src)
        } else setAudioUrl(null)
    }, [playingIndex, queue])

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
            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'repeat(3, 1fr)',
                }}
                p={4}
                gap={6}
                bgColor={'rgba(0,0,0,1)'}
                boxShadow={
                    'inset 0 10px 25px -25px #FF0080, inset 0 10px 20px -20px #7928CA'
                }
                zIndex={5}
                h={'full'}
                className={'tw-relative'}
            >
                {loading && <div className={'tw-absolute tw-top-0 tw-right-0 tw-m-4'}>
                    <Spinner ml={2} />
                </div>}
                <DisplaySong />
                <AudioControl />
                <AudioRightBox />
            </Grid>
            {queue.length && audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    className='tw-hidden'
                    onLoadedData={handleLoadedData}
                    // onLoadedMetadata={handleLoadedMetadata}
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
