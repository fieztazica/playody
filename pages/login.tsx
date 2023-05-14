import { GetServerSideProps } from 'next'
import { Button, Stack } from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { theme } from '@/lib/theme'
import { spotifyScopes } from '@/lib/config/spotify'
import Head from 'next/head'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import NextLink from 'next/link'

const Login = () => {
    const supabaseClient = useSupabaseClient()
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen'>
                <Stack>
                    <div>
                        <p>
                            Login to enjoy full experience with {' '}
                            <span>
                                <NextLink href={'/'}>
                                    <PlayodyTitle />
                                </NextLink>
                            </span>
                        </p>
                    </div>
                    <Button
                        bgColor={'#18D860'}
                        _hover={{
                            bgColor: '#14b851',
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            supabaseClient.auth.signInWithOAuth({
                                provider: 'spotify',
                                options: {
                                    scopes: spotifyScopes.join(' '),
                                    redirectTo: process.env.NODE_ENV === 'production' ? 'https://playody.owlvernyte.tk' : 'http://localhost:3000',
                                },
                            })
                        }}
                    >
                        Login with Spotify
                    </Button>
                </Stack>
            </div>
        </>
    )
}

export default Login

// export const getServerSideProps: GetServerSideProps<Props> = async (
//     context
// ) => {
//     const providers = await getProviders()
//     return {
//         props: {
//             providers,
//         },
//     }
// }
