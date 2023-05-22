import { AudioCtxType, LoopMode, Playlist, Track } from '@/typings'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

export const AudioCtx = createContext<AudioCtxType | null>(null)

export function AudioCtxProvider({ children }: { children: React.ReactNode }) {
    const user = useUser()
    const supabaseClient = useSupabaseClient<Database>()
    const toast = useToast()
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [isPause, setIsPause] = useState<boolean>(true)
    const [volume, setVolume] = useState<number>(0)
    const [loopMode, setLoopMode] = useState<LoopMode>('none')
    const [shuffle, setShuffle] = useState<boolean>(false)
    const [queue, setQueue] = useState<Track[]>([])
    const [playingIndex, setPlayingIndex] = useState<number | null>(null)
    const [previousIndexes, setPreviousIndexes] = useState<number[]>([])

    const getRandomIndexInQueue = () => {
        let randomIndex = 0
        do {
            randomIndex = Math.floor(Math.random() * queue.length)
        } while (playingIndex == randomIndex && playingIndex == queue.length)
        return randomIndex
    }

    const previousSong = () => {
        if (!previousIndexes.length || !previousIndexes) return

        setPreviousIndexes((a) => {
            const tIndexes = [...a]
            const previousIndex = tIndexes.shift()!
            setPlayingIndex(previousIndex)
            return [...tIndexes]
        })
    }

    const nextSong = () => {
        if (queue.length && playingIndex !== null) {
            if (loopMode !== 'song') setPreviousIndexes((v) => [playingIndex, ...v])
            switch (loopMode) {
                case 'none':
                    if (
                        queue
                            .map((v, i) => i)
                            .every((ele) => previousIndexes.includes(ele))
                    ) {
                        setPlayingIndex(0)
                        setIsPause(true)
                        break
                    }
                    if (!shuffle) {
                        setPlayingIndex((v) => v as number + 1 >= queue.length ? 0 : v as number + 1)
                    } else setPlayingIndex(getRandomIndexInQueue())
                    break
                case 'queue':
                    if (!shuffle) {
                        setPlayingIndex((v) => v as number + 1 >= queue.length ? 0 : v as number + 1)
                    } else setPlayingIndex(getRandomIndexInQueue())
                    break
                case 'song':
                    // audioRef.current.currentTime = 0
                    audioRef.current?.play()
                    break
            }
        }
    }

    const addToQueue = async (track: Track) => {
        if (!queue.map(v => v.id).includes(track.id))
            setQueue(q => [...q, track])
        if (playingIndex === null) setPlayingIndex(0)
        if (queue.length && isPause) nextSong()
        toast({
            status: 'success',
            title: 'Added to queue',
            size: 'sm',
        })
    }

    async function addTrackToPlaylist(playlist: Playlist, track: Track) {
        try {
            if (!user)
                throw 'Unauthenticated'

            if ((playlist.trackIds || []).includes(track.id)) throw {
                message: `You already have this song in ${playlist.name}`
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
        if (volume !== 0) localStorage.setItem('app-volume', `${volume}`)

        if (!queue.length && !isPause) {
            setDuration(0)
            setCurrentTime(0)
            setIsPause(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queue, playingIndex, volume])

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
        playingIndex,
        setPlayingIndex,
        previousIndexes,
        setPreviousIndexes,
        nextSong,
        previousSong,
        addToQueue,
        getRandomIndexInQueue,
        addTrackToPlaylist
    }

    return (
        <AudioCtx.Provider value={sharedStates}>{children}</AudioCtx.Provider>
    )
}

export function useAudioCtx(): AudioCtxType {
    return useContext(AudioCtx) as AudioCtxType
}
