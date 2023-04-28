import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { LoopMode } from '@/typings'
import {
    Button,
    IconButton,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
} from '@chakra-ui/react'
import { RefObject, useEffect, useState } from 'react'
import {
    BsFillSkipBackwardFill,
    BsSkipForwardFill,
    BsFillPlayFill,
    BsRepeat,
    BsRepeat1,
    BsShuffle,
    BsFillPauseFill,
} from 'react-icons/bs'

function AudioControl({ ...props }) {
    const {
        isPause,
        duration,
        currentTime,
        setIsPause,
        audioRef,
        setCurrentTime,
        loopMode,
        setLoopMode,
        nextSong,
        previousSong,
        setShuffle,
        shuffle
    } = useAudioCtx()

    const currentMinutes = Math.floor(currentTime / 60)
    const currentSeconds = Math.floor(currentTime - currentMinutes * 60)

    const left = duration - currentTime
    const leftMinutes = Math.floor(left / 60)
    const leftSeconds = Math.floor(left - leftMinutes * 60)

    const handlePausePlayClick = () => {
        if (!isPause) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPause(!isPause)
    }

    const handleSliderChange = (val: number) => {
        if (audioRef.current) {
            setCurrentTime(val)
            audioRef.current.currentTime = val
        }
    }

    const LoopIcon = loopMode === 'song' ? BsRepeat1 : BsRepeat

    const toggleLoopMode = () => {
        const loopModes: ['none', 'song', 'queue'] = ['none', 'song', 'queue']

        const currentLoopIndex = loopModes.indexOf(loopMode)

        const nextMode: LoopMode =
            loopModes[
                currentLoopIndex + 1 >= loopModes.length
                    ? 0
                    : currentLoopIndex + 1
            ]

        setLoopMode(nextMode)
    }

    return (
        <>
            <Stack
                justifyItems={'center'}
                align={'center'}
                spacing={2}
                w="full"
                p={2}
                {...props}
            >
                <Stack direction={'row'} align={'center'}>
                    <IconButton
                        color={loopMode !== 'none' ? 'pink.300' : undefined}
                        fontSize={'lg'}
                        size="sm"
                        variant={'ghost'}
                        rounded={'full'}
                        icon={<LoopIcon />}
                        aria-label="loop button"
                        onClick={toggleLoopMode}
                        title={`${loopMode}`}
                    />

                    <IconButton
                        rounded={'full'}
                        icon={<BsFillSkipBackwardFill />}
                        aria-label="back button"
                        onClick={() => previousSong()}
                    />
                    <IconButton
                        fontSize={'4xl'}
                        size={'lg'}
                        rounded={'full'}
                        icon={
                            !isPause ? <BsFillPauseFill /> : <BsFillPlayFill />
                        }
                        onClick={handlePausePlayClick}
                        aria-label="pause/resume button"
                    />
                    <IconButton
                        rounded={'full'}
                        icon={<BsSkipForwardFill />}
                        aria-label="next button"
                        onClick={() => nextSong()}
                    />
                    <IconButton
                        color={!!shuffle ? 'pink.300' : undefined}
                        fontSize={'lg'}
                        size="sm"
                        variant={'ghost'}
                        rounded={'full'}
                        icon={<BsShuffle />}
                        aria-label="shuffle button"
                        onClick={() => setShuffle(!shuffle)}
                    />
                </Stack>
                <Stack direction={'row'} w="full" spacing={4} justifyContent={"center"}>
                    <Text minW={'max-content'}>
                        {currentMinutes.toString().padStart(2, '0')}:
                        {currentSeconds.toString().padStart(2, '0')}
                    </Text>
                    <Slider
                        colorScheme="pink"
                        aria-label="slider-time"
                        max={duration}
                        value={currentTime}
                        onChange={handleSliderChange}
                        maxW="4xl"
                    >
                        <SliderTrack bg="purple.900">
                            <SliderFilledTrack bg="pink.700" />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text minW={'max-content'}>
                        {leftMinutes.toString().padStart(2, '0')}:
                        {leftSeconds.toString().padStart(2, '0')}
                    </Text>
                </Stack>
            </Stack>
        </>
    )
}

export default AudioControl
