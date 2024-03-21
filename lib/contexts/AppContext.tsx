import useMyPlaylists from '@/lib/hooks/useMyPlaylists'
import useProfile from '@/lib/hooks/useProfile'
import { AppCtxType } from '@/typings'
import { useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect } from 'react'
import useIndicator from '../hooks/useIndicator'

export const AppCtx = createContext<AppCtxType | null>(null)

export function AppCtxProvider({ children }: { children: React.ReactNode }) {
    const { playlists, fetchPlaylists } = useMyPlaylists()
    const { profile, fetchProfile } = useProfile()
    const { indicator, startIndicator, stopIndicator } = useIndicator()
    const router = useRouter()

    let sharedStates = {
        myPlaylists: playlists,
        fetchMyPlaylists: fetchPlaylists,
        profile,
        fetchProfile,
        indicator,
    }

    useEffect(() => {
        const handleStart = () => startIndicator()

        const handleStop = () => stopIndicator()

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
        router.events.on('routeChangeError', handleStop)

        document.documentElement.style.setProperty(
            '--vh',
            window.innerHeight * 0.01 + 'px'
        )

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return <AppCtx.Provider value={sharedStates}>{children}</AppCtx.Provider>
}

export function useAppStates() {
    return useContext(AppCtx) as AppCtxType
}
