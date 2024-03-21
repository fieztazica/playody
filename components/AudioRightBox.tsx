import VolumeBar from '@/components/VolumeBar'
import { IconButton, Tooltip } from '@chakra-ui/react'
import NextLink from 'next/link'
import { MdQueueMusic, MdPlaylistAdd, MdLyrics } from 'react-icons/md'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import AddToPlaylistModal from '@/components/AddToPlaylistModal'

export function AudioRightBox({ ...props }) {
    const { playingTrack, queue } = useAudioCtx()

    return (
        <div
            className={'tw-flex tw-w-fit tw-justify-center tw-items-center tw-space-x-2'}
            {...props}
        >
            {
                playingTrack !== null && <>
                    <AddToPlaylistModal track={playingTrack}>
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
                </>
            }
            <Tooltip label={`Lyrics`}>
                <NextLink href={'/lyrics'}>
                    <IconButton
                        aria-label={'Lyrics'}
                        variant={'ghost'}
                        rounded={'full'}
                        fontSize={'xl'}
                        size={'sm'}
                        icon={<MdLyrics />}
                    />
                </NextLink>
            </Tooltip>
            <Tooltip label={`Queue (${queue.length})`}>
                <NextLink href={'/queue'}>
                    <div className={'tw-relative'}>
                        <div
                            className={'tw-absolute lg:tw-hidden tw-top-0 tw-left-0 tw-px-1 tw-rounded-full tw-z-10 tw-bg-purple-500/90 tw-text-white/80 tw-text-sm'}>
                            {queue.length}
                        </div>
                        <IconButton
                            aria-label={'Queue'}
                            variant={'ghost'}
                            rounded={'full'}
                            fontSize={'2xl'}
                            size={'sm'}
                            icon={<MdQueueMusic />}
                        />
                    </div>

                </NextLink>
            </Tooltip>
            <div className={'tw-hidden lg:tw-block tw-h-8 tw-w-[1px] tw-rounded-full tw-bg-white/50'}>

            </div>
            <VolumeBar />
        </div>
    )
}