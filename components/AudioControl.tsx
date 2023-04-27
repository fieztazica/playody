import { useAudioCtx } from '@/lib/contexts/AudioContext'
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
                        size="sm"
                        variant={'ghost'}
                        rounded={'full'}
                        icon={<BsRepeat />}
                        aria-label="loop button"
                    />

                    <IconButton
                        rounded={'full'}
                        icon={<BsFillSkipBackwardFill />}
                        aria-label="back button"
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
                    />
                    <IconButton
                        size="sm"
                        variant={'ghost'}
                        rounded={'full'}
                        icon={<BsShuffle />}
                        aria-label="shuffle button"
                    />
                </Stack>
                <Stack direction={'row'} w="full" spacing={4}>
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
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
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
