import { useEffect, useState } from 'react'

type UseAudioPlayerResult = {
    audioUrl: string | null;
    loading: boolean;
};

const useAudioPlayer = (videoId: string): UseAudioPlayerResult => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadAudio = async () => {
            // Fetch the transcoded audio stream from the API route
            const res = await fetch(`/api/yt/${videoId}`)

            if (!res.ok) {
                console.error('Failed to fetch audio')
                return
            }

            // Create a new blob from the response body
            const blob = await res.blob()

            // Create a new URL for the blob
            const url = URL.createObjectURL(blob)

            // Set the audio URL and turn off the loading flag
            setAudioUrl(url)
            setLoading(false)
        }

        loadAudio()
    }, [videoId])

    return { audioUrl, loading }
}

export default useAudioPlayer