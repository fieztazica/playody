// @flow
import * as React from 'react'
import {
    BackgroundProps,
    Box,
    BoxProps,
    Flex,
    Heading,
    Icon,
    IconButton,
    Image,
    Link,
    Stack,
    Text,
    Tooltip,
    Card,
    CardBody,
} from '@chakra-ui/react'
import { BsFillPlayFill } from 'react-icons/bs'
import { Track } from '@/typings'
import SearchLink from '@/components/SearchLink'
import { MdPlaylistAdd } from 'react-icons/md'
import AddToPlaylistModal from '@/components/AddToPlaylistModal'
interface Props extends BoxProps {
    track?: Track
    bgColor?: BackgroundProps['bgColor']
    onClickCover?: () => void
}

export function TrackCard({ track, bgColor = 'rgba(0,0,0,0.2)', onClickCover, ...props }: Props) {
    if (!track) return null;

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
            bgColor={bgColor}
            transition={"all"}
            transitionDuration={"0.3s"}
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
                        <Text as={Link}
                              onClick={onClickCover}
                              fontWeight={'semibold'}
                              noOfLines={1}
                              size='sm'>
                            {track.name}
                        </Text>
                        <Text color={'whiteAlpha.800'} fontSize={'sm'}>
                            {track.artists.length &&
                                track.artists
                                    .map<React.ReactNode>((v, i) => (
                                        <SearchLink
                                            key={`artist-${v}-${i}-${track.id}`}
                                            text={v} />
                                    ))
                                    .reduce((prev, curr) =>
                                        [prev, ', ', curr])
                            }
                        </Text>
                    </Stack>
                    <Flex justify={'center'} align={'center'} gap={2} px={2}>

                        {track.genres && track.genres.length &&
                            <Text fontSize='sm'>
                                {track.genres
                                        .map<React.ReactNode>((v, i) => (
                                            <SearchLink
                                                key={`genre-${v}-${i}-${track.id}`}
                                                text={v} />
                                        ))
                                        .reduce((prev, curr) =>
                                            [prev, ', ', curr])
                                }
                            </Text>
                        }
                        <AddToPlaylistModal track={track}>
                            <Tooltip label={'Add this song to playlist'}>
                                <IconButton
                                    aria-label={'Add to playlist'}
                                    variant={'ghost'}
                                    rounded={'full'}
                                    fontSize={'2xl'}
                                    size={'sm'}
                                    icon={<MdPlaylistAdd />}
                                />
                            </Tooltip>
                        </AddToPlaylistModal>
                        <Text fontSize='sm' title={`${track.duration_s}s`}>{trackDurationString}</Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
)
}

/**
*
    <div className={'tw-p-5'}>
        * <a href={v.external_urls.spotify}>{v.name}</a>
        * <Button
        *                                 ml={2}
        * size={'xs'}
        * onClick={() => console.log(v.id)}
        * >
        * Play
        * </Button>
*                         </div>
*/
