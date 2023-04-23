import { GetServerSideProps } from 'next'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import Image from 'next/image'
import spotifyLogo from '../assets/spotify-logo.png'

interface Props {
    providers: Awaited<ReturnType<typeof getProviders>>
}

const Login = ({ providers }: Props) => {
    const { name: providerName, id: providerId } =
        providers?.spotify as ClientSafeProvider

    return (
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
            <button
                className="tw-bg-[#18D860] tw-text-white tw-p-5 tw-rounded-full"
                onClick={(e) => {
                    e.preventDefault()
                    signIn(providerId, { callbackUrl: '/' })
                }}
            >
                Login with {providerName}
            </button>
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
