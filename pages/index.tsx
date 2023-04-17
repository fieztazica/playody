import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { data: session, status } = useSession()

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            {status} as {session?.user?.name}
            <p>{session?.user?.email}</p>
            <a href="/api/auth/signin">Sign In</a>
            <a href="/api/auth/signout">Sign Out</a>
        </main>
    )
}
