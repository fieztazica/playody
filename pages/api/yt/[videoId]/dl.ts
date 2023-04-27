// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBasicInfo, getURLVideoID, getVideoID, validateID, validateURL } from 'ytdl-core';
const ytdl = require('ytdl-core');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { videoId } = req.query

        const uri = `http://youtube.com/watch?v=${validateYoutube(decodeURIComponent(videoId as string))}`

        downloadify(res, uri)
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

async function downloadify(res: NextApiResponse, uri: string, opt?: any) {
    opt = {
        ...opt,
        filter: 'audioonly'
    }

    const info = await getBasicInfo(uri);

    if (!info) {
        res.status(404).send('not found');
        return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(
        info.videoDetails.title
    )}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const audioStream = ytdl(uri, opt)

    audioStream.pipe(res);
}
