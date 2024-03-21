import { Lyrics } from '@/typings'
import { useEffect, useState } from 'react'
import { useAudioCtx } from '../contexts/AudioContext'

export default function useLyrics() {
    const { currentTime, playingTrack } = useAudioCtx()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lyrics, setLyrics] = useState<Lyrics>([])

    const reset = () => {
        setLyrics([])
        setIsLoading(false)
    }

    useEffect(() => {
        if (!playingTrack) {
            reset()
            return
        }

        ;(async () => {
            try {
                setIsLoading(true)
                const query = encodeURIComponent(
                    `${playingTrack.artists.join(' ')} ${playingTrack.name}`
                )

                const res = await fetch(`/api/lyrics?q=${query}`).then((r) =>
                    r.json()
                )
                const data = res.data as { lyrics: Lyrics; song: any }

                setLyrics(data.lyrics)

            } catch (error) {
                reset()
            } finally {
                setIsLoading(false)
            }
        })()

        return () => {
            reset()
        }
    }, [playingTrack])

    return {isLoading, lyrics, playingTrack, currentTime}
}
