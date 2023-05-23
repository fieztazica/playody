// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TrackApi from '@/lib/api/track'

async function resolvePlaylist(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    const tracksApi = new TrackApi(req, res)
    const tracksRes = await tracksApi.getTracks(decodeURIComponent(req.query.name as string))
    res.json({
        message: ``,
        data: tracksRes.data,
        error: tracksRes.error
    })
}

export default resolvePlaylist
