import { GetServerSideProps } from 'next'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import { Button, Stack } from '@chakra-ui/react'

interface Props {
    providers: Awaited<ReturnType<typeof getProviders>>
}

const Login = ({ providers }: Props) => {
    const { name: providerName, id: providerId } =
        providers?.spotify as ClientSafeProvider

    return (
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
            <Stack>
                <Button
                    bgColor={'#18D860'}
                    _hover={{
                        bgColor: '#14b851',
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        signIn(providerId, { callbackUrl: '/' })
                    }}
                >
                    Login with {providerName}
                </Button>
            </Stack>
        </div>
    )
}

export default Login

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const providers = await getProviders()
    return {
        props: {
            providers,
        },
    }
}
