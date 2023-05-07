// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    getBasicInfo, getInfo,
    getURLVideoID,
    getVideoID,
    validateID,
    validateURL,
} from 'ytdl-core'

const ytdl = require('ytdl-core')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const { videoId } = req.query

        const uri = `http://youtube.com/watch?v=${validateYoutube(
            decodeURIComponent(videoId as string),
        )}`
        const info = await getInfo(uri)

        if (!info) {
            res.status(404).send('not found')
            return
        }

        const startTime = req.query.startTime
        const endTime = req.query.endTime

        const audioFormat = endTime || ytdl.chooseFormat(info.formats, { filter: 'audioonly' })

        // const audioDuration = (audioFormat.approxDurationMs / 1000).toFixed(0)

        const byteRange = `bytes=${startTime}-${audioFormat.contentLength - 1}`
        const headers = {
            'Content-Type': 'audio/webm',
            'Cache-Control': 'public, max-age=31536000',
            'Accept-Ranges': 'bytes',
            'Content-Range': byteRange,
            'Transfer-Encoding': 'chunked',
        }
        res.writeHead(206, headers)

        const audioStream = ytdl(uri, {
            filter: 'audioonly',
            range: headers,
        })

        audioStream.pipe(res)

        audioStream.on('end', () => res.end())

        // Handle errors
        audioStream.on('error', (err: any) => console.error(`Error while streaming audio: ${err}`))
        res.on('error', (err) => console.error(`Error while streaming response: ${err}`))
    } catch (err) {
        console.error(err)
        if (!res.headersSent) {
            res.writeHead(500)
            res.end('internal system error')
        }
    }
}

function validateYoutube(string: string) {
    if (validateID(string)) return getVideoID(string)
    if (!new URL(string) || !validateURL(string)) throw new Error('Not a URL')
    return getURLVideoID(string)
}
