import { AppCtxType } from '@/typings'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Database } from '@/typings/supabase'
import { createClient, Session } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children, initialSession }: { children: React.ReactNode, initialSession: Session }) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())
    const [navBarChildren, setNavBarChildren] = useState<React.ReactNode>(null)
    // const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event == 'PASSWORD_RECOVERY') {
                const newPassword = prompt('What would you like your new password to be?')
                if (!newPassword) {
                    alert('You didn\'t provide anything!')
                    return
                }

                const repeatPassword = prompt('Repeat your password.')
                if (!repeatPassword) {
                    alert('You didn\'t provide anything!')
                    return
                }

                if (newPassword !== repeatPassword) {
                    alert("Passwords aren't match!")
                    return
                }

                const { data, error } = await supabaseClient.auth
                    .updateUser({ password: newPassword })

                if (data) alert('Password updated successfully!')
                if (error) alert('There was an error updating your password.')
            }
        })
    }, [])

    let sharedStates = {
        // theme,
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
