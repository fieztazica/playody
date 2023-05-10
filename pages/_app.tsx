import '@/styles/globals.css'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider, Progress, useDisclosure } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'
import { theme } from '@/lib/theme'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps: { initialSession, ...pageProps } }: AppPropsWithLayout) {
    const indicator = useDisclosure()
    const router = useRouter()

    const getLayout = Component.getLayout ?? ((page) => page)

    useEffect(() => {
        const handleStart = () => {
            indicator.onOpen()
        }

        const handleStop = () => {
            indicator.onClose()
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
        router.events.on('routeChangeError', handleStop)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return (
        <ChakraProvider theme={theme}>
            <AppCtxProvider initialSession={initialSession}>
                <AudioCtxProvider>
                    <Progress
                        display={indicator.isOpen ? 'flex' : 'none'}
                        bgColor={'transparent'}
                        height='2px'
                        flex={1}
                        position='fixed'
                        zIndex={'99'}
                        isIndeterminate
                        w='100%'
                    />
                    {getLayout(<Component {...pageProps} />)}
                </AudioCtxProvider>
            </AppCtxProvider>
        </ChakraProvider>
    )
}
