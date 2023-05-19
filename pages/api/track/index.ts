// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TrackApi from '@/lib/api/track'

async function ApiTrack(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    const trackApi = new TrackApi(req, res)
    switch (req.method) {
        case 'POST':
            const postData = await trackApi.post(req.body)
            return res.status(postData.status).json({
                message: `[SUPABASE] ${postData.statusText}`,
                error: postData.error,
                data: postData.data
            })
        case 'GET':
            const getData = await trackApi.get(req.query["trackId"] as string)
            return res.status(getData.status).json({
                message: `[SUPABASE] ${getData.statusText}`,
                error: getData.error,
                data: getData.data
            })
        default:
            return res.status(405).json({
                message: `Method ${req.method} is not allowed`,
            })
    }

}

export default ApiTrack
