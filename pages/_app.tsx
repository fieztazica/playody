import RootLayout from '@/components/RootLayout'
import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'
import { theme } from '@/lib/theme'
import '@/styles/globals.css'
import { AppPropsWithLayout } from '@/typings'
import { Database } from '@/typings/supabase'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function App({
    Component,
    pageProps: { initialSession, ...pageProps },
}: AppPropsWithLayout) {
    const [supabaseClient] = useState(() =>
        createBrowserSupabaseClient<Database>()
    )

    const getLayout = Component.getLayout ?? ((page) => page)

    useEffect(() => {
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event == 'PASSWORD_RECOVERY') {
                const newPassword = prompt(
                    'What would you like your new password to be?'
                )
                if (!newPassword) {
                    alert("You didn't provide anything!")
                    return
                }

                const repeatPassword = prompt('Repeat your password.')
                if (!repeatPassword) {
                    alert("You didn't provide anything!")
                    return
                }

                if (newPassword !== repeatPassword) {
                    alert("Passwords aren't match!")
                    return
                }

                const { data, error } = await supabaseClient.auth.updateUser({
                    password: newPassword,
                })

                if (data) alert('Password updated successfully!')
                if (error) alert('There was an error updating your password.')
            }
        })
    }, [])

    return (
        <>
            <Head>
                {Component.title && (
                    <title>{`Playody | ${Component.title}`}</title>
                )}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                />
                <meta name="title" content="Playody - Play your melody" />
                <meta
                    name="description"
                    content="Playody is a free music sharing web-app"
                />
                <meta
                    name="keywords"
                    content="music, sharing music, play, melody, playody"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta name="language" content="English" />

                <meta
                    property="og:title"
                    content="Playody - Play your melody"
                />
                <meta property="og:site_name" content="Playody" />
                <meta property="og:url" content="https://playody.vercel.app" />
                <meta
                    property="og:description"
                    content="Playody is a free music sharing web-app"
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content="https://media.discordapp.net/attachments/905152915273056286/1109433251547861042/Playody.png"
                />
            </Head>
            <ChakraProvider
                theme={theme}
                toastOptions={{
                    defaultOptions: {
                        position: 'top-right',
                        size: 'sm',
                        isClosable: true,
                        duration: 3000,
                    },
                }}
            >
                <SessionContextProvider
                    supabaseClient={supabaseClient}
                    initialSession={initialSession}
                >
                    <AppCtxProvider>
                        <AudioCtxProvider title={Component.title}>
                            <RootLayout>
                                {getLayout(<Component {...pageProps} />)}
                            </RootLayout>
                        </AudioCtxProvider>
                    </AppCtxProvider>
                </SessionContextProvider>
            </ChakraProvider>
        </>
    )
}
