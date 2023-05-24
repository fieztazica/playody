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

type Props = {
    playlists: Playlist[] | null
};

const Playlists = ({ playlists }: Props) => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [refreshing, setRefreshing] = useState(false)
    const [myPlayLists, setMyPlayLists] = useState<Playlist[]>([])

    const [verifiedTrack, setVerifiedTrack] = useState(true)

    async function refresh() {
        try {
            setRefreshing(true)
            if (!user) {
                throw 'Not authenticated'
            }

            const { data, error } = await supabaseClient
                .from('playlists')
                .select('*')
                .eq('author', user.id)
                .order('created_at', { ascending: false })

            if (error || !data) {
                throw error
            }

            if (data)
                setMyPlayLists([...data as any])
        } catch (e: any) {
            if (e?.message)
                alert(e.message)
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

  
  

    useEffect(() => {
        if (playlists === null)
            refresh()
        else
            setMyPlayLists([...playlists])
    }, [])


    return (
        <>

        <Head>
            <title>My Tracks</title>
        </Head>
        <div>
            <div
                className='tw-mb-4 after:tw-block after:tw-mt-1 after:tw-rounded-full after:tw-h-1 after:tw-w-full after:tw-bg-white/30'>
                <div className='tw-flex tw-justify-between      tw-items-center'>
               
                    <Button isLoading={refreshing} onClick={() => refresh()}>
                        Refresh
                    </Button>
                </div>
            </div>
                <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                    {myPlayLists !== null && myPlayLists.map((v) => (
                        <div key={`myTrack_result_${v.name}`} className='tw-flex tw-space-x-2 tw-items-center tw-justify-between tw-group tw-px-2 tw-py-2 
                        hover:tw-bg-white/10 active:tw-bg-white/20 tw-rounded-md tw-w-full'>
                              <div className={'tw-flex tw-items-center tw-justify-between tw-text-lg tw-font-bold'}>
                                <div>
                                    <p> {v.name}</p>                                
                                </div>
                              
                            </div>                        
                          
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
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