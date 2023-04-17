import { Inter } from 'next/font/google'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getToken } from 'next-auth/jwt'
import { GetServerSidePropsContext } from 'next'
import Script from 'next/script'
import { useEffect } from 'react'

const secret = process.env.NEXTAUTH_SECRET

export default function Home() {
    const { data: session, status } = useSession()
    console.log(session, status)

    useEffect(() => {

    }, [])

    return (
        <>
            <Script
                id="spotify-player"
                src="https://sdk.scdn.co/spotify-player.js"
            ></Script>
            <main className="flex min-h-screen flex-col items-center p-24">
                {status} as {session?.user?.name}
                <p>{session?.user?.email}</p>
                <Link href="/api/auth/signin">Sign In</Link>
                <Link href="/api/auth/signout">Sign Out</Link>
            </main>
        </>
    )
}

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const token = await getToken({ req, secret })
    console.log('JSON Web Token', token)
    return {
        props: {}, // will be passed to the page component as props
    }
}
