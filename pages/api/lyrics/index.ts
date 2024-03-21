// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'genius-lyrics'

const GeniusClient = new Client(process.env.GENIUS_ACCESS_TOKEN);

async function ApiLyrics(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    try {
        const query = decodeURIComponent(req.query['q'] as string)

        if (!query) {
            return res.status(400).json({
                message: "Query 'q' not provided",
                data: {},
                error: null,
            })
        }
        const searches = await GeniusClient.songs.search(query);

        if (!searches.length) {
            return res.status(404).json({
                message: "Not found",
                data: {},
                error: null,
            })
        }

        // Pick first one
        const firstSong = searches[0];

        // Ok lets get the lyrics
        const lyrics = await firstSong.lyrics();
        console.log("Lyrics of the Song:\n", lyrics, "\n");
        return res.status(200).json({
            message: "",
            data: { lyrics },
            error: null,
        })
    } catch (error) {
        const resError = (error as Error)
        return res.status((resError as any)?.error?.statusCode || 500).json({
            message: resError.message,
            data: {},
            error: {
                ...resError
            },
        })
    }
}

export default ApiLyrics
