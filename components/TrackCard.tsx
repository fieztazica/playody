// @flow
import * as React from 'react'
import { Card, CardBody } from '@chakra-ui/card'
import {
    Box,
    Flex,
    Heading,
    Icon,
    IconButton,
    Image,
    Link,
    Stack,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { BsFillPlayFill } from 'react-icons/bs'
import { Track } from '@/typings'

type Props = {
    track: Track
    onClickCover?: () => void
}

export function TrackCard({ track, onClickCover, ...props }: Props) {
    const trackDuration = (track.duration_s || 0)
    const trackDurationMins = Math.floor(trackDuration / 60)
    const trackDurationSecs = Math.floor(trackDuration - trackDurationMins * 60)
    const trackDurationString = `${trackDurationMins}:${trackDurationSecs
        .toString()
        .padStart(2, '0')}`

    return (
        <Card
            direction={'row'}
            variant={'unstyled'}
            p={2}
            bgColor={'rgba(0,0,0,0.2)'}
            _hover={{
                bgColor: 'rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 0 15px -8px #fff',
            }}
            _active={{
                bgColor: 'rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 0 15px -5px #fff',
            }}
            role={'group'}
            {...props}
        >
            <Tooltip label={`Play ${track.name}`}>
                <Box
                    className={'tw-aspect-square'}
                    sx={{
                        bg: `url(${track.image_url}) center/cover no-repeat`,
                        boxSize: '50px',
                    }}
                    mr={2}
                    cursor={'pointer'}
                    onClick={onClickCover}
                >
                    <Box
                        sx={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxSize: 'full',
                        }}
                        _groupHover={{
                            display: 'flex',
                            backdropFilter: 'auto',
                            backdropBrightness: '50%',
                        }}
                    >
                        <Icon as={BsFillPlayFill} boxSize={8} />
                    </Box>
                </Box>
            </Tooltip>
            <CardBody alignItems={'center'}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Stack spacing={1}>
                        <Text fontWeight={'semibold'} noOfLines={1} size="sm">
                            {track.name}
                        </Text>
                        <Text color={'whiteAlpha.800'} fontSize={'sm'}>
                            {track.artists !== null &&
                                track.artists
                                    .map<React.ReactNode>((v, i) => (
                                        <Link
                                            key={`artist-${v}-${i}`}
                                        >
                                            {v}
                                        </Link>
                                    ))
                                    .reduce((prev, curr) => [prev, ', ', curr])}
                        </Text>
                    </Stack>
                    <Flex justify={'center'} align={'center'} gap={4} px={2}>
                        <Text fontSize="sm">{trackDurationString}</Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

/**
 * <div className={'tw-p-5'}>
 *                             <a href={v.external_urls.spotify}>{v.name}</a>
 *                             <Button
 *                                 ml={2}
 *                                 size={'xs'}
 *                                 onClick={() => console.log(v.id)}
 *                             >
 *                                 Play
 *                             </Button>
 *                         </div>
 */
