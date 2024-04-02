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
import { UseDisclosureReturn } from '@chakra-ui/react'

export type Lyrics = Lyric[]

export type Lyric = {
    time: number
    text: string
}

export type AppCtxType = {
    myPlaylists: Playlist[] | null
    fetchMyPlaylists: () => void
    profile: Profile | null
    fetchProfile: () => void
    indicator: UseDisclosureReturn
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
    playingTrack: Track | null
    setPlayingTrack: Dispatch<SetStateAction<Track | null>>
    previousTracks: Track[]
    setPreviousTracks: Dispatch<SetStateAction<Track[]>>
    nextSong: () => void
    previousSong: () => void
    addToQueue: (track: Track) => void
    removeFromQueue: (track: Track) => void
    getRandomTrack: () => Track
    addTrackToPlaylist: (playlist: Playlist, track: Track) => Promise<void>
}

export type Track = Database['public']['Tables']['tracks']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Playlist = Database['public']['Tables']['playlists']['Row']

export type TrackWithProfile = Track & {
    profiles: Profile  | null
}

export type LoopMode = 'queue' | 'song' | null

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
    title?: string
}

export type AppPropsWithLayout = AppProps<{
    initialSession: Session
}> & {
    Component: NextPageWithLayout
}
