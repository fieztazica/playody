import { GetServerSideProps } from 'next'
import { Button, Stack } from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { theme } from '@/lib/theme'
import { spotifyScopes } from '@/lib/config/spotify'

const Login = () => {
    const supabaseClient = useSupabaseClient()
    return (
        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen'>
            <Stack>
                <Button
                    bgColor={'#18D860'}
                    _hover={{
                        bgColor: '#14b851',
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        supabaseClient.auth.signInWithOAuth({
                            provider:"spotify",
                            options: {
                                scopes: spotifyScopes.join(" ")
                            }
                        })
                    }}
                >
                    Login with Spotify
                </Button>
            </Stack>
        </div>
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
