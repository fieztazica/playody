import { useAudioCtx } from '@/lib/contexts/AudioContext'
import {
    AspectRatio,
    Box,
    Image,
    Square,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

function DisplaySong({ ...props }) {
    const { queue, playingIndex } = useAudioCtx()
    const nowPlaying = playingIndex != null ?  queue[playingIndex] : null

    return (
        <Stack
            h='full'
            direction={'row'}
            align={'center'}
            justifyContent={'left'}
            w='full'
            {...props}
        >
            <Image
                src={nowPlaying?.image_url || undefined}
                alt={`${nowPlaying?.name}'s cover`}
                title={`${nowPlaying?.name}'s cover`}
                objectFit={'cover'}
                maxW={{ base: '64px', md: '6em' }}
                maxH={{ base: '64px', md: '6em' }}
                boxShadow={'0 0 20px -15px white'}
                bg='rgba(255,255,255,0.1)'
                className={'tw-aspect-square'}
            />
            <VStack
                align='stretch'
                overflow={'hidden'}
            >
                <p className={'tw-text-ellipsis tw-overflow-hidden tw-text-base tw-font-bold md:tw-text-xl'}
                   title={nowPlaying?.name || 'No Song Playing'}>
                    {nowPlaying?.name || 'No Song Playing'}
                </p>
                <div className={'container tw-hidden md:tw-block'}>
                    <div className={'tw-truncate tw-duration-300 hover:animated'}>
                          <span className={'tw-text-sm md:tw-text-base'}
                               title={nowPlaying?.artists?.map((v) => v).join(', ') || 'No artist'}>
                            {nowPlaying?.artists?.map((v) => v).join(', ')}
                        </span>
                    </div>
                </div>
            </VStack>
        </Stack>
    )
}

export default DisplaySong
