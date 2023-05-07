import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text } from '@chakra-ui/react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { useEffect, useState } from 'react'

function SeekBar() {
    const {
        isPause,
        duration,
        currentTime,
        setIsPause,
        audioRef,
        setCurrentTime,
        playingIndex,
        setPlayingIndex,
    } = useAudioCtx()
    const [seekBarValue, setSeekBarValue] = useState<number>(currentTime)

    const currentMinutes = Math.floor(currentTime / 60)
    const currentSeconds = Math.floor(currentTime - currentMinutes * 60)

    const left = duration - currentTime
    const leftMinutes = Math.floor(left / 60)
    const leftSeconds = Math.floor(left - leftMinutes * 60)

    const handleSliderChange = (val: number) => {
        if (audioRef.current) {
            setCurrentTime(val)
            audioRef.current.currentTime = val
        }
    }

    return (
        <Stack direction={'row'} w='full' spacing={4} justifyContent={'center'}>
            <Text minW={'max-content'}>
                {currentMinutes.toString().padStart(2, '0')}:
                {currentSeconds.toString().padStart(2, '0')}
            </Text>
            <Slider
                colorScheme='pink'
                aria-label='slider-time'
                max={duration}
                value={currentTime}
                onChange={handleSliderChange}
                maxW='4xl'
            >
                <SliderTrack bg='purple.900'>
                    <SliderFilledTrack bg='pink.700' />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Text minW={'max-content'}>
                {leftMinutes.toString().padStart(2, '0')}:
                {leftSeconds.toString().padStart(2, '0')}
            </Text>
        </Stack>
    )
}

export default SeekBar