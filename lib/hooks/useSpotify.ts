// import { ExtendedSession, TokenError } from '@/typings'
import { useEffect } from 'react'
import { spotifyApi, spotifyScopes } from '../config/spotify'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'


const useSpotify = () => {
    const session = useSession()
    const supabaseClient = useSupabaseClient()

    useEffect(() => {
        (async () => {
            if (!session) return

            if (!session.provider_refresh_token) {
                await supabaseClient.auth.signInWithOAuth({
                    provider: 'spotify',
                    options: {
                        scopes: spotifyScopes.join(' '),
                    },
                })
                return
            }

            if (session.provider_token) {
                spotifyApi.setAccessToken(session?.provider_token)
            }
        })()
    }, [session, supabaseClient.auth])

    return spotifyApi
}

export default useSpotify
