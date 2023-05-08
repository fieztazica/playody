import { useAudioCtx } from '@/lib/contexts/AudioContext'
import {
    Box,
    Flex, HStack,
    IconButton,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Tooltip,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
    BsFillVolumeUpFill,
    BsFillVolumeDownFill,
    BsFillVolumeMuteFill,
    BsFillVolumeOffFill,
} from 'react-icons/bs'

function VolumeBar({ ...props }) {
    const { volume, setVolume, audioRef } = useAudioCtx()
    const [showTooltip, setShowTooltip] = useState(false)
    // const [sliderValue, setSliderValue] = useState<number>(volume)
    const [tempVol, setTempVol] = useState<number>(volume)

    const VolumeIcon =
        volume > 75
            ? BsFillVolumeUpFill
            : volume > 25
                ? BsFillVolumeDownFill
                : volume > 0
                    ? BsFillVolumeOffFill
                    : BsFillVolumeMuteFill

    const onVolumeButtonClick = () => {
        setVolume((v) => (v != 0 ? 0 : tempVol))
        // setSliderValue((v) => (v != 0 ? 0 : tempVol))
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }
        if (volume != 0) setTempVol(volume)
        // setSliderValue(volume)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume, audioRef, audioRef.current])

    return (
        <HStack {...props}>
            <Slider
                value={volume}
                onChange={(v) => setVolume(v)}
                // onChangeEnd={(v) => setVolume(v)}
                orientation='horizontal'
                max={100}
                min={0}
                maxW={'50'}
                w={"full"}
                minW={'20'}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                // flexGrow={1}
            >
                <SliderTrack
                    boxSize={2}
                    rounded={'full'}
                    bg='purple.900'
                >
                    <SliderFilledTrack bg='pink.700' />
                </SliderTrack>
                <Tooltip
                    label={`${volume}%`}
                    isOpen={showTooltip}
                    placement='top'
                >
                    <SliderThumb boxSize={2} />
                </Tooltip>
            </Slider>
            <Tooltip
                label={volume == 0 ? 'Muted' : `${volume}%`}
                // isOpen={showTooltip}
                placement='top'
            >
                <IconButton
                    fontSize={'2xl'}
                    size={'sm'}
                    aria-label='Volume'
                    icon={<VolumeIcon />}
                    variant={'ghost'}
                    rounded={'full'}
                    onClick={onVolumeButtonClick}
                />
            </Tooltip>

        </HStack>
    )
}

export default VolumeBar
