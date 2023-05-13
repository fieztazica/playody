// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { spotifyApi } from '@/lib/config/spotify'
import { getProviderToken } from '@/lib/api/supabaseAuth'
import { ApiResError, ApiResSuccess } from '@/typings/apiRes'

async function SpotifySearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    const provider_token = await getProviderToken(req, res)

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