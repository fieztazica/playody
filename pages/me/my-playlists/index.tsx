// @flow
import * as React from 'react'
import MainLayout from '@/components/MainLayout'
import { GetServerSideProps } from 'next'
import { Playlist, Profile } from '@/typings'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

type Props = {
    playlists: Playlist[] | null
};

const Playlists = ({ playlists }: Props) => {
    if (playlists === null) return null
    return (
        <div>

        </div>
    )
}

Playlists.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Playlists

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const playlists = await supabaseClient
        .from('playlists')
        .select()
        .eq('author', user.data.user.id)


    if (playlists.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            playlists: playlists.data || null,
        },
    }
}