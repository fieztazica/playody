import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { AspectRatio, Box, Image, Square, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

function DisplaySong({ ...props }) {
    const { queue } = useAudioCtx()
    const nowPlaying = queue[0]

    return (
        <Stack
            h="full"
            direction={'row'}
            w="fit-content"
            align={'center'}
            maxW={'300px'}
            overflow={'hidden'}
            {...props}
        >
            <Image
                src="https://cdn.discordapp.com/attachments/1085226397255094324/1100046203644821504/image.png"
                alt="song image"
                objectFit={'cover'}
                boxSize="90px"
                boxShadow={'0 0 20px -15px white'}
                display={{ base: 'none', md: 'block' }}
            />
            <Stack justifyItems={'center'}>
                <Box overflow={'hidden'} className="running" maxW="inherit">
                    <Text
                        noOfLines={2}
                        fontSize={18}
                        fontWeight={'bold'}
                        title={`${nowPlaying?.name}`}
                        whiteSpace={'pre-wrap'}
                        wordBreak={'break-all'}
                        display={'table'}
                        overflowWrap={'break-word'}
                    >
                        {nowPlaying?.name}
                    </Text>
                </Box>

                <Box overflow={'hidden'} className="running" maxW="inherit">
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
