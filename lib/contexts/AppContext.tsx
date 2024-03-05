import useMyPlaylists from '@/lib/hooks/useMyPlaylists'
import useProfile from '@/lib/hooks/useProfile'
import { AppCtxType } from '@/typings'
import React, { createContext, useContext } from 'react'

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children }: { children: React.ReactNode }) {
    const { playlists, fetchPlaylists } = useMyPlaylists()
    const { profile, fetchProfile } = useProfile()

    let sharedStates = {
        myPlaylists: playlists,
        fetchMyPlaylists: fetchPlaylists,
        profile,
        fetchProfile,
    }

    return (
        <AppCtx.Provider value={sharedStates}>
            {children}
        </AppCtx.Provider>
    )
}

export function useAppStates() {
    return useContext(AppCtx) as AppCtxType
}
