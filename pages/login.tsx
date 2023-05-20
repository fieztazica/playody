import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, useColorModeValue } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { theme } from '@/lib/theme';
import Head from 'next/head';
import { PlayodyTitle } from '@/components/PlayodyTitle';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';

const Login = () => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    const queryRedirect = router.query['redirect']
    const hostname = `https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}`
    const redirect =
        (queryRedirect && typeof queryRedirect == 'string') ? decodeURIComponent(queryRedirect) : hostname

    return (
        <>
          <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
          
          >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
              <Stack align={'center'}>
              <div>
            Login to enjoy the full experience with{' '}
            <span>
              <NextLink href={'/'}>
                <PlayodyTitle />
              </NextLink>
            </span>
          </div>
              </Stack>
              <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}
              >
                <Stack spacing={4}>
                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                    >
                      Sign in
                    </Button>
                    <Stack pt={6}>
              <Text align={'center'}>
                Dont have an account? 
                 <Link color={'blue.400'} onClick={handleSignUpClick}>
                      Sign up
                    </Link>
              </Text>
              
            </Stack>
            <Button
            bgColor={'#18D860'}
            _hover={{
              bgColor: '#14b851',
            }}
            onClick={(e) => {
              e.preventDefault();
              supabaseClient.auth.signInWithOAuth({
                provider: 'spotify',
                options: {
                  redirectTo: redirect,
                },
              });
            }}>
            Login with Spotify
          </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </>
      );
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
