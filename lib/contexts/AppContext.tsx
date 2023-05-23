import { AppCtxType } from '@/typings'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Database } from '@/typings/supabase'
import { createClient, Session } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import useMyPlaylists from '@/lib/hooks/useMyPlaylists'

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children }: { children: React.ReactNode }) {
    const { playlists, fetchPlaylists } = useMyPlaylists()

    let sharedStates = {
        myPlaylists: playlists,
        fetchMyPlaylists: fetchPlaylists
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
