import { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
    metadataBase: new URL('https://playody.vercel.app'),
    title: {
        default: 'Playody - Play your melody',
        template: '%s | Playody',
    },
    description: 'Playody is a free music sharing web-app.',
    openGraph: {
        title: 'Playody - Play your melody',
        description: 'Playody is a free music sharing web-app.',
        url: 'https://playody.vercel.app',
        siteName: 'Playody',
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    twitter: {
        title: 'Lee Robinson',
        card: 'summary_large_image',
    },
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
