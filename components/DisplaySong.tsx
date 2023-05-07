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
    const nowPlaying = queue[playingIndex]

    return (
        <Stack
            h='full'
            direction={'row'}
            align={'center'}
            justifyContent={'left'}
            maxW={'2xs'}
            w='full'
            {...props}
        >
            <Image
                src={nowPlaying?.cover}
                alt={`${nowPlaying?.name}'s cover`}
                title={`${nowPlaying?.name}'s cover`}
                objectFit={'cover'}
                w='6em'
                h='6em'
                boxShadow={'0 0 20px -15px white'}
                display={{ base: 'none', md: 'flex' }}
                bg='rgba(255,255,255,0.1)'
            />
            <VStack
                align='stretch'
                // bg="yellow"
                overflow={'hidden'}
            >
                <p className={'tw-text-ellipsis tw-overflow-hidden tw-text-xl tw-font-bold'}
                   title={nowPlaying?.name || 'No Song Playing'}>
                    {nowPlaying?.name || 'No Song Playing'}
                </p>
                {/*<Text*/}
                {/*    noOfLines={2}*/}
                {/*    fontSize={18}*/}
                {/*    fontWeight={'bold'}*/}
                {/*    title={`${nowPlaying?.name}`}*/}
                {/*>*/}
                {/*    {nowPlaying?.name || 'No Song Playing'}*/}
                {/*</Text>*/}
                <div className={'container'}>
                    <div className={"tw-truncate tw-duration-300 hover:animated"}>
                         <span
                             title={nowPlaying?.artists?.map((v) => v.name).join(', ') || 'No artist'}>
                            {nowPlaying?.artists?.map((v) => v.name).join(', ')}
                        </span>
                    </div>

                </div>

                {/*<Text*/}
                {/*    noOfLines={1}*/}
                {/*    fontSize={16}*/}
                {/*    fontWeight={'light'}*/}
                {/*    title={`${nowPlaying?.artists*/}
                {/*        ?.map((v) => v.name)*/}
                {/*        .join(', ')}`}*/}
                {/*>*/}
                {/*    {nowPlaying?.artists?.map((v) => v.name).join(', ')}*/}
                {/*</Text>*/}
            </VStack>
        </Stack>
    )
}

export default DisplaySong
