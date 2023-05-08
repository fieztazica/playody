import { Flex, Spacer, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DisplaySong from './DisplaySong'
import AudioControl from './AudioControl'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import VolumeBar from './VolumeBar'
import { Track } from '@/typings'
import Head from 'next/head'

const AUDIO_API_ROUTE = '/api/yt'

const exSongs: Track[] = [
    {
        name: 'Thôi Em Đừng Đi',
        src: '6fzH7a3XQW0',
        artists: [{ name: 'RPT MCK' }, { name: 'Trung Trần' }],
    },
    {
        name: 'GOTTA GO',
        src: 'SSojHpCIcdg',
        artists: [{ name: 'Ducci' }],
        cover: 'https://cdn.discordapp.com/attachments/1085226397255094324/1100046203644821504/image.png',
    },
    {
        name: 'Xích Thêm Chút - XTC Remix',
        src: 'PNhYz6RmIr4',
        artists: [{ name: 'RPT Groovie' }, { name: 'RPT MCK' }, { name: 'tlinh' }],
        cover: 'https://cdn.discordapp.com/attachments/1085226397255094324/1100046203644821504/image.png',
    },
    {
        name: 'Chìm Sâu',
        src: 'Yw9Ra2UiVLw',
        artists: [{ name: 'RPT MCK' }, { name: 'Trung Trần' }],
    },
]

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
            if (res.status !== 200) return;
            const buffer = await res.arrayBuffer()
            const audioUrl = URL.createObjectURL(new Blob([buffer]))
            setAudioUrl(audioUrl)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // const handleLoadedMetadata = () => {
    //     setDuration(audioRef.current?.duration || 0)
    // }

    useEffect(() => {
        setQueue(exSongs)
    }, [])

    // useEffect(() => {
    //     if (isPause) setAudioUrl(null)
    //     else handleLoadAudio(queue[playingIndex].src)
    // }, [isPause])

    useEffect(() => {
        if (queue)
            handleLoadAudio(queue?.[playingIndex]?.src)
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
            <Flex
                direction={{ base: 'column', md: 'row' }}
                p={4}
                align={'flex-end'}
                bgColor={'rgba(0,0,0,1)'}
                boxShadow={
                    'inset 0 10px 25px -25px #FF0080, inset 0 10px 20px -20px #7928CA'
                }
                zIndex={5}
                h={'full'}
                className={'tw-relative'}
                // gap={'20'}
            >
                {loading && <div className={'tw-absolute tw-top-0 tw-right-0 tw-m-4'}>
                    <Spinner ml={2} />
                </div>}
                <DisplaySong />
                <Spacer />
                <AudioControl />
                <Spacer />
                <VolumeBar display={{ base: 'none', md: 'inherit' }} />
            </Flex>
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    className='tw-hidden'
                    onLoadedData={handleLoadedData}
                    // onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={() =>
                        setCurrentTime(audioRef.current?.currentTime || 0)
                    }
                    onEnded={() => nextSong()}
                />
            )}
        </>
    )
}

export default AudioPlayer
