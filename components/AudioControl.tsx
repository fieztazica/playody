import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { LoopMode } from '@/typings'
import {
    ButtonGroup,
    IconButton,
    Stack,

} from '@chakra-ui/react'
import {
    BsFillSkipBackwardFill,
    BsSkipForwardFill,
    BsFillPlayFill,
    BsRepeat,
    BsRepeat1,
    BsShuffle,
    BsFillPauseFill,
} from 'react-icons/bs'
import SeekBar from '@/components/SeekBar'

function AudioControl({ ...props }) {
    const {
        isPause,
        setIsPause,
        audioRef,
        loopMode,
        setLoopMode,
        previousSong,
        setShuffle,
        shuffle,
        playingTrack,
        setPlayingTrack,
        queue,
        setPreviousTracks,
        getRandomTrack,
        nextSong
    } = useAudioCtx()

    const handlePausePlayClick = () => {
        if (!isPause) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPause(!isPause)
    }

    const toggleNextSong = () => {
        nextSong()
        // if (playingIndex === null) return
        // const nextIndex = shuffle
        //     ? getRandomIndexInQueue()
        //     : playingIndex + 1 >= queue.length
        //         ? 0
        //         : playingIndex + 1
        // setPlayingIndex(nextIndex)
        // setPreviousIndexes(a => [...a, playingIndex])
    }

    const LoopIcon = loopMode === 'song' ? BsRepeat1 : BsRepeat

    const toggleLoopMode = () => {
        const loopModes: [null, 'queue', 'song'] = [null, 'queue', 'song']

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
        <Stack
            justify={'center'}
            direction={'column'}
            align={'center'}
            spacing={2}
            w='full'
            h={'full'}
            p={2}
            {...props}
        >
            <ButtonGroup alignItems={'center'}>
                <IconButton
                    color={loopMode !== null ? 'pink.300' : undefined}
                    size={'sm'}
                    variant={'ghost'}
                    rounded={'full'}
                    icon={<LoopIcon />}
                    aria-label='loop button'
                    onClick={toggleLoopMode}
                    title={`${loopMode}`}
                />
                <IconButton
                    size={'sm'}
                    rounded={'full'}
                    icon={<BsFillSkipBackwardFill />}
                    aria-label='back button'
                    onClick={() => previousSong()}
                />
                <IconButton
                    rounded={'full'}
                    icon={
                        !isPause ? <BsFillPauseFill /> : <BsFillPlayFill />
                    }
                    onClick={handlePausePlayClick}
                    aria-label='pause/resume button'
                    w={'fit-content'}
                />
                <IconButton
                    size={'sm'}
                    rounded={'full'}
                    icon={<BsSkipForwardFill />}
                    aria-label='next button'
                    onClick={toggleNextSong}
                />
                <IconButton
                    color={shuffle ? 'pink.300' : undefined}
                    size={'sm'}
                    variant={'ghost'}
                    rounded={'full'}
                    icon={<BsShuffle />}
                    aria-label='shuffle button'
                    onClick={() => setShuffle(!shuffle)}
                />
            </ButtonGroup>
            <SeekBar />
        </Stack>
    )
}

export default AudioControl
