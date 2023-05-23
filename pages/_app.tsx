import '@/styles/globals.css'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { ChakraProvider, Progress, useDisclosure } from '@chakra-ui/react'
import { AppPropsWithLayout } from '@/typings'
import { theme } from '@/lib/theme'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

export default function App({ Component, pageProps: { initialSession, ...pageProps } }: AppPropsWithLayout) {
    const indicator = useDisclosure()
    const router = useRouter()
    const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())

    const getLayout = Component.getLayout ?? ((page) => page)

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
                    alert('Passwords aren\'t match!')
                    return
                }

                const { data, error } = await supabaseClient.auth
                    .updateUser({ password: newPassword })

                if (data) alert('Password updated successfully!')
                if (error) alert('There was an error updating your password.')
            }
        })
    }, [])

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

        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px')

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
                {Component.title && <title>{`Playody | ${Component.title}`}</title>}
                <meta name='viewport'
                      content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
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
            <ChakraProvider
                theme={theme}
                toastOptions={{
                    defaultOptions:
                        { position: 'top-right', size: 'sm' },
                }}
            >
                <SessionContextProvider
                    supabaseClient={supabaseClient}
                    initialSession={initialSession}
                >
                    <AppCtxProvider>
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
                </SessionContextProvider>
            </ChakraProvider>
        </>
    )
}
