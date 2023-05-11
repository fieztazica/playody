// @flow
import * as React from 'react'
import { Card, CardBody } from '@chakra-ui/card'
import { Box, Flex, Heading, Icon, IconButton, Image, Link, Stack, Text, Tooltip } from '@chakra-ui/react'
import { BsFillPlayFill } from 'react-icons/bs'

type Props = {
    track: SpotifyApi.TrackObjectFull
};

export function TrackCard({ track, ...props }: Props) {
    const trackDuration = track.duration_ms / 1000
    const trackDurationMins = Math.floor(trackDuration / 60)
    const trackDurationSecs = Math.floor(trackDuration - trackDurationMins * 60)
    const trackDurationString = `${trackDurationMins}:${trackDurationSecs.toString().padStart(2, '0')}`

    return (
        <Card direction={'row'}
              variant={'unstyled'}
              p={2}
              bgColor={'rgba(0,0,0,0.2)'}
              _hover={
                  {
                      bgColor: 'rgba(0,0,0,0.5)',
                  }
              }
              role={'group'}
        >
            <Tooltip label={`Play ${track.name}`}>
                <Box
                    className={'tw-aspect-square'}
                    sx={{
                        bg: `url(${track.album.images[0].url}) center/cover no-repeat`,
                        boxSize: '50px',
                    }}
                    mr={2}
                    cursor={'pointer'}
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
                        <Text fontWeight={'semibold'} noOfLines={1} size='sm'>{track.name}</Text>
                        <Text color={'whiteAlpha.800'} fontSize={'sm'}>
                            {track.artists.map<React.ReactNode>(v =>
                                (<Link
                                    key={v.id}
                                    href={v.external_urls.spotify}
                                    isExternal={true}
                                >
                                    {v.name}
                                </Link>),
                            ).reduce((prev, curr) => [prev, ', ', curr])}
                        </Text>
                    </Stack>
                    <Flex justify={'center'} align={'center'} gap={4} px={2}>
                        <Text fontSize='sm'>
                            {trackDurationString}
                        </Text>
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