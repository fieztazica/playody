import { AudioCtxType, LoopMode, Playlist, Track } from '@/typings'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import Head from 'next/head'

export const AudioCtx = createContext<AudioCtxType | null>(null)

export function AudioCtxProvider({ children, title }: { children: React.ReactNode, title?: string }) {
    const user = useUser()
    const supabaseClient = useSupabaseClient<Database>()
    const toast = useToast()
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [isPause, setIsPause] = useState<boolean>(true)
    const [volume, setVolume] = useState<number>(0)
    const [loopMode, setLoopMode] = useState<LoopMode>(null)
    const [shuffle, setShuffle] = useState<boolean>(false)
    const [queue, setQueue] = useState<Track[]>([])
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null)
    const [previousTracks, setPreviousTracks] = useState<Track[]>([])

    const getRandomTrack = () => {
        let rand
        do {
            rand = queue[Math.floor(Math.random() * queue.length)]
        } while (rand === playingTrack)
        return rand as Track
    }

    const previousSong = () => {
        if (!previousTracks.length || !previousTracks) return

        setPreviousTracks((a) => {
            const tempTracks = [...a]
            const topTrack = tempTracks.shift()!
            setPlayingTrack(topTrack)
            return [...tempTracks]
        })
    }

    const nextSong = () => {
        if (queue.length) {
            if (!playingTrack) {
                setPlayingTrack(queue[0])
                return
            }
            if (loopMode !== 'song') setPreviousTracks((v) => [playingTrack, ...v])
            let nowQueue = [...queue.filter(v => v !== playingTrack)]
            switch (loopMode) {
                case null:
                    if (
                        queue.every((ele) => previousTracks.includes(ele))
                    ) {
                        setPlayingTrack(null)
                        setIsPause(true)
                        break
                    }
                    if (!shuffle) {
                        setPlayingTrack(nowQueue.shift() || null)
                    } else setPlayingTrack(getRandomTrack())
                    break
                case 'queue':
                    if (!shuffle) {
                        if (queue.length > 1)
                            setPlayingTrack(nowQueue.shift() || null)
                        else {
                            if (audioRef.current) {
                                audioRef.current.currentTime = 0
                                audioRef.current.play()
                            }
                        }
                    } else setPlayingTrack(getRandomTrack())
                    break
                case 'song':
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0
                        audioRef.current.play()
                    }
                    break
            }
        }
    }

    const addToQueue = (track: Track) => {
        if (!queue.map(v => v.id).includes(track.id))
            setQueue(q => [...q, track])
        if (playingTrack === null)
            setPlayingTrack(track)
        if (queue.length && isPause) nextSong()
        toast({
            status: 'success',
            title: 'Added to queue',
            size: 'sm',
        })
    }

    const removeFromQueue = (track: Track) => {
        if (!queue.length) return
        if (!queue.map(v => v.id).includes(track.id))
            return

        setQueue(q => [...queue.filter(v => v.id != track.id)])

        toast({
            status: 'success',
            title: 'Removed from queue',
            size: 'sm',
        })
    }

    async function addTrackToPlaylist(playlist: Playlist, track: Track) {
        try {
            if (!user)
                throw {
                    message: 'You need to sign in first',
                }

            if ((playlist.trackIds || []).includes(track.id)) throw {
                message: `You already have this song in ${playlist.name}`,
            }

            const toAddTrackIs = [...(playlist.trackIds || []).filter(v => v !== track.id), track.id]

            const updateRes = await supabaseClient
                .from('playlists')
                .update({
                    trackIds: toAddTrackIs,
                })
                .eq('author', user.id).eq('name', playlist.name)

            if (updateRes.error) {
                throw updateRes.error
            }

            toast({
                title: `Added to ${playlist.name}`,
                status: 'success',
            })
        } catch (e: any) {
            if (e.message)
                toast({
                    title: `${e.message}`,
                    status: 'error',
                })
            console.error(e)
        }
    }

    useEffect(() => {
        const volumeSto = Number.parseInt(
            localStorage.getItem('app-volume') || `50`,
        )
        if (volumeSto) setVolume(volumeSto)
    }, [])

    useEffect(() => {
        if (!queue.length && !isPause) {
            setDuration(0)
            setCurrentTime(0)
            setIsPause(true)
        }
    }, [queue, playingTrack])

    useEffect(() => {
        if (volume !== 0) localStorage.setItem('app-volume', `${volume}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume])

    let sharedStates: AudioCtxType = {
        audioRef,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        isPause,
        setIsPause,
        volume,
        setVolume,
        loopMode,
        setLoopMode,
        queue,
        setQueue,
        shuffle,
        setShuffle,
        playingTrack,
        setPlayingTrack,
        previousTracks,
        setPreviousTracks,
        nextSong,
        previousSong,
        addToQueue,
        removeFromQueue,
        getRandomTrack,
        addTrackToPlaylist,
    }

    return (
        <>
            <Head>
                <title>{(playingTrack && !isPause) ? `${playingTrack.name} - ${playingTrack.artists.join(', ')} - Playody` : title ? `Playody | ${title}` : 'Playody'}</title>
            </Head>
            <AudioCtx.Provider value={sharedStates}>{children}</AudioCtx.Provider>
        </>
    )
}

export function useAudioCtx(): AudioCtxType {
    return useContext(AudioCtx) as AudioCtxType
}
