import { Box, Flex, Stack } from '@chakra-ui/react'
import { useContext, useEffect, useRef, useState } from 'react'
import DisplaySong from './DisplaySong'
import AudioControl from './AudioControl'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import VolumeBar from './VolumeBar'
import { Track } from '@/typings'

const exSongs: Track[] = [
    {
        name: 'Making My Way',
        src: 'https://cdn.discordapp.com/attachments/854996766154817559/1100978279063748660/M-TP_Making_My_Way_DEMO.mp3',
        artists: [{ name: 'Son Tung M-TP' }, { name: 'Onionn.' }],
    },
    {
        name: 'Gotta Go',
        src: '/api/yt/SSojHpCIcdg',
        artists: [{ name: 'DUCCI' }],
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
    } = useAudioCtx()

    const handleLoadedData = () => {
        setDuration(audioRef.current?.duration || 0)
        if (!isPause) audioRef.current?.play()
    }

    const handlePausePlayClick = () => {
        if (!isPause) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPause(!isPause)
    }

    useEffect(() => {
        setQueue(exSongs)
    }, [])

    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={5} p={4}>
            <DisplaySong />
            <AudioControl />
            <VolumeBar display={{ base: 'none', md: 'inherit' }} />
            {!!queue.length && (
                <audio
                    ref={audioRef}
                    className="tw-hidden"
                    // src="/api/yt/SSojHpCIcdg"
                    src={queue?.[0]?.src}
                    onLoadedData={handleLoadedData}
                    onTimeUpdate={() =>
                        setCurrentTime(audioRef.current?.currentTime || 0)
                    }
                    onEnded={() => setIsPause(true)}
                ></audio>
            )}
        </Stack>
    )
}

export default AudioPlayer
