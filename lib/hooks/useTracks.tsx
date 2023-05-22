import { useEffect, useState } from 'react'
import { Track } from '@/typings'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

type Props = {
    verified?: boolean
    author?: string
    all?: boolean
}

export default function useTracks({ verified = true, author, all = false }: Props) {
    const session = useSession()
    const supabaseClient = useSupabaseClient<Database>()
    const [tracks, setTracks] = useState<Track[]>([])

    useEffect(() => {
        (async () => {
            try {
                if (!session) throw '[usePlaylists] Not Authenticated'

                const query = supabaseClient
                    .from('tracks')
                    .select('*')

                if (!all) {
                    query
                        .eq('author', author || session.user.id)
                        .eq('is_verified', verified)
                } else {
                    if (verified === false
                        && session?.user.app_metadata.role !== 'admin'
                    )
                        throw '[usePlaylists] Not Admin'
                }

                query.order('created_at', { ascending: false })

                const { data, error } = await query

                if (error) {
                    throw error
                }

                if (data) {
                    setTracks(data)
                }
            } catch (e) {
                console.error(e)
            }
        })()
    }, [session, supabaseClient])

    if (verified === false
        && session?.user.app_metadata.role !== 'admin'
    )
        return null

    if (!session) return null

    return tracks
}