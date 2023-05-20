import React, { useState } from 'react'
import { Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import NextLink from 'next/link'
import { TrackCard } from '@/components/TrackCard'
import { Track } from '@/typings'

const MyTracks = () => {
    const expTrack : Track = {
        name: "Thoi Em DUng DI",
        src: "http",
        duration_s: 320,
        id: "321",
        artists: null,
        author: "tao",
        created_at: "",
        is_verified: false,
        genres: null,
        image_url: ""
    }
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full" >
                {new Array<Track>(5).fill(expTrack).map((v, i) => (
                    
                   <div key={`search ${i}`} className='tw-flex tw-flex-col tw-space-y-2 tw-rounded-md tw-w-full' >
                    <div>{v.is_verified ? (
                        <div>
                        <br></br>
                            <TrackCard track={v} />
                        </div>
                    ) : (
                        <>
                        <br></br>
                        <div className='tw-bg-red-300'>
                        <TrackCard track={v}/>
                        </div>
                    </>
                    )}</div>
                   </div>
                ))}
            </div>
        </>
    )
}

MyTracks.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default MyTracks