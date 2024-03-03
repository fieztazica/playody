// app/providers.tsx
'use client'

import { AppCtxProvider } from '@/lib/contexts/AppContext'
import { AudioCtxProvider } from '@/lib/contexts/AudioContext'
import { theme } from '@/lib/theme'
import { Database } from '@/typings/supabase'
import { ChakraProvider, Progress, useDisclosure } from '@chakra-ui/react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const indicator = useDisclosure()
    const router = useRouter()
    const [supabaseClient] = useState(() =>
        createBrowserSupabaseClient<Database>()
    )

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

    return (
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
                initialSession={null}
            >
                <AppCtxProvider>
                    <AudioCtxProvider>
                        <Progress
                            display={indicator.isOpen ? 'flex' : 'none'}
                            bgColor={'transparent'}
                            height="2px"
                            flex={1}
                            position="fixed"
                            zIndex={'99'}
                            isIndeterminate
                            w="100%"
                        />
                        {children}
                    </AudioCtxProvider>
                </AppCtxProvider>
            </SessionContextProvider>
        </ChakraProvider>
    )
}
