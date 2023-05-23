// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/components/MainLayout'

type Props = {};

const Playlist = (props: Props) => {
    const router = useRouter()
    const playlistNameQuery = router.query.name as string

    return (
        <div>

        </div>
    )
}

Playlist.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Playlist
