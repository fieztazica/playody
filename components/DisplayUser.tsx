import { Avatar, Button, Flex, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { useRouter } from 'next/router'
import useProfile from '@/lib/hooks/useProfile'

function DisplayUser() {
    const profile = useProfile()
    const supabaseClient = useSupabaseClient<Database>()
    const router = useRouter()
    const hostname = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`
    const redirect = router.route !== '/' ? `?redirect=${encodeURIComponent(`${hostname}${router.route}`)}` : ''

    return (
        <Flex>
            {profile ? (
                <>
                    <NextLink href={'/profile'}>
                        <Avatar mr={2} src={profile.avatar_url || undefined} />
                    </NextLink>
                    <Stack spacing={1} justifyItems={'center'} align={'left'}>
                        <Link as={NextLink} href={"/profile"} w='fit-content'>
                            <Text fontSize={'16'} fontWeight={'semibold'}>
                                {profile.full_name}
                            </Text>
                        </Link>
                        <Link
                            w='fit-content'
                            onClick={() => {
                                supabaseClient.auth.signOut()
                                localStorage.setItem("ready_pass", "false")
                            }}
                        >
                            <Text fontSize={'16'}>Logout</Text>
                        </Link>
                    </Stack>
                </>
            ) : (
                <Button
                    as={NextLink}
                    href={`/login${redirect}`}
                    width={'full'}
                    size={'lg'}
                    bgGradient='linear(to-r, blue.400, purple.400, pink.400)'
                >
                    Sign In
                </Button>
            )}
        </Flex>
    )
}

export default DisplayUser
