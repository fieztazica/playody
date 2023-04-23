// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PassThrough } from 'stream'
import { getURLVideoID, getVideoID, validateID, validateURL } from 'ytdl-core'
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ytdl = require('ytdl-core')
const FFmpeg = require('fluent-ffmpeg')
const fs = require('fs')
FFmpeg.setFfmpegPath(ffmpegPath)

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { videoId } = req.query

        for await (const chunk of streamify(`http://youtube.com/watch?v=${validateYoutube(decodeURIComponent(videoId as string))}`)) {
            res.write(chunk)
        }
        res.end()
    } catch (err) {
        console.error(err)
        if (!res.headersSent) {
            res.writeHead(500)
            res.end('internal system error')
        }
    }
}

function validateYoutube(string: string) {
    if (validateID(string)) return getVideoID(string);
    if (!new URL(string) || !validateURL(string)) throw new Error("Not a URL");
    return getURLVideoID(string)
}

function streamify(uri: string, opt?: any) {
    opt = {
        ...opt,
        videoFormat: 'mp4',
        quality: 'lowest',
        audioFormat: 'mp3',
        filter(format: any) {
            return format.container === opt.videoFormat && format.audioBitrate
        }
    }

    const video = ytdl(uri, opt)
    const { file, audioFormat } = opt
    const stream = file ? fs.createWriteStream(file) : new PassThrough()
    const ffmpeg = new FFmpeg(video)

    process.nextTick(() => {
        const output = ffmpeg.format(audioFormat).pipe(stream)

        ffmpeg.once('error', (error: Error) => stream.emit('error', error))
        output.once('error', (error: Error) => {
            video.end()
            stream.emit('error', error)
        })
    })

    stream.video = video
    stream.ffmpeg = ffmpeg

    return stream
}
