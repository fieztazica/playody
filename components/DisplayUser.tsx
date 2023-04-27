import { Avatar, Button, Flex, Link, Stack, Text } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'

function DisplayUser() {
    const { data: session, status } = useSession()

    return (
        <>
            {status === 'authenticated' ? (
                <Flex>
                    <Avatar mr={5} />
                    <Stack spacing={1} justifyItems={'center'} align={'left'}>
                        <Link w="fit-content">
                            <Text fontSize={'16'} fontWeight={'semibold'}>
                                {session.user.name}
                            </Text>
                        </Link>
                        <Link
                            w="fit-content"
                            onClick={() => {
                                signOut()
                            }}
                        >
                            <Text fontSize={'16'}>Logout</Text>
                        </Link>
                    </Stack>
                </Flex>
            ) : (
                <Flex>
                    <Button
                        as={NextLink}
                        href="/login"
                        width={'full'}
                        size={'lg'}
                        bgGradient="linear(to-r, blue.400, purple.400, pink.400)"
                    >
                        Sign In
                    </Button>
                </Flex>
            )}
        </>
    )
}

export default DisplayUser
