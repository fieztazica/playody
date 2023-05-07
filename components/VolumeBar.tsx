import { useAudioCtx } from '@/lib/contexts/AudioContext'
import {
    Box,
    Flex,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Tooltip,
    useDisclosure,
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
    const { onOpen, onClose, isOpen, onToggle } = useDisclosure()
    const [showTooltip, setShowTooltip] = useState(false)
    const [sliderValue, setSliderValue] = useState<number>(volume)
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
        setSliderValue((v) => (v != 0 ? 0 : tempVol))
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }
        if (volume != 0) setTempVol(volume)
        setSliderValue(volume)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume])

    return (
        <Flex align={'end'} onMouseLeave={onClose} {...props}>
            <Popover placement="top" isOpen={isOpen}>
                <PopoverTrigger>
                    <IconButton
                        fontSize={'2xl'}
                        aria-label="Volume"
                        icon={<VolumeIcon />}
                        variant={isOpen ? 'solid' : 'ghost'}
                        rounded={'full'}
                        onClick={onVolumeButtonClick}
                        onMouseEnter={onOpen}
                    />
                </PopoverTrigger>
                <PopoverContent
                    zIndex={4}
                    rounded={'full'}
                    maxW="40px"
                    bg="whiteAlpha.300"
                    borderColor={'whiteAlpha.500'}
                    // onBlur={onClose}
                >
                    <Box
                        px={2}
                        py={4}
                        maxW="50px"
                        h="fit-content"
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        <Slider
                            value={sliderValue}
                            onChange={(v) => setSliderValue(v)}
                            onChangeEnd={(v) => setVolume(v)}
                            orientation="vertical"
                            max={100}
                            min={0}
                            minH={32}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <SliderTrack
                                boxSize={2}
                                rounded={'full'}
                                bg="purple.900"
                            >
                                <SliderFilledTrack bg="pink.700" />
                            </SliderTrack>
                            <Tooltip
                                label={`${sliderValue}%`}
                                isOpen={showTooltip}
                                placement="left"
                            >
                                <SliderThumb boxSize={4} />
                            </Tooltip>
                        </Slider>
                    </Box>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}

export default VolumeBar
