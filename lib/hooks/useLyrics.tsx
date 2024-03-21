import { Lyrics } from '@/typings'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAudioCtx } from '../contexts/AudioContext'
import useIndicator from './useIndicator'
import { useAppStates } from '../contexts/AppContext'

export default function useLyrics() {
    const activeLine = useRef(null)
    const { indicator: appIndicator } = useAppStates()
    const { currentTime, playingTrack } = useAudioCtx()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lyrics, setLyrics] = useState<Lyrics>([])
    useIndicator(isLoading, { indicator: appIndicator })

    // Find the current line of lyrics based on the currentTime
    const currentLineIndex = useMemo(
        () =>
            lyrics.length &&
            lyrics.findIndex((line, index) => {
                const nextLineTime = lyrics[index + 1]
                    ? lyrics[index + 1].time
                    : Number.MAX_VALUE
                return line.time <= currentTime && currentTime < nextLineTime
            }),
        [currentTime, lyrics]
    )

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

                const lyrics = res?.data?.lyrics

                if (!lyrics || !lyrics.length)
                    throw new Error('Lyrics not found')

                setLyrics(lyrics)
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

    useEffect(() => {
        if (activeLine && activeLine.current) {
            activeLine.current.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
            })
        }
    }, [currentLineIndex])

    return {
        isLoading,
        lyrics,
        playingTrack,
        currentTime,
        currentLineIndex,
        activeLine,
    }
}
