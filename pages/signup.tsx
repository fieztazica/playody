import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Text,
    Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import { RiSpotifyFill } from 'react-icons/ri'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

const SignUp = () => {
    const supabaseClient = useSupabaseClient<Database>()
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [signing, setSigning] = useState(false)
    const [error, setError] = useState('')
    const queryRedirect = router.query['redirect']
    const hostname = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`
    const redirect =
        (queryRedirect && typeof queryRedirect == 'string') ? decodeURIComponent(queryRedirect) : hostname

    async function handleSignup() {
        try {
            setSigning(true)
            if (password !== repeatPassword) {
                throw 'Passwords aren\'t match!'
            }

            if (!fullName) {
                throw "Full Name is required!"
            }

            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (error) {
                throw error
            }

            alert('Signed you up!')
            router.push(redirect)
            setError('')
        } catch (e: any) {
            console.error(e)
            setError(e.toString())
        } finally {
            setSigning(false)
        }
    }

    return (
        <Flex
            h={'full'}
            align={'center'}
            justify={'center'}
        >
            <Stack mx={'auto'} maxW={'lg'} px={6}>
                <div className={'tw-inline-block'}>
                    Sign up to enjoy the full experience with{' '}
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
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id='fullName' isRequired>
                            <FormLabel>Full Name</FormLabel>
                            <Input value={fullName} onChange={(e) => {
                                e.preventDefault()
                                setFullName(e.target.value)
                            }} type='text' />
                        </FormControl>
                        <FormControl id='email' isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input value={email} onChange={(e) => {
                                e.preventDefault()
                                setEmail(e.target.value)
                            }} type='email' />
                        </FormControl>
                        <FormControl id='password' isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input value={password} onChange={(e) => {
                                    e.preventDefault()
                                    setPassword(e.target.value)
                                }} type={showPassword ? 'text' : 'password'} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword((showPassword) => !showPassword)
                                        }>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id='repeat-password' isRequired>
                            <FormLabel>Repeat Password</FormLabel>
                            <InputGroup>
                                <Input value={repeatPassword} onChange={(e) => {
                                    e.preventDefault()
                                    setRepeatPassword(e.target.value)
                                }} type={showPassword ? 'text' : 'password'} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword((showPassword) => !showPassword)
                                        }>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        {error && <p className={'tw-text-red-500'}>
                            {error}
                        </p>}
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText='Submitting'
                                size='lg'
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={() => handleSignup()}
                                isLoading={signing}
                            >
                                Sign up
                            </Button>
                        </Stack>
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
                            onClick={() => {
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
                                Already a user?{' '}
                                <Link as={NextLink} color={'blue.400'} href={`/login`}>
                                    Login
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}


export default SignUp