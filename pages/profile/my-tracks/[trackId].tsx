// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/components/MainLayout'
import Playlist from '@/pages/profile/my-playlists/[name]'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { Track } from '@/typings'

type Props = {
    track: Track | null
};

const TrackId = ({ track }: Props) => {
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

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const track = await supabaseClient
        .from('tracks')
        .select('*')
        .eq('id', ctx.query.trackId)
        .eq('author', user.data.user.id)
        .limit(1)
        .single()

    if (track.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            track: track.data || null,
        },
    }
}