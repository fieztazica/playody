import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { LoopMode } from '@/typings'
import {
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
        nextSong,
        previousSong,
        setShuffle,
        shuffle,
        playingIndex,
        setPlayingIndex,
        queue,
        setPreviousIndexes,
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
        setPlayingIndex(playingIndex + 1 >= queue.length ? 0 : playingIndex + 1)
        setPreviousIndexes(a => [...a, playingIndex])
        // nextSong()
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
        <Stack
            justify={'center'}
            align={'center'}
            spacing={2}
            w='full'
            h={'full'}
            p={2}
            {...props}
        >
            <Stack direction={'row'} align={'center'} justify={"center"}>
                <IconButton
                    color={loopMode !== 'none' ? 'pink.300' : undefined}
                    fontSize={{ base: 'xs', md: 'lg' }}
                    size={{ base: 'xs', md: 'sm' }}
                    variant={'ghost'}
                    rounded={'full'}
                    icon={<LoopIcon />}
                    aria-label='loop button'
                    onClick={toggleLoopMode}
                    title={`${loopMode}`}
                />
                <IconButton
                    rounded={'full'}
                    size={{ base: 'xs', md: 'md' }}
                    icon={<BsFillSkipBackwardFill />}
                    aria-label='back button'
                    onClick={() => previousSong()}
                />
                <IconButton
                    fontSize={{ base: 'xs', md: '4xl' }}
                    size={{ base: 'xs', md: 'lg' }}
                    rounded={'full'}
                    icon={
                        !isPause ? <BsFillPauseFill /> : <BsFillPlayFill />
                    }
                    onClick={handlePausePlayClick}
                    aria-label='pause/resume button'
                />
                <IconButton
                    rounded={'full'}
                    size={{ base: 'xs', md: 'md' }}
                    icon={<BsSkipForwardFill />}
                    aria-label='next button'
                    onClick={toggleNextSong}
                />
                <IconButton
                    color={shuffle ? 'pink.300' : undefined}
                    fontSize={{ base: 'xs', md: 'lg' }}
                    size={{ base: 'xs', md: 'sm' }}
                    variant={'ghost'}
                    rounded={'full'}
                    icon={<BsShuffle />}
                    aria-label='shuffle button'
                    onClick={() => setShuffle(!shuffle)}
                />
            </Stack>
            <SeekBar />
        </Stack>
    )
}

export default AudioControl
