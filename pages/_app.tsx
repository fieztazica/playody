import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <ChakraProvider>
            <SessionProvider session={pageProps.session}>
                <AppCtxProvider>
                    {getLayout(<Component {...pageProps} />)}
                </AppCtxProvider>
            </SessionProvider>
        </ChakraProvider>
    )
}
