// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'genius-lyrics'
import { Lyrics } from '@/typings'

const GeniusClient = new Client(process.env.GENIUS_ACCESS_TOKEN)

async function ApiLyrics(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>
) {
    try {
        const q = req.query['q']
        if (!q || !q.length) {
            res.status(400).json({
                message: "Query 'q' not provided",
                data: null,
                error: null,
            })
            return
        }
        const query = decodeURIComponent(q as string)
        const searches = await GeniusClient.songs.search(query)

        if (!searches || !searches.length) {
            res.status(404).json({
                message: 'Not found',
                data: {},
                error: null,
            })
            return
        }
        const song = searches[0]
        const geniusLyrics = await song.lyrics()
        const lyrics: Lyrics = geniusLyrics.split('\n').map((v) => ({
            time: 0,
            text: v,
        }))

        res.status(200).json({
            message: '',
            data: { lyrics, song: song._raw },
            error: null,
        })
        return
    } catch (error) {
        const resError = error as Error
        res.status((resError as any)?.error?.statusCode || 500).json({
            message: resError.message,
            data: {},
            error: {
                ...resError,
            },
        })
        return
    }
}

export default ApiLyrics
