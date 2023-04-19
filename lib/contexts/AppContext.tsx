import { AppCtxType, TokenError, ExtendedSession } from '@/types';
import { signIn, useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children }: { children: JSX.Element }) {
    const { data: session } = useSession()

    const [theme, setTheme] = useState<'light' | 'dark'>('dark')
    useEffect(() => {


    }, [])

    let sharedStates = {
        theme,
    }

    return <AppCtx.Provider value={sharedStates}>{children}</AppCtx.Provider>
}

export function useAppStates() {
    return useContext(AppCtx)
}
