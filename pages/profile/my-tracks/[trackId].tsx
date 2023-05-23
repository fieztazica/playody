// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/components/MainLayout'
import Playlist from '@/pages/profile/my-playlists/[name]'

type Props = {};

const TrackId = (props: Props) => {
    const router = useRouter()
    const trackIdQuery = router.query.trackId as string

    return (
        <div>

        </div>
    )
}

TrackId.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default TrackId

