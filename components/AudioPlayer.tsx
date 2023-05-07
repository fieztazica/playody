import { Flex, Spacer, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DisplaySong from './DisplaySong'
import AudioControl from './AudioControl'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import VolumeBar from './VolumeBar'
import { Track } from '@/typings'

const exSongs: Track[] = [
    {
        name: 'GOTTA GO',
        src: 'SSojHpCIcdg',
        artists: [{ name: 'Ducci' }],
        cover: 'https://cdn.discordapp.com/attachments/1085226397255094324/1100046203644821504/image.png',
    },
    {
        name: 'Xích Thêm Chút - XTC Remix',
        src: 'PNhYz6RmIr4',
        artists: [{ name: 'RPT Groovie' }, { name: 'RPT Groovie' }, { name: 'RPT Groovie' }],
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
    const handleLoadedData = () => {
        setLoading(false)
        setDuration(audioRef.current?.duration || 0)
        if (!isPause) audioRef.current?.play()
    }

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0)
    }

    useEffect(() => {
        setQueue(exSongs)
    }, [])

    useEffect(() => {
        (async () => {
            if (!audioRef || !audioRef.current) return
            try {
                setLoading(true)
                const response = await fetch(`/api/yt/${queue?.[playingIndex]?.src}/audio`)
                audioRef.current.src = URL.createObjectURL(await response.blob())
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [playingIndex])

    return (
        <>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                p={4}
                align={'flex-end'}
                bgColor={'rgba(0,0,0,1)'}
                boxShadow={
                    'inset 0 10px 25px -25px #FF0080, inset 0 10px 20px -20px #7928CA'
                }
                h={'full'}
                className={'tw-relative'}
            >
                {loading && <div className={'tw-absolute tw-top-0 tw-right-0 tw-z-10 tw-m-4'}>
                    Loading {exSongs[playingIndex].name}
                    <Spinner ml={2} />
                </div>}
                <DisplaySong />
                <Spacer />
                <AudioControl />
                <Spacer />
                <VolumeBar display={{ base: 'none', md: 'inherit' }} />
            </Flex>
            {!!queue.length && (
                <audio
                    ref={audioRef}
                    className='tw-hidden'
                    onLoadedData={handleLoadedData}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={() =>
                        setCurrentTime(audioRef.current?.currentTime || 0)
                    }
                    onEnded={() => nextSong()}
                ></audio>
            )}
        </>
    )
}

export default AudioPlayer
