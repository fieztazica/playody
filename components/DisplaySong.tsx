import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { AspectRatio, Box, Image, Square, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

function DisplaySong({ ...props }) {
    const { queue, playingIndex } = useAudioCtx()
    const nowPlaying = queue[playingIndex]

    return (
        <Stack
            h="full"
            direction={'row'}
            align={'center'}
            justifyContent={'center'}
            overflow={'hidden'}
            minW="fit-content"
            {...props}
        >
            <Image
                src={nowPlaying?.cover}
                alt={`${nowPlaying?.name}'s cover`}
                objectFit={'cover'}
                w="6em"
                h="6em"
                boxShadow={'0 0 20px -15px white'}
                display={{ base: 'none', md: 'flex' }}
                bg="rgba(255,255,255,0.1)"
            />
            <Stack justifyItems={'center'}>
                <Box overflow={'hidden'} className="running">
                    <Text
                        fontSize={18}
                        fontWeight={'bold'}
                        title={`${nowPlaying?.name}`}
                    >
                        {nowPlaying?.name || 'No Song Playing'}
                    </Text>
                </Box>
                <Box overflow={'hidden'} className="running">
                    <Text
                        fontSize={16}
                        fontWeight={'light'}
                        title={`${nowPlaying?.artists
                            ?.map((v) => v.name)
                            .join(', ')}`}
                    >
                        {nowPlaying?.artists?.map((v) => v.name).join(', ')}
                    </Text>
                </Box>
            </Stack>
        </Stack>
    )
}

export default DisplaySong
