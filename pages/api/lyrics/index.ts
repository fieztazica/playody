// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'genius-lyrics'
import { Lyrics } from '@/typings'

const GeniusClient = new Client(process.env.GENIUS_ACCESS_TOKEN)
const TextylURL = new URL('https://api.textyl.co/api/lyrics')

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

        let lyrics: Lyrics = []
        let provider = 'textyl.co'
        lyrics = await textylGet(query)
        if (!lyrics || !lyrics.length) {
            lyrics = await geniusGet(query)
            provider = 'genius.com'
        }

        res.status(200).json({
            message: '',
            data: { lyrics, provider },
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

async function geniusGet(query: string) {
    const searches = await GeniusClient.songs.search(query)
    if (!searches || !searches.length) {
        throw new Error('Not found')
    }
    const song = searches[0]
    const geniusLyrics = await song.lyrics()
    const lyrics: Lyrics = geniusLyrics.split('\n').map((v) => ({
        time: 0,
        text: v,
    }))
    return lyrics
}

async function textylGet(query: string) {
    const data = (await fetch(
        `${TextylURL.toString()}?q=${encodeURIComponent(query)}`
    ).then((r) => r.json())) as TextylLyricComponent[]
    const lyrics = data.map((v) => ({
        time: v.seconds,
        text: v.lyrics,
    }))
    return lyrics
}

type TextylLyricComponent = {
    seconds: number
    lyrics: string
}
