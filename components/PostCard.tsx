import { Profile, Track } from '@/typings'
import MainLayout from './MainLayout'
import Head from 'next/head'

import { TrackCard } from './TrackCard'
import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import React from 'react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)
dayjs().format()

function PostCard({ track }: { track: Track & { profiles: Profile | null } }) {
    const {addToQueue} = useAudioCtx()

    const rawTrack: Track = {
        ...track,
    }

    function handleDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, track: Track) {
        if (event.detail == 2) {
            addToQueue(track)
        }
    }

    return (
        <Box borderRadius='md' boxShadow='md' bg={"blackAlpha.300"} p={2} width={'full'}>
            <div className={"tw-flex tw-justify-between tw-items-center tw-p-2"}>
                <Text>
                    <span className={"tw-font-bold hover:tw-underline"}>@{track.profiles?.full_name || 'unknown'}</span> {Date.now() - (new Date(track.created_at || 0)).valueOf() < 3600 * 1000 ? " has just" : ""} uploaded a track
                </Text>
                <Text fontSize='sm' color='gray.500' title={`${new Date(track.created_at || 0).toLocaleString()}`}>
                     {dayjs(track.created_at).fromNow()}
                </Text>
            </div>
            <Box onClick={(e) => handleDoubleClick(e, track)}>
                <TrackCard bgColor={"rgba(0,0,0,0)"} track={rawTrack} onClickCover={() => addToQueue(rawTrack)}/>
            </Box>
        </Box>
    )
}

PostCard.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default PostCard




