// @flow
import * as React from 'react'
import MainLayout from '@/components/MainLayout'
import Playlist from '@/pages/profile/my-playlists/[name]'

type Props = {};

const Playlists = (props: Props) => {
    return (
        <div>

        </div>
    )
}

Playlists.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Playlists