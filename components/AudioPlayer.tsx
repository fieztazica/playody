import { Box } from '@chakra-ui/react'
import { useRef } from 'react'
import DisplaySong from './DisplaySong'

function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null)
    return (
        <>
            <Box
                h="full"
                p={4}
            >
                <DisplaySong />
            </Box>
        </>
    )
}

export default AudioPlayer
