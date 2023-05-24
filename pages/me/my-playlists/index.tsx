// @flow
import * as React from 'react'
import MainLayout from '@/components/MainLayout'
import { GetServerSideProps } from 'next'
import { Playlist, Profile } from '@/typings'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import { Button, ButtonGroup, IconButton, Tooltip } from '@chakra-ui/react'
import Head from 'next/head'
import { RxTrash } from 'react-icons/rx'
import { useAppStates } from '@/lib/contexts/AppContext'

type Props = {
    playlists: Playlist[] | null
};

const Playlists = ({ playlists }: Props) => {
    const { myPlaylists } = useAppStates()
    const [renderPlaylists, setRenderPlaylists] = useState(() => [...(playlists || [])])

    useEffect(() => {
        setRenderPlaylists([...(myPlaylists || [])])
    }, [myPlaylists])


    return (
        <>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {renderPlaylists !== null && renderPlaylists.map((v) => (
                    <div key={`myPlaylist_result_${v.name}`}
                         className={'tw-flex tw-space-x-2 ' +
                             'tw-items-center tw-justify-between ' +
                             'tw-group tw-px-2 tw-py-2 hover:tw-bg-white/10 ' +
                             'active:tw-bg-white/20 tw-rounded-md tw-w-full'}
                    >
                        <div
                            className={'tw-flex tw-items-center ' +
                            'tw-justify-between tw-text-lg tw-font-bold'}>
                            <p>{v.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}


Playlists.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

Playlists.title = 'My Playlists'

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