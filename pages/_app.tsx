import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { AppCtxProvider } from '@/lib/contexts/AppContext'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <AppCtxProvider>
                <Component {...pageProps} />
            </AppCtxProvider>
        </SessionProvider>
    )
}
