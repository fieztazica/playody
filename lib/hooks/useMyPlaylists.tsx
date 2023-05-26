import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Playlist } from '@/typings'
import { Database } from '@/typings/supabase'
import { useRouter } from 'next/router'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

export default function useMyPlaylists() {
    const session = useSession()
    const router = useRouter()
    const supabaseClient = useSupabaseClient<Database>()
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    function fetchPlaylists() {
        try {
            (async () => {
                if (!session) throw '[useMyPlaylists] Not Authenticated'

                const { data, error } = await supabaseClient
                    .from('playlists')
                    .select('*')
                    .order('name', { ascending: true })
                    .eq('author', session.user.id)

                if (error) {
                    throw error
                }

                if (data) {
                    setPlaylists(data)
                }
            })()
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchPlaylists()
    }, [session, supabaseClient, router])

    if (!session) return {
        playlists: null,
        fetchPlaylists: () => {
        },
    }

    return { playlists, fetchPlaylists }
}