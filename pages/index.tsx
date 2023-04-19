import { Inter } from 'next/font/google'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { JWT, getToken } from 'next-auth/jwt'
import { GetServerSidePropsContext } from 'next'
import Script from 'next/script'
import { Suspense, useEffect, useState } from 'react'
import useSpotify from '@/lib/hooks/useSpotify'
import { spotifyApi } from '@/lib/config/spotify'
import SpotifyWebApi from 'spotify-web-api-node'

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: any
    }
}

export default function Home({ tokenJWT }: { tokenJWT: JWT }) {
    const { data: session, status } = useSession()
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const [query, setQuery] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [deviceId, setDeviceId] = useState<string>('')

    const findSong = () => {
        spotifyApi.search(query, ['track']).then((r) => {
            console.log(r.body.tracks?.items)
            setSearchResults(r.body.tracks?.items!)
        })
    }

    const playSong = (uri: string) => {
        spotifyApi.play({ context_uri: uri, device_id: deviceId })
    }

    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = tokenJWT.accessToken
            console.log(token)
            //@ts-ignore
            const player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                //@ts-ignore
                getOAuthToken: (cb) => {
                    cb(token)
                },
                volume: 0.5,
            })

            // Ready
            //@ts-ignore
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id)
                setDeviceId(device_id)
            })

            // Not Ready
            //@ts-ignore
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
            })

            //@ts-ignore
            player.addListener('initialization_error', ({ message }) => {
                console.error(message)
            })

            player.addListener(
                'player_state_changed',
                ({
                    //@ts-ignore
                    position,
                    //@ts-ignore
                    duration,
                    //@ts-ignore
                    track_window: { current_track },
                }) => {
                    console.log('Currently Playing', current_track)
                    setTitle(
                        `${current_track.name} / ${current_track.artists[0].name}`
                    )
                    console.log('Position in Song', position)
                    console.log('Duration of Song', duration)
                }
            )

            //@ts-ignore
            player.addListener('authentication_error', ({ message }) => {
                console.error(message)
            })

            //@ts-ignore
            player.addListener('account_error', ({ message }) => {
                console.error(message)
            })

            //@ts-ignore
            document.getElementById('togglePlay').onclick = function () {
                player.togglePlay()
            }

            player.connect()
        }
    }, [])

    return (
        <>
            <Script
                id="spotify-player"
                src="https://sdk.scdn.co/spotify-player.js"
            ></Script>
            <main className="flex min-h-screen flex-col items-center p-24">
                <p>
                    {status} as {session?.user?.name}
                </p>
                <p>Playing: {title}</p>
                <button id="togglePlay">Toggle Play</button>
                <p>{session?.user?.email}</p>
                <label>
                    Query:
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="text-black"
                        onBlur={() => findSong()}
                    ></input>
                </label>
                <div className="p-5">
                    {searchResults.map((v, i) => (
                        <div key={i.toString()}>
                            <a href={v.external_urls.spotify}>{v.name}</a>
                            <button
                                className="ml-2 px-1 bg-white rounded text-black"
                                onClick={() => playSong(v.album.uri)}
                            >
                                Play
                            </button>
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

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const secret = process.env.NEXTAUTH_SECRET
    const tokenJWT = await getToken({ req, secret })
    console.log('JSON Web Token', tokenJWT)
    return {
        props: {
            tokenJWT,
        }, // will be passed to the page component as props
    }
}
