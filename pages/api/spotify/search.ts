// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { spotifyApi } from '@/lib/config/spotify'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { createClient } from '@supabase/supabase-js'

async function SpotifySearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res })

    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        return res.status(403).json({
            message: 'session is not defined',
        })

    // Retrieve provider_token & logged in user's third-party id from metadata
    const { provider_token, user } = session

    if (!provider_token)
        return res.status(403).json({
            message: 'provider_token not provided',
        })

    const { q } = req.query

    const query = decodeURIComponent(q as string)

    spotifyApi.setAccessToken(provider_token)

    const spotifyApiRes = await spotifyApi.search(query, ['track'])

    if (!spotifyApiRes)
        return res.status(500).json({
            message: 'failed to fetch spotify api',
        })

    console.log(spotifyApiRes.body.tracks?.items)

    res.status(spotifyApiRes.statusCode).json({
        data: spotifyApiRes.body,
    })
}

export default SpotifySearchApi