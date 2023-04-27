import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'
import { theme } from '@/lib/theme'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <ChakraProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
                <AppCtxProvider>
                    <AudioCtxProvider>
                        {getLayout(<Component {...pageProps} />)}
                    </AudioCtxProvider>
                </AppCtxProvider>
            </SessionProvider>
        </ChakraProvider>
    )
}
