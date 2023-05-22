import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Playlist } from '@/typings'
import { Database } from '@/typings/supabase'

export default function usePlaylists() {
    const session = useSession()
    const supabaseClient = useSupabaseClient<Database>()
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        (async () => {
            try {
                if (!session) throw "[usePlaylists] Not Authenticated";

                const { data, error } = await supabaseClient
                    .from('playlists')
                    .select('*')
                    .eq('author', session.user.id)

                if (error) {
                    throw error
                }

                if (data) {
                    setPlaylists(data)
                }
            } catch (e) {
                console.error(e)
            }
        })()
    }, [session, supabaseClient])

    if (!session) return null

    return playlists
}