import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from 'ytdl-core'

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const { videoId } = req.query

        // Load audio stream from YouTube using ytdl-core
        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
            filter: 'audioonly',
        })

        // Create array buffer to accumulate audio bytes
        const chunks: Buffer[] = []
        let totalBytes = 0

        // Read audio data chunk by chunk and accumulate bytes
        for await (const chunk of stream) {
            chunks.push(chunk)
            totalBytes += chunk.length
        }

        // Combine chunks into a single buffer
        const buffer = Buffer.concat(chunks)

        res.on('close', () => {
            stream.destroy()
        })

        res.on('error', (err) => {
            console.error(`> Response error`)
            console.error(err)
            stream.destroy()
        })

        stream.destroy()

        // Send audio buffer to client as a binary response
        res.setHeader('Content-Length', totalBytes)
        res.setHeader('Content-Type', 'audio/mp3')
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${videoId}.mp3"`,
        )
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.send(buffer)
    } catch (err) {
        console.error(err)
        if (!res.headersSent) {
            res.writeHead(500)
            res.end('internal system error')
        }
    }
}