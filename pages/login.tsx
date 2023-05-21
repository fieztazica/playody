import {
    Box,
    Button,
    Checkbox, Divider,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Link,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Text } from '@chakra-ui/react'
import { RiSpotifyFill } from 'react-icons/ri'
import { useState } from 'react'
import { Database } from '@/typings/supabase'

const Login = () => {
    const supabaseClient = useSupabaseClient<Database>()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const queryRedirect = router.query['redirect']
    const hostname = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`
    const redirect =
        (queryRedirect && typeof queryRedirect == 'string') ? decodeURIComponent(queryRedirect) : hostname

    async function handleLogin() {
        try {
            setLoggingIn(true)
            setError(null)
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                throw error
            }
        } catch (e: any) {
            console.error(e)
            setError(e.toString())
        } finally {
            setLoggingIn(false)
        }
    }


    return (
        <>
            <Flex
                h={'full'}
                align={'center'}
                justify={'center'}
            >
                <Stack spacing={2} mx={'auto'} maxW={'lg'} px={6}>
                    <div className={'tw-inline-block'}>
                        Login to enjoy the full experience with{' '}
                        <span>
                          <NextLink href={'/'}>
                            <PlayodyTitle />
                          </NextLink>
                        </span>
                    </div>
                    <Box
                        rounded={'lg'}
                        bg={'blackAlpha.300'}
                        boxShadow={'lg'}
                        p={8}
                    >
                        <Stack spacing={2}>
                            <FormControl id='email'>
                                <FormLabel>Email address</FormLabel>
                                <Input type='email' value={email}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setEmail(e.target.value)
                                }}/>

                            </FormControl>
                            <FormControl id='password'>
                                <FormLabel>Password</FormLabel>
                                <Input type='password' value={password} onChange={(e) => {
                                    e.preventDefault()
                                    setPassword(e.target.value)
                                }}/>
                            </FormControl>
                            {error && <p className={"tw-text-red-500"}>
                                {error}
                            </p>}
                            <Stack spacing={4}>
                                <Link as={NextLink} href={"/recovery"} color={'blue.400'}>Forgot password?</Link>
                                <Button
                                    isLoading={loggingIn}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                    onClick={() => handleLogin()}
                                >
                                    Sign in
                                </Button>
                                <div
                                    className={'tw-flex tw-flex-row tw-w-full tw-space-x-2 tw-items-center tw-justify-between'}>
                                    <div className={'tw-flex-1 tw-bg-white/20 tw-h-[2px] tw-w-full tw-rounded-full'}>

                                    </div>
                                    <div className={'tw-px-2 tw-rounded-full tw-bg-white/20 tw-text-white/80'}>
                                        or
                                    </div>
                                    <div className={'tw-flex-1 tw-bg-white/20 tw-h-[2px] tw-w-full tw-rounded-full'}>

                                    </div>
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
                                    leftIcon={<RiSpotifyFill />}
                                >
                                    Login with Spotify
                                </Button>
                                <Stack pt={6}>
                                    <Text align={'center'}>
                                        Dont have an account?{' '}
                                        <Link as={NextLink} href={'/signup'} color={'blue.400'}>
                                            Sign up
                                        </Link>
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
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
