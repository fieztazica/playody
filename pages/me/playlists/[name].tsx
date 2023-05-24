// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import MainLayout from '@/components/MainLayout'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { Playlist } from '@/typings'
import Head from 'next/head'

type Props = {
    playlist: Playlist | null
};

const MyPlaylistName = ({ playlist }: Props) => {
    const router = useRouter()
    const playlistNameQuery = router.query.name as string

    if (!playlist) return null

    return (
        <>
            <Head>
                <title>
                    {`Playody | ${playlist.name}`}
                </title>
            </Head>
            <div>

            </div>
        </>
    )
}

MyPlaylistName.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default MyPlaylistName


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const playlist = await supabaseClient
        .from('playlists')
        .select('*')
        .eq('name', ctx.query.name)
        .eq('author', user.data.user.id)
        .limit(1)
        .single()

    if (playlist.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            playlist: playlist.data || null,
        },
    }
}