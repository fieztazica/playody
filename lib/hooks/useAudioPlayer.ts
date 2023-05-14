import { useEffect, useState } from 'react'

type UseAudioPlayerResult = {
    audioUrl: string | null;
    loading: boolean;
    error: string | null
};

const useAudioPlayer = (videoId: string): UseAudioPlayerResult => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const loadAudio = async () => {
        if (!videoId)
            throw new Error('No videoId provided')

        // Fetch the transcoded audio stream from the API route
        const res = await fetch(`/api/yt/${videoId}`)

        if (!res.ok)
            throw new Error('Failed to fetch audio')

        // Create a new blob from the response body
        const blob = await res.blob()

        // Create a new URL for the blob
        const url = URL.createObjectURL(blob)

        // Set the audio URL and turn off the loading flag
        setAudioUrl(url)
    }

    useEffect(() => {
        try {
            setLoading(true)
            loadAudio()
            setError(null)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId])

    return { audioUrl, loading, error }
}

export default useAudioPlayer