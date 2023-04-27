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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }
    }, [volume])

    return (
        <>
            <Flex align={'end'} {...props}>
                <Popover placement="top" isOpen={isOpen}>
                    <PopoverTrigger>
                        <IconButton
                            aria-label="Volume"
                            icon={<BsFillVolumeUpFill />}
                            variant={isOpen ? 'solid' : 'ghost'}
                            rounded={'full'}
                            onClick={onToggle}
                            onMouseEnter={onOpen}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        zIndex={4}
                        rounded={'full'}
                        maxW="40px"
                        bg="whiteAlpha.300"
                        borderColor={'whiteAlpha.500'}
                        onMouseLeave={onClose}
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
                            colorScheme='pink'
                                value={volume}
                                onChange={(v) => setVolume(v)}
                                orientation="vertical"
                                max={100}
                                min={0}
                                minH={32}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <SliderTrack boxSize={2} rounded={'full'}>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <Tooltip
                                    label={`${volume}%`}
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
        </>
    )
}

export default VolumeBar
