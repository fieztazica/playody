import { Track } from '@/typings'
import { useAudioCtx } from '../contexts/AudioContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function useSearch() {
    const { addToQueue } = useAudioCtx()
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Track[]>([])
    const router = useRouter()
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        setQuery(decodeURIComponent((router.query.q || '') as string))
    }, [router.query.q])

    useEffect(() => {
        query
            ? router.replace(
                  {
                      pathname: '/search',
                      query: {
                          q: encodeURIComponent(query),
                      },
                  },
                  undefined,
                  { shallow: true }
              )
            : router.replace(
                  {
                      pathname: '/search',
                  },
                  undefined,
                  { shallow: true }
              )

        const timer = setTimeout(() => {
            findSong(query)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    async function findSong(query: string) {
        try {
            setSearching(true)
            if (query) {
                const res = await fetch(`/api/search?q=${query}`).then((r) =>
                    r.json()
                )

                if (res.data) {
                    setSearchResults(res.data)
                }
            } else {
                setSearchResults([])
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            setSearching(false)
        }
    }

    function handleDoubleClick(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        track: Track
    ) {
        if (event.detail == 2) {
            addToQueue(track)
        }
    }

    function handleOnQuery(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setQuery(event.target.value)
    }

    return {
        query,
        handleDoubleClick,
        handleOnQuery,searchResults, addToQueue, searching
    }
}
