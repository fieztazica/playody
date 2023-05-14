import { AppCtxType } from '@/typings'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Database } from '@/typings/supabase'
import { createClient, Session } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children, initialSession }: { children: React.ReactNode, initialSession: Session }) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())

    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    let sharedStates = {
        theme,
    }

    return (
        <AppCtx.Provider value={sharedStates}>
            <SessionContextProvider
                supabaseClient={supabaseClient}
                initialSession={initialSession}
            >
                {children}
            </SessionContextProvider>
        </AppCtx.Provider>
    )
}

export function useAppStates() {
    return useContext(AppCtx) as AppCtxType
}
