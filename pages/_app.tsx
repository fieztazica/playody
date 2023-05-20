import '@/styles/globals.css'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider, Progress, useDisclosure } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'
import { theme } from '@/lib/theme'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

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

        document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + 'px');

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleStop)
            router.events.off('routeChangeError', handleStop)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return (
        <>
            <Head>
                <title>Playody</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                <meta name='title' content='Playody - Play your melody' />
                <meta name='description' content='Playody is a free music sharing web-app' />
                <meta name='keywords' content='music, sharing music, play, melody, playody' />
                <meta name='robots' content='index, follow' />
                <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
                <meta name='language' content='English' />

                <meta property='og:title' content='Playody - Play your melody' />
                <meta property='og:site_name' content='Playody' />
                <meta property='og:url' content='https://playody.vercel.app' />
                <meta property='og:description' content='Playody is a free music sharing web-app' />
                <meta property='og:type' content='website' />
                <meta
                    property='og:image'
                    content='https://media.discordapp.net/attachments/905152915273056286/1109433251547861042/Playody.png'
                />
            </Head>
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
        </>
    )
}
