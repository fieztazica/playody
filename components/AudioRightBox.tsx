import VolumeBar from '@/components/VolumeBar'
import { Divider, IconButton, Tooltip } from '@chakra-ui/react'
import NextLink from 'next/link'
import { MdQueueMusic } from 'react-icons/md'

export function AudioRightBox({ ...props }) {
    return (
        <div
            className={`tw-w-full tw-h-full tw-relative`} {...props}>
            <div
                className={'tw-hidden md:tw-flex tw-justify-center tw-items-center tw-absolute tw-bottom-0 tw-right-0 tw-space-x-2'}>
                <Tooltip label={'Queue'}>
                    <NextLink href={'/queue'}>
                        <IconButton
                            aria-label={'Queue'}
                            variant={'ghost'}
                            rounded={'full'}
                            fontSize={'2xl'}
                            size={'sm'}
                            icon={<MdQueueMusic />}
                        />
                    </NextLink>
                </Tooltip>
                <div className={"tw-h-8 tw-w-[1px] tw-rounded-full tw-bg-white/50"}>

                </div>
                <VolumeBar />
            </div>
        </div>
    )
}