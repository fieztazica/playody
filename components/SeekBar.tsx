import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text } from '@chakra-ui/react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

function SeekBar() {
    const {
        duration,
        currentTime,
        audioRef,
        setCurrentTime,
        playingTrack
    } = useAudioCtx()

    const currentMinutes = Math.floor(currentTime / 60)
    const currentSeconds = Math.floor(currentTime - currentMinutes * 60)

    const durationMinutes = Math.floor(duration / 60)
    const durationSeconds = Math.floor(duration - durationMinutes * 60)

    const handleSliderChange = (val: number) => {
        if (audioRef.current) {
            setCurrentTime(val)
            audioRef.current.currentTime = val
        }
    }

    return (
        <Stack key={'SeekBarComponent'} direction={'row'} w='full' spacing={4} justify={'center'} align={'center'}>
            <Text
                key={'time_consumed'}
                fontSize={{ base: 'xs', lg: 'md' }}
                color={playingTrack ? undefined : "gray"}
                minW={'max-content'}
            >
                <span>{currentMinutes.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span>{currentSeconds.toString().padStart(2, '0')}</span>
            </Text>
            <Slider
                key={'seek_bar'}
                colorScheme='pink'
                aria-label='slider-time'
                max={duration}
                value={currentTime}
                focusThumbOnChange={false}
                onChange={handleSliderChange}
                maxW='4xl'
                isDisabled={!playingTrack}
            >
                <SliderTrack key={'slider_track'} bg='purple.900'>
                    <SliderFilledTrack key={'slider_filled_track'} bg='pink.700' />
                </SliderTrack>
                <SliderThumb key={"slider_thumb"} />
            </Slider>
            <Text
                key={'time_left'}
                fontSize={{ base: 'xs', lg: 'md' }}
                color={playingTrack ? undefined : "gray"}
                minW={'max-content'}
            >
                <span>{durationMinutes.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span>{durationSeconds.toString().padStart(2, '0')}</span>
            </Text>
        </Stack>
    )
}

export default SeekBar