import { AudioCtxType, LoopMode, Track } from '@/typings'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

export const AudioCtx = createContext<AudioCtxType | null>(null)

export function AudioCtxProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [isPause, setIsPause] = useState<boolean>(true)
    const [volume, setVolume] = useState<number>(50)
    const [loopMode, setLoopMode] = useState<LoopMode>('none')
    const [queue, setQueue] = useState<Track[]>([])

    let sharedStates = {
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
    }

    return (
        <AudioCtx.Provider value={sharedStates}>{children}</AudioCtx.Provider>
    )
}

export function useAudioCtx(): AudioCtxType {
    return useContext(AudioCtx) as AudioCtxType
}
