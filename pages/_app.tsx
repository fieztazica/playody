import '@/styles/globals.css'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'
import { theme } from '@/lib/theme'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'

export default function App({ Component, pageProps: { initialSession, ...pageProps } }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <ChakraProvider theme={theme}>
            <AppCtxProvider initialSession={initialSession}>
                <AudioCtxProvider>
                    {getLayout(<Component {...pageProps} />)}
                </AudioCtxProvider>
            </AppCtxProvider>
        </ChakraProvider>
    )
}
