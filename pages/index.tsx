import { Inter } from 'next/font/google'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { JWT, getToken } from 'next-auth/jwt'
import { GetServerSidePropsContext } from 'next'
import Script from 'next/script'
import { ChangeEvent, Suspense, useEffect, useState } from 'react'
import useSpotify from '@/lib/hooks/useSpotify'
import { spotifyApi } from '@/lib/config/spotify'
import SpotifyWebApi from 'spotify-web-api-node'
import { Box, Button, Input } from '@chakra-ui/react'
import MainLayout from '@/components/layouts/MainLayout'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: any
    }
}

const Home = ({ tokenJWT }: { tokenJWT: JWT }) => {
    const { data: session, status } = useSession()
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const [query, setQuery] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const {setQueue} = useAudioCtx()

    const findSong = () => {
        if (query)
            spotifyApi.search(query, ['track']).then((r) => {
                console.log(r.body.tracks?.items)
                setSearchResults(r.body.tracks?.items!)
            })
    }

    useEffect(() => {}, [])

    return (
        <>
            <main className="tw-flex tw-flex-col tw-items-center tw-p-24 ">
                <p>
                    {status} as {session?.user?.name}
                </p>
                <p>Playing: {title}</p>
                {/* <button id="togglePlay">Toggle Play</button> */}
                <p>{session?.user?.email}</p>
                <div className="tw-min-w-fit">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => findSong()}
                        placeholder='Search spotify'
                    />
                </div>
                <div className="p-5">
                    {searchResults.map((v, i) => (
                        <div key={i.toString()}>
                            <a href={v.external_urls.spotify}>{v.name}</a>
                            <Button
                                ml={2}
                                size={'xs'}
                                onClick={() => console.log(v.album.uri)}
                            >
                                Play
                            </Button>
                        </div>
                    ))}
                </div>
                <button
                    className="bg-[#18D860] text-white p-2 rounded-full"
                    onClick={() => {
                        signOut()
                    }}
                >
                    Log out
                </button>
            </main>
        </>
    )
}

Home.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Home

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const secret = process.env.NEXTAUTH_SECRET
    const tokenJWT = await getToken({ req, secret })
    // console.log('JSON Web Token', tokenJWT)
    return {
        props: {
            tokenJWT,
        }, // will be passed to the page component as props
    }
}
