import { AudioCtxType, LoopMode, Track } from '@/typings'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { ApiResConvertSuccess, ApiResError } from '@/typings/apiRes'

export const AudioCtx = createContext<AudioCtxType | null>(null)

export function AudioCtxProvider({ children }: { children: React.ReactNode }) {
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
        } while (playingIndex === randomIndex)
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
        if (queue && queue.length && audioRef.current) {
            if (isPause || playingIndex === null) return
            switch (loopMode) {
                case 'none':
                    setPreviousIndexes((v) => [playingIndex, ...v])
                    if (
                        queue
                            .map((v, i) => i)
                            .every((ele) => previousIndexes.includes(ele))
                    ) {
                        setPlayingIndex(0)
                        setIsPause(true)
                    }
                    if (!shuffle) {
                        setPlayingIndex((v) => v as number + 1)
                    } else setPlayingIndex(getRandomIndexInQueue())
                    console.log(previousIndexes)
                    break
                case 'queue':
                    setPreviousIndexes((v) => [playingIndex, ...v])
                    if (!shuffle) {
                        setPlayingIndex((v) => v as number + 1)
                    } else setPlayingIndex(getRandomIndexInQueue())
                    break
                case 'song':
                    // audioRef.current.currentTime = 0

                    audioRef.current.play()
                    break
            }
        }
    }

    const addToQueue = async (trackId: string) => {
        const res: ApiResConvertSuccess | ApiResError = await fetch(`/api/spotify/convert?trackId=${trackId}`).then(r => r.json())

        if ('error' in res) throw new Error(res.message, (res as ApiResError).error)

        const spotifyData = (res as ApiResConvertSuccess).data.spotify

        const topVideo = (res as ApiResConvertSuccess).data.videos[0]

        const track: Track = {
            name: spotifyData.name,
            src: topVideo.id,
            artists: spotifyData.artists,
            album: spotifyData.album,
            duration_ms: spotifyData.duration_ms,
        }

        setQueue(q => [...q, track])
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

        if (queue.length && !playingIndex) setPlayingIndex(0)

        if (playingIndex && (playingIndex >= queue.length || playingIndex < 0)) setPlayingIndex(0)

        if (playingIndex !== null)
            console.log(queue[playingIndex])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queue, playingIndex, volume])

    // useEffect(() => {
    //     if (!isPause) {
    //         audioRef.current?.pause()
    //     } else {
    //         audioRef.current?.play()
    //     }
    // }, [isPause])

    // useEffect(() => {
    //     // Pause and clean up on unmount
    //     return () => {
    //         //@ts-ignore
    //         audioRef.current.pause();
    //         // clearInterval(intervalRef.current);
    //     }
    // }, []);


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
    }

    return (
        <AudioCtx.Provider value={sharedStates}>{children}</AudioCtx.Provider>
    )
}

export function useAudioCtx(): AudioCtxType {
    return useContext(AudioCtx) as AudioCtxType
}
