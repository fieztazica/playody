import { GetServerSideProps } from 'next'
import { Button, Stack } from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { theme } from '@/lib/theme'
import Head from 'next/head'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

const Login = () => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    const queryRedirect = router.query['redirect']
    const hostname = `https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}`
    const redirect =
        (queryRedirect && typeof queryRedirect == 'string') ? decodeURIComponent(queryRedirect) : hostname

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen'>
                <Stack>
                    <div>
                        Login to enjoy full experience with {' '}
                        <span>
                                <NextLink href={'/'}>
                                    <PlayodyTitle />
                                </NextLink>
                            </span>
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
                                    redirectTo: redirect,
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
