// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { spotifyApi } from '@/lib/config/spotify'
import * as ytsr from 'ytsr'
import { getProviderToken } from '@/lib/api/supabaseAuth'
import { ApiResConvertSuccess, ApiResError, ApiResSuccess } from '@/typings/apiRes'

async function SpotifySearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResConvertSuccess>,
) {
    const provider_token = await getProviderToken(req, res)

    spotifyApi.setAccessToken(provider_token)

    const { trackId } = req.query

    if (!trackId)
        return res.status(400).json({
            message: 'trackId is not provided',
        })

    const spotifyApiRes = await spotifyApi.getTrack(trackId as string)

    if (!spotifyApiRes)
        return res.status(500).json({
            message: 'failed to fetch spotify api',
        })

    const ytsrQuery = `${spotifyApiRes.body.name} ${spotifyApiRes.body.artists.map<string>(v => v.name).join(' ')}`

    const ytRes = await ytsr.default(ytsrQuery, { limit: 10 })

    if (!ytRes.results)
        return res.status(404).json({
            message: 'nothing returned',
        })

    res.status(200).json({
        data: {
            spotify: spotifyApiRes.body,
            youtube: ytRes,
            videos: ytRes.items.filter(v => v.type == 'video') as ytsr.Video[],
        },
    })
}

export default SpotifySearchApi