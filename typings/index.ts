import { NextPage } from 'next'
import { AppProps } from 'next/app'
import {
    Dispatch,
    ReactElement,
    ReactNode,
    RefObject,
    SetStateAction,
} from 'react'
import { Database } from '@/typings/supabase'
import { Session, SupabaseClient } from '@supabase/supabase-js'

export interface UserProfile {
    country: string
    display_name: string
    email: string
    explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
    }
    external_urls: { spotify: string }
    followers: { href: string; total: number }
    href: string
    id: string
    images: Image[]
    product: string
    type: string
    uri: string
}

interface Image {
    url: string
    height: number
    width: number
}

export type AppCtxType = {
    // theme: 'dark' | 'light'
    // supabaseClient: SupabaseClient<Database>
}

export type AudioCtxType = {
    audioRef: RefObject<HTMLAudioElement>
    currentTime: number
    setCurrentTime: Dispatch<SetStateAction<number>>
    duration: number
    setDuration: Dispatch<SetStateAction<number>>
    isPause: boolean
    setIsPause: Dispatch<SetStateAction<boolean>>
    volume: number
    setVolume: Dispatch<SetStateAction<number>>
    loopMode: LoopMode
    setLoopMode: Dispatch<SetStateAction<LoopMode>>
    queue: Track[]
    setQueue: Dispatch<SetStateAction<Track[]>>
    shuffle: boolean
    setShuffle: Dispatch<SetStateAction<boolean>>
    playingIndex: number | null
    setPlayingIndex: Dispatch<SetStateAction<number | null>>
    previousIndexes: number[]
    setPreviousIndexes: Dispatch<SetStateAction<number[]>>
    nextSong: () => void
    previousSong: () => void,
    addToQueue: (trackId: string) => Promise<void>
}

export type Track = Database["public"]["Tables"]["tracks"]["Row"]

export type LoopMode = 'queue' | 'song' | 'none'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps<{
    initialSession: Session
}> & {
    Component: NextPageWithLayout
}
