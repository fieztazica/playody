import { Profile, Track } from '@/typings'
import MainLayout from './MainLayout'
import Head from 'next/head'
<<<<<<< HEAD
import { TrackCard } from "./TrackCard";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

function PostCard() {
    // TODO: a card for feed page posts
    const expTrack : Track = {
        name: "Thoi Em Dung DI",
        src: "http",
        duration_s: 320,
        id: "321",
        artists: [],
        author: "tao",
        created_at: new Date("12/12/2012").toLocaleString(),
        is_verified: false,
        genres: null,
        image_url: ""
=======
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
>>>>>>> main
    }

    return (
        <Box borderRadius='md' boxShadow='md' bg={"blackAlpha.300"} p={2} width={'full'}>
            <div className={"tw-flex tw-justify-between tw-items-center tw-p-2"}>
                <Text fontWeight='bold'>
                    @<span className={"hover:tw-underline"}>{track.profiles?.full_name || 'unknown'}</span> {Date.now() - (new Date(track.created_at || 0)).valueOf() < 3600 * 1000 ? " has just" : ""} uploaded a track
                </Text>
                <Text fontSize='sm' color='gray.500'>
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




